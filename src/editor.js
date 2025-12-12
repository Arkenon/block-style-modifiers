import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, FormTokenField } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Registry helper
 */
const getModifiersForBlock = ( blockName ) => {
    const registry = window.__BLOCK_STYLE_MODIFIERS__ || {};

    return {
        ...( registry['*'] || {} ),
        ...( registry[ blockName ] || {} ),
    };
};

/**
 * 1. Extend block attributes
 */
addFilter(
    'blocks.registerBlockType',
    'bsm/add-style-modifiers-attribute',
    ( settings ) => {
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
 * 2. Inspector UI
 */
const withStyleModifiers = createHigherOrderComponent(
    ( BlockEdit ) => ( props ) => {
        const { name, attributes, setAttributes } = props;
        const modifiers = getModifiersForBlock( name );

        if ( ! Object.keys( modifiers ).length ) {
            return <BlockEdit { ...props } />;
        }

        const suggestions = Object.values( modifiers ).map(
            ( m ) => m.class
        );

        return (
            <Fragment>
                <BlockEdit { ...props } />
                <InspectorControls>
                    <PanelBody title="Style Modifiers" initialOpen={ false }>
                        <FormTokenField
                            label="Modifiers"
                            value={ attributes.styleModifiers }
                            suggestions={ suggestions }
                            __experimentalExpandOnFocus = {true}
                            onChange={ ( value ) =>
                                setAttributes( { styleModifiers: value } )
                            }
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
 * 3. Apply classes on save
 */
addFilter(
    'blocks.getSaveContent.extraProps',
    'bsm/apply-style-modifiers',
    ( extraProps, blockType, attributes ) => {
        if ( ! attributes?.styleModifiers?.length ) {
            return extraProps;
        }

        const existing = extraProps.className
            ? extraProps.className.split( ' ' )
            : [];

        extraProps.className = [
            ...existing,
            ...attributes.styleModifiers,
        ].join( ' ' );

        return extraProps;
    }
);

const withStyleModifiersOnEditor = createHigherOrderComponent(
    ( BlockListBlock ) => ( props ) => {
        const { attributes } = props;

        if ( ! attributes?.styleModifiers?.length ) {
            return <BlockListBlock { ...props } />;
        }

        const modifierClasses = attributes.styleModifiers.join( ' ' );

        return (
            <BlockListBlock
                { ...props }
                className={
                    props.className
                        ? `${ props.className } ${ modifierClasses }`
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