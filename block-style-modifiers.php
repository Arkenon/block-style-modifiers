<?php
/**
 * Plugin Name: Block Style Modifiers
 * Description: Adds additive, multi-select style modifiers to Gutenberg blocks.
 * Version: 1.0.0
 * Author: Kadim Gültekin
 * Author URI: https://kadimgultekin.com
 * License: GPL-3.0
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: bsm
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'BSM_PLUGIN_VERSION', '1.0.0' );
define( 'BSM_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'BSM_PLUGIN_URL', plugin_dir_url( __FILE__ ) );


/**
 * Internal registry
 */
function &bsm_get_style_modifier_registry(): array {
    static $registry = [];

    return $registry;
}

function register_block_style_modifier( string $block_name, array $modifier ): void {
    $registry = &bsm_get_style_modifier_registry();

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

function bsm_collect_inline_styles(): string {
    $registry = bsm_get_style_modifier_registry();
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


function bsm_enqueue_editor_assets(): void {
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

    $inline_css = bsm_collect_inline_styles();
    if ( $inline_css ) {
        wp_add_inline_style(
            'block-style-modifiers-editor-style',
            $inline_css
        );
    }

    wp_add_inline_script(
        'block-style-modifiers-editor',
        'window.__BLOCK_STYLE_MODIFIERS__ = ' . wp_json_encode(
            bsm_get_style_modifier_registry()
        ) . ';',
        'before'
    );
}
add_action( 'enqueue_block_editor_assets', 'bsm_enqueue_editor_assets' );

function bsm_enqueue_frontend_styles(): void {
    $inline_css = bsm_collect_inline_styles();
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
add_action( 'wp_enqueue_scripts', 'bsm_enqueue_frontend_styles' );

// Example Modifiers
include_once 'modifiers.php';
