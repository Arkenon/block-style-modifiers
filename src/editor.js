/**
 * Block Style Modifiers - Editor Script
 * Adds style modifier functionality to Gutenberg blocks via filters and HOCs.
 * @since 1.0.0
 * @package block-style-modifiers
 * @license GPL-3.0-or-later
 * @author Kadim Gültekin
 */

import {__} from '@wordpress/i18n';
import {addFilter} from '@wordpress/hooks';
import {createHigherOrderComponent} from '@wordpress/compose';
import {InspectorControls} from '@wordpress/block-editor';
import {PanelBody, CheckboxControl, Button} from '@wordpress/components';
import {Fragment, useState} from '@wordpress/element';
import '@bsm/editor.scss';

/**
 * Get modifiers for a specific block with metadata
 * @param {string} blockName Block name.
 * @returns {Array} Array of modifier objects with metadata.
 * @since 1.0.0
 */
const getModifiersForBlock = (blockName) => {
    const registry = window.__BLOCK_STYLE_MODIFIERS__ || {};
    
    const globalModifiers = registry['*'] || {};

    // Check if blockName is an array
    if(Array.isArray(blockName)) {
        let combinedModifiers = {...globalModifiers};
        blockName.forEach(name => {
            const blockMods = registry[name] || {};
            combinedModifiers = {
                ...combinedModifiers,
                ...blockMods,
            };
        });
        return Object.values(combinedModifiers).map(mod => ({
            class: mod.class,
            label: mod.label || mod.name,
            description: mod.description || '',
            category: mod.category || 'Uncategorized',
            name: mod.name,
        }));

    } else {
        // Single block name
        const blockModifiers = registry[blockName] || {};

        const allModifiers = {
            ...globalModifiers,
            ...blockModifiers,
        };

        // Convert to array with metadata
        return Object.values(allModifiers).map(mod => ({
            class: mod.class,
            label: mod.label || mod.name,
            description: mod.description || '',
            category: mod.category || 'Uncategorized',
            name: mod.name,
        }));
    }
};

/**
 * Group modifiers by category
 * @param {Array} modifiers Array of modifiers
 * @returns {Object} Modifiers grouped by category
 * @since 1.0.0
 */
const groupModifiersByCategory = (modifiers) => {
    return modifiers.reduce((acc, mod) => {
        const cat = mod.category || 'Uncategorized';
        if (!acc[cat]) {
            acc[cat] = [];
        }
        acc[cat].push(mod);
        return acc;
    }, {});
};

/**
 * Add styleModifiers attribute to all blocks
 * @since 1.0.0
 * @return {Object} Modified block settings.
 */
addFilter(
    'blocks.registerBlockType',
    'block-style-modifiers/add-style-modifiers-attribute',
    (settings) => {
        settings.attributes = {
            ...settings.attributes,
            styleModifiers: {
                type: 'array',
                default: [],
            },
        };
        return settings;
    }
);

/**
 * Add inspector controls to select style modifiers
 * @since 1.0.0
 * @return {element} Modified BlockEdit component.
 */
const withStyleModifiers = createHigherOrderComponent(
    (BlockEdit) => (props) => {
        const {name, attributes, setAttributes} = props;
        const allModifiers = getModifiersForBlock(name);
        const groupedModifiers = groupModifiersByCategory(allModifiers);
        const selectedClasses = attributes.styleModifiers || [];
        
        const [draggedIndex, setDraggedIndex] = useState(null);

        // Toggle modifier selection
        const toggleModifier = (modifierClass) => {
            const isSelected = selectedClasses.includes(modifierClass);
            if (isSelected) {
                setAttributes({
                    styleModifiers: selectedClasses.filter(c => c !== modifierClass)
                });
            } else {
                setAttributes({
                    styleModifiers: [...selectedClasses, modifierClass]
                });
            }
        };

        // Drag handlers
        const handleDragStart = (e, index) => {
            setDraggedIndex(index);
            e.dataTransfer.effectAllowed = 'move';
        };

        const handleDragOver = (e, index) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        };

        const handleDrop = (e, dropIndex) => {
            e.preventDefault();
            if (draggedIndex === null || draggedIndex === dropIndex) return;
            
            const newOrder = [...selectedClasses];
            const [removed] = newOrder.splice(draggedIndex, 1);
            newOrder.splice(dropIndex, 0, removed);
            
            setAttributes({ styleModifiers: newOrder });
            setDraggedIndex(null);
        };

        const handleDragEnd = () => {
            setDraggedIndex(null);
        };

        // Get selected modifiers with metadata
        const selectedModifiers = selectedClasses.map(className => {
            const mod = allModifiers.find(m => m.class === className);
            return mod || { class: className, label: className };
        });

        return (
            <Fragment>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody 
                        title={__('Style Modifiers', 'block-style-modifiers')} 
                        initialOpen={true}
                    >
                        {/* Selected modifiers list */}
                        {selectedClasses.length > 0 && (
                            <div className="block-style-modifiers__section">
                                <strong className="block-style-modifiers__section-title">
                                    {__('Selected Modifiers', 'block-style-modifiers')}
                                </strong>
                                <ul className="block-style-modifiers__selected-list">
                                    {selectedModifiers.map((mod, index) => (
                                        <li
                                            key={mod.class}
                                            draggable={true}
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDrop={(e) => handleDrop(e, index)}
                                            onDragEnd={handleDragEnd}
                                            title={mod.description || mod.label}
                                            className={`block-style-modifiers__selected-item${draggedIndex === index ? ' block-style-modifiers__selected-item--dragged' : ''}`}
                                        >
                                            <span className="block-style-modifiers__selected-item-label">
                                                ⋮⋮ {mod.label}
                                            </span>
                                            <Button
                                                isSmall
                                                variant="tertiary"
                                                icon="no-alt"
                                                onClick={() => toggleModifier(mod.class)}
                                                label={__('Remove', 'block-style-modifiers')}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {selectedClasses.length === 0 && (
                            <p className="block-style-modifiers__empty">
                                {__('No modifiers selected.', 'block-style-modifiers')}
                            </p>
                        )}

                        {/* Available modifiers by category */}
                        <div>
                            <strong className="block-style-modifiers__available-title">
                                {__('Available Modifiers', 'block-style-modifiers')}
                            </strong>
                            {Object.keys(groupedModifiers).map(category => (
                                <PanelBody
                                    key={category}
                                    title={category}
                                    initialOpen={false}
                                >
                                    {groupedModifiers[category].map(modifier => (
                                        <CheckboxControl
                                            key={modifier.class}
                                            label={modifier.label}
                                            title={modifier.description}
                                            checked={selectedClasses.includes(modifier.class)}
                                            onChange={() => toggleModifier(modifier.class)}
                                            __nextHasNoMarginBottom={true}
                                        />
                                    ))}
                                </PanelBody>
                            ))}
                        </div>
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    },
    'withStyleModifiers'
);

addFilter(
    'editor.BlockEdit',
    'block-style-modifiers/with-style-modifiers',
    withStyleModifiers
);

/**
 *  Apply style modifier classes to saved content
 *  @since 1.0.0
 *  @return {Object} Modified extraProps with style modifier classes.
 */
addFilter(
    'blocks.getSaveContent.extraProps',
    'block-style-modifiers/apply-style-modifiers',
    (extraProps, blockType, attributes) => {
        if (!attributes?.styleModifiers?.length) {
            return extraProps;
        }

        const existing = extraProps.className
            ? extraProps.className.split(' ')
            : [];

        extraProps.className = [
            ...existing,
            ...attributes.styleModifiers,
        ].join(' ');

        return extraProps;
    }
);

/**
 * Apply style modifier classes in the editor
 * @since 1.0.0
 * @return {element} Modified BlockListBlock component.
 */
const withStyleModifiersOnEditor = createHigherOrderComponent(
    (BlockListBlock) => (props) => {
        const {attributes} = props;

        if (!attributes?.styleModifiers?.length) {
            return <BlockListBlock {...props} />;
        }

        const modifierClasses = attributes.styleModifiers.join(' ');

        return (
            <BlockListBlock
                {...props}
                className={
                    props.className
                        ? `${props.className} ${modifierClasses}`
                        : modifierClasses
                }
            />
        );
    },
    'withStyleModifiersOnEditor'
);

addFilter(
    'editor.BlockListBlock',
    'block-style-modifiers/apply-style-modifiers-editor',
    withStyleModifiersOnEditor
);