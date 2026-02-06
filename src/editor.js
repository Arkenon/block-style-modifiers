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
import {PanelBody, RadioControl, CheckboxControl, Button} from '@wordpress/components';
import {Fragment, useState} from '@wordpress/element';
import '@bsm/editor.scss';

/**
 * Normalize category to structured object format
 * @param {Object} category - Category object with slug, label, description, exclusive
 * @returns {Object} Normalized category object
 * @since 1.0.0
 */
const normalizeCategoryObject = (category) => {
    // Category must be an object
    if (typeof category !== 'object' || category === null) {
        console.error('Block Style Modifiers: Category must be an object with slug, label, description, and exclusive properties.');
        return {
            slug: 'uncategorized',
            label: __('Uncategorized', 'block-style-modifiers'),
            description: '',
            exclusive: false,
        };
    }

    // Return normalized object with defaults
    return {
        slug: category.slug || 'uncategorized',
        label: category.label || category.slug || 'Uncategorized',
        description: category.description || '',
        exclusive: category.exclusive === true,
    };
};

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
            category: normalizeCategoryObject(mod.category),
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
            category: normalizeCategoryObject(mod.category),
            name: mod.name,
        }));
    }
};

/**
 * Group modifiers by category
 * @param {Array} modifiers Array of modifiers with normalized category objects
 * @returns {Object} Modifiers grouped by category slug with metadata
 * @since 1.0.0
 */
const groupModifiersByCategory = (modifiers) => {
    return modifiers.reduce((acc, mod) => {
        const categoryObj = mod.category;
        const slug = categoryObj.slug;

        if (!acc[slug]) {
            acc[slug] = {
                meta: categoryObj,
                modifiers: []
            };
        }
        acc[slug].modifiers.push(mod);
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

        // Toggle modifier selection (category-aware)
        const toggleModifier = (modifierClass, categorySlug) => {
            const categoryGroup = groupedModifiers[categorySlug];
            if (!categoryGroup) return;

            // Check if category is exclusive
            const isExclusive = categoryGroup.meta.exclusive;

            if (isExclusive) {
                // Remove all modifiers from the same category
                const modifiersInCategory = categoryGroup.modifiers.map(m => m.class);
                const filteredClasses = selectedClasses.filter(c => !modifiersInCategory.includes(c));

                // If the clicked modifier is already selected, just remove it (deselect)
                if (selectedClasses.includes(modifierClass)) {
                    setAttributes({
                        styleModifiers: filteredClasses
                    });
                } else {
                    // Add the new modifier
                    setAttributes({
                        styleModifiers: [...filteredClasses, modifierClass]
                    });
                }
            } else {
                // Non-exclusive: toggle like checkbox
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
                                                onClick={() => toggleModifier(mod.class, mod.category.slug)}
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
                            {Object.keys(groupedModifiers).map(categorySlug => {
                                const categoryGroup = groupedModifiers[categorySlug];
                                const categoryMeta = categoryGroup.meta;
                                const categoryModifiers = categoryGroup.modifiers;
                                const isExclusive = categoryMeta.exclusive;

                                if (isExclusive) {
                                    // Exclusive category: use RadioControl
                                    const selectedInCategory = categoryModifiers.find(mod =>
                                        selectedClasses.includes(mod.class)
                                    );
                                    const selectedValue = selectedInCategory ? selectedInCategory.class : '';

                                    const options = [
                                        { label: __('None', 'block-style-modifiers'), value: '' },
                                        ...categoryModifiers.map(mod => ({
                                            label: mod.label,
                                            value: mod.class,
                                        }))
                                    ];

                                    return (
                                        <PanelBody
                                            key={categorySlug}
                                            title={categoryMeta.label}
                                            initialOpen={false}
                                        >
                                            {categoryMeta.description && (
                                                <p className="block-style-modifiers__category-description">
                                                    {categoryMeta.description}
                                                </p>
                                            )}
                                            <RadioControl
                                                selected={selectedValue}
                                                options={options}
                                                onChange={(value) => {
                                                    if (value === '') {
                                                        // Remove all from this category
                                                        const modifiersInCategory = categoryModifiers.map(m => m.class);
                                                        setAttributes({
                                                            styleModifiers: selectedClasses.filter(c => !modifiersInCategory.includes(c))
                                                        });
                                                    } else {
                                                        // Select new modifier
                                                        toggleModifier(value, categorySlug);
                                                    }
                                                }}
                                            />
                                        </PanelBody>
                                    );
                                } else {
                                    // Non-exclusive category: use CheckboxControl
                                    return (
                                        <PanelBody
                                            key={categorySlug}
                                            title={categoryMeta.label}
                                            initialOpen={false}
                                        >
                                            {categoryMeta.description && (
                                                <p className="block-style-modifiers__category-description">
                                                    {categoryMeta.description}
                                                </p>
                                            )}
                                            {categoryModifiers.map(modifier => (
                                                <CheckboxControl
                                                    key={modifier.class}
                                                    label={modifier.label}
                                                    help={modifier.description}
                                                    checked={selectedClasses.includes(modifier.class)}
                                                    onChange={() => toggleModifier(modifier.class, categorySlug)}
                                                    __nextHasNoMarginBottom={true}
                                                />
                                            ))}
                                        </PanelBody>
                                    );
                                }
                            })}
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