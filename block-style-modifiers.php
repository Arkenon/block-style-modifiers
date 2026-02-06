<?php
/**
 * Plugin Name: Block Style Modifiers
 * Description: Adds additive, multi-select style modifiers to Gutenberg blocks.
 * Version: 1.0.6
 * Author: Kadim Gültekin
 * Author URI: https://github.com/Arkenon
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: block-style-modifiers
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define constants
define( 'BSM_PLUGIN_VERSION', get_file_data( __FILE__, array( 'version' => 'Version' ) )['version'] );
define( 'BSM_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'BSM_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

if ( ! function_exists( "block_style_modifiers_get_registry" ) ) {
    /**
     * Get the registry of block style modifiers.
     * @return array The registry of block style modifiers.
     * @since 1.0.0
     */
    function &block_style_modifiers_get_registry(): array {
        static $registry = [];

        return $registry;
    }
}

if ( ! function_exists( "block_style_modifiers_register_style" ) ) {
    /**
     * Register a block style modifier.
     * Registers a style modifier for a specific block.
     *
     * @param string|array $block_name Block type name including namespace or array of namespaced block type names.
     * @param array $modifier Array containing the properties of the style modifier: name, label, class, description, category, inline_style
     *
     * @return void
     * @since 1.0.0
     */
    function block_style_modifiers_register_style( $block_name, array $modifier ): void {

        // Validate if block name and modifier name are string or array
        if ( ! is_string( $block_name ) && ! is_array( $block_name ) ) {
            return;
        }

        // Validate modifier name is set and is a string without spaces
        if ( ! isset( $modifier['name'] ) || ! is_string( $modifier['name'] ) ) {
            return;
        }

        // Validate modifier name does not contain spaces
        if ( str_contains( $modifier['name'], ' ' ) ) {
            return;
        }

        // Validate modifier class is set and is a string
        if ( ! isset( $modifier['class'] ) || ! is_string( $modifier['class'] ) ) {
            return;
        }


        if ( is_array( $block_name ) ) {
            foreach ( $block_name as $block ) {
                block_style_modifiers_register_single_modifier( $block, $modifier );
            }
        } else {
            block_style_modifiers_register_single_modifier( $block_name, $modifier );
        }
    }
}

if ( ! function_exists( "block_style_modifiers_register_single_modifier" ) ) {
    /**
     * Register a single block style modifier.
     *
     * @param string $block_name Block type name including namespace.
     * @param array $modifier Array containing the properties of the style modifier: name, label, class, description, category, inline_style
     *
     * @return void
     * @since 1.0.0
     */
    function block_style_modifiers_register_single_modifier( string $block_name, array $modifier ) {
        $registry = &block_style_modifiers_get_registry();


        if ( ! isset( $registry[ $block_name ] ) ) {
            $registry[ $block_name ] = [];
        }

        $registry[ $block_name ][ $modifier['name'] ] = wp_parse_args(
            $modifier,
            [
                'label'        => $modifier['name'],
                'description'  => '',
                'category'     => '',
                'inline_style' => '',
            ]
        );
    }
}


if ( ! function_exists( "block_style_modifiers_collect_inline_styles" ) ) {
    /**
     * Collect inline styles from all registered modifiers.
     *
     * @return string
     * @since 1.0.0
     */
    function block_style_modifiers_collect_inline_styles(): string {
        $registry = &block_style_modifiers_get_registry();
        $styles   = '';

        foreach ( $registry as $block => $modifiers ) {
            foreach ( $modifiers as $modifier ) {
                if ( ! empty( $modifier['inline_style'] ) ) {
                    $styles .= $modifier['inline_style'];
                }
            }
        }

        return trim( $styles );
    }
}


if ( ! function_exists( "block_style_modifiers_enqueue_editor_assets" ) ) {
    /**
     * Enqueue editor assets for block style modifiers.
     *
     * @return void
     * @since 1.0.0
     */
    function block_style_modifiers_enqueue_editor_assets(): void {
        wp_enqueue_script(
            'block-style-modifiers-editor',
            BSM_PLUGIN_URL . '/build/editor.js',
            [ 'wp-blocks', 'wp-element', 'wp-components', 'wp-compose', 'wp-data', 'wp-hooks', 'wp-editor' ],
            BSM_PLUGIN_VERSION,
            true
        );

        if ( function_exists( 'wp_set_script_translations' ) ) {
            $path = defined( 'BSM_PLUGIN_DIR' ) ? BSM_PLUGIN_DIR . 'languages' : '';
            wp_set_script_translations( 'block-style-modifiers-editor', 'block-style-modifiers', $path );
        }

        // Enqueue built editor stylesheet
        wp_enqueue_style(
            'block-style-modifiers-editor-style',
            BSM_PLUGIN_URL . '/build/editor.css',
            [],
            BSM_PLUGIN_VERSION
        );

        $inline_css = block_style_modifiers_collect_inline_styles();
        if ( $inline_css ) {
            wp_add_inline_style(
                'block-style-modifiers-editor-style',
                esc_html( $inline_css )
            );
        }

        wp_add_inline_script(
            'block-style-modifiers-editor',
            'window.__BLOCK_STYLE_MODIFIERS__ = ' . wp_json_encode(
                block_style_modifiers_get_registry()
            ) . ';',
            'before'
        );
    }


}


if ( ! function_exists( "block_style_modifiers_enqueue_frontend_styles" ) ) {
    /**
     * Enqueue frontend styles for block style modifiers.
     * @return void
     * @since 1.0.0
     */
    function block_style_modifiers_enqueue_frontend_styles(): void {
        $inline_css = block_style_modifiers_collect_inline_styles();
        if ( ! $inline_css ) {
            return;
        }

        wp_register_style( 'block-style-modifiers-style', false, [], BSM_PLUGIN_VERSION );
        wp_enqueue_style( 'block-style-modifiers-style' );

        wp_add_inline_style(
            'block-style-modifiers-style',
            esc_html( $inline_css )
        );
    }


}

add_action('plugins_loaded', function (){
    // Include default modifiers
    require_once BSM_PLUGIN_DIR . 'inc/default-modifiers.php';

    add_action( 'wp_enqueue_scripts', 'block_style_modifiers_enqueue_frontend_styles' );
    add_action( 'enqueue_block_editor_assets', 'block_style_modifiers_enqueue_editor_assets' );
});