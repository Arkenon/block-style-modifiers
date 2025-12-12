<?php
/**
 * Plugin Name: Block Style Modifiers
 * Description: Adds additive, multi-select style modifiers to Gutenberg blocks.
 * Version: 1.0.0
 * Author: Kadim Gültekin
 * Author URI: https://kadimgultekin.com
 * License: GPL-3.0
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: block-style-modifiers
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define constants
define( 'BSM_PLUGIN_VERSION', '1.0.0' );
define( 'BSM_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'BSM_PLUGIN_URL', plugin_dir_url( __FILE__ ) );


if ( ! function_exists( "block_style_modifiers_get__registry" ) ) {
    /**
     * Get the registry of block style modifiers.
     * @return array The registry of block style modifiers.
     * @since 1.0.0
     */
    function &block_style_modifiers_get__registry(): array {
        static $registry = [];

        return $registry;
    }
}

if ( ! function_exists( "register_block_style_modifier" ) ) {
    /**
     * Register a block style modifier.
     * Registers a style modifier for a specific block.
     *
     * @param string $block_name
     * @param array $modifier
     *
     * @return void
     * @since 1.0.0
     */
    function register_block_style_modifier( string $block_name, array $modifier ): void {
        $registry = &block_style_modifiers_get__registry();

        if ( empty( $modifier['name'] ) || empty( $modifier['class'] ) ) {
            return;
        }

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
        $registry = &block_style_modifiers_get__registry();
        $styles   = '';

        foreach ( $registry as $block => $modifiers ) {
            foreach ( $modifiers as $modifier ) {
                if ( ! empty( $modifier['inline_style'] ) ) {
                    $styles .= "\n" . $modifier['inline_style'];
                }
            }
        }

        return trim( $styles );
    }
}


if ( ! function_exists( "block_style_modifiers_get__registry" ) ) {
    /**
     * Enqueue editor assets for block style modifiers.
     *
     * @return void
     * @since 1.0.0
     */
    function block_style_modifiers_enqueue_editor_assets(): void {
        wp_enqueue_script(
            'block-style-modifiers-editor',
            plugins_url( 'build/editor.js', __FILE__ ),
            [ 'wp-blocks', 'wp-element', 'wp-components', 'wp-compose', 'wp-data', 'wp-hooks', 'wp-editor' ],
            BSM_PLUGIN_VERSION,
            true
        );

        // Dummy style handle
        wp_register_style( 'block-style-modifiers-editor-style', false );
        wp_enqueue_style( 'block-style-modifiers-editor-style' );

        $inline_css = block_style_modifiers_collect_inline_styles();
        if ( $inline_css ) {
            wp_add_inline_style(
                'block-style-modifiers-editor-style',
                $inline_css
            );
        }

        wp_add_inline_script(
            'block-style-modifiers-editor',
            'window.__BLOCK_STYLE_MODIFIERS__ = ' . wp_json_encode(
                block_style_modifiers_get__registry()
            ) . ';',
            'before'
        );
    }

    add_action( 'enqueue_block_editor_assets', 'block_style_modifiers_enqueue_editor_assets' );
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

        wp_register_style( 'block-style-modifiers-style', false );
        wp_enqueue_style( 'block-style-modifiers-style' );

        wp_add_inline_style(
            'block-style-modifiers-style',
            $inline_css
        );
    }

    add_action( 'wp_enqueue_scripts', 'block_style_modifiers_enqueue_frontend_styles' );
}


// Example Modifiers (Will be removed)
include_once 'modifiers.php';
