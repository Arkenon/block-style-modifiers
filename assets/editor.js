const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, FormTokenField } = wp.components;
const { Fragment } = wp.element;

/**
 * Helper: get modifiers for a block
 */
function getModifiersForBlock( blockName ) {
    const registry = window.__BLOCK_STYLE_MODIFIERS__ || {};

    return {
        ...( registry['*'] || {} ),
        ...( registry[ blockName ] || {} ),
    };
}

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
const withStyleModifiersInspector = createHigherOrderComponent(
    ( BlockEdit ) => ( props ) => {
        const { name, attributes, setAttributes } = props;
        const modifiers = getModifiersForBlock( name );

        if ( Object.keys( modifiers ).length === 0 ) {
            return <BlockEdit { ...props } />;
        }

        const availableTokens = Object.values( modifiers ).map(
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
                            suggestions={ availableTokens }
                            onChange={ ( newTokens ) =>
                                setAttributes( { styleModifiers: newTokens } )
                            }
                        />
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    },
    'withStyleModifiersInspector'
);

addFilter(
    'editor.BlockEdit',
    'bsm/with-style-modifiers-inspector',
    withStyleModifiersInspector
);

/**
 * 3. Apply classes on save
 */
addFilter(
    'blocks.getSaveContent.extraProps',
    'bsm/apply-style-modifiers',
    ( extraProps, blockType, attributes ) => {
        if ( ! attributes.styleModifiers || attributes.styleModifiers.length === 0 ) {
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
