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
import {PanelBody, FormTokenField} from '@wordpress/components';
import {Fragment, useState} from '@wordpress/element';

/**
 * Registry helper
 * @param {string} blockName Block name.
 * @returns {Object} Modifiers for the block.
 * @since 1.0.0
 */
const getModifiersForBlock = (blockName) => {
    const registry = window.__BLOCK_STYLE_MODIFIERS__ || {};

    return {
        ...(registry['*'] || {}),
        ...(registry[blockName] || {}),
    };
};

/**
 * Add styleModifiers attribute to all blocks
 * @since 1.0.0
 * @return {Object} Modified block settings.
 */
addFilter(
    'blocks.registerBlockType',
    'bsm/add-style-modifiers-attribute',
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
        const modifiers = getModifiersForBlock(name);

        if (!Object.keys(modifiers).length) {
            return <BlockEdit {...props} />;
        }

        const suggestions = Object.values(modifiers).map(
            (m) => m.class
        );

        // Allow only valid tokens from suggestions
        const tokenIsValid = ( token ) => suggestions.some( value => value === token );

        return (
            <Fragment>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody title={__('Style Modifiers', 'block-style-modifiers')} initialOpen={true}>
                        <FormTokenField
                            label={__('Modifiers', 'block-style-modifiers')}
                            value={attributes.styleModifiers}
                            suggestions={suggestions}
                            __experimentalExpandOnFocus={true}
                            __nextHasNoMarginBottom = {true}
                            __next40pxDefaultSize = {true}
                            onChange={(value) =>
                                setAttributes({styleModifiers: value})
                            }
                            __experimentalValidateInput={ tokenIsValid }
                        />
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    },
    'withStyleModifiers'
);

addFilter(
    'editor.BlockEdit',
    'bsm/with-style-modifiers',
    withStyleModifiers
);

/**
 *  Apply style modifier classes to saved content
 *  @since 1.0.0
 *  @return {Object} Modified extraProps with style modifier classes.
 */
addFilter(
    'blocks.getSaveContent.extraProps',
    'bsm/apply-style-modifiers',
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
    'bsm/apply-style-modifiers-editor',
    withStyleModifiersOnEditor
);