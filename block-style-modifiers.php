<?php
/**
 * Plugin Name: Block Style Modifiers
 * Description: Adds additive, multi-select style modifiers to Gutenberg blocks.
 * Version: 1.0.7
 * Author: Kadim Gültekin
 * Author URI: https://github.com/Arkenon
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: block-style-modifiers
 */

if (!defined('ABSPATH')) {
    exit;
}

// Define constants
define('BSM_PLUGIN_VERSION', get_file_data(__FILE__, array('version' => 'Version'))['version']);
define('BSM_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('BSM_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once BSM_PLUGIN_DIR . 'inc/default-modifiers.php';
require_once BSM_PLUGIN_DIR . 'inc/class-bsm-rest-controller.php';

if (!function_exists("block_style_modifiers_get_registry")) {
    /**
     * Get the registry of block style modifiers.
     * @return array The registry of block style modifiers.
     * @since 1.0.0
     */
    function &block_style_modifiers_get_registry(): array
    {
        static $registry = [];

        return $registry;
    }
}

if (!function_exists("block_style_modifiers_get_category_registry")) {
    /**
     * Get the registry of block style modifier categories.
     * @return array The registry of categories.
     * @since 1.0.8
     */
    function &block_style_modifiers_get_category_registry(): array
    {
        static $category_registry = [];

        return $category_registry;
    }
}

if (!function_exists("block_style_modifiers_register_category")) {
    /**
     * Register a block style modifier category.
     *
     * @param string $slug Category slug (unique identifier).
     * @param array $args Category arguments: label, description, exclusive.
     *
     * @return void
     * @since 1.0.8
     */
    function block_style_modifiers_register_category(string $slug, array $args): void
    {
        $category_registry = &block_style_modifiers_get_category_registry();

        // Validate slug
        if (empty($slug) || !is_string($slug)) {
            error_log('BSM: Invalid category slug provided');
            return;
        }

        // Normalize category data
        $category_registry[$slug] = wp_parse_args(
            $args,
            [
                'label' => $slug,
                'description' => '',
                'exclusive' => false,
            ]
        );

        // Add slug to the registry for reference
        $category_registry[$slug]['slug'] = $slug;

        // Ensure exclusive is always a boolean
        $category_registry[$slug]['exclusive'] = (bool) $category_registry[$slug]['exclusive'];

        // Debug log
        error_log('BSM: Registered category: ' . $slug . ' | exclusive=' . ($category_registry[$slug]['exclusive'] ? 'true' : 'false') . ' | Total categories: ' . count($category_registry));
    }
}

if (!function_exists("block_style_modifiers_register_style")) {
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
    function block_style_modifiers_register_style($block_name, array $modifier): void
    {

        // Validate if block name and modifier name are string or array
        if (!is_string($block_name) && !is_array($block_name)) {
            return;
        }

        // Validate modifier name is set and is a string without spaces
        if (!isset($modifier['name']) || !is_string($modifier['name'])) {
            return;
        }

        // Validate modifier name does not contain spaces
        if (str_contains($modifier['name'], ' ')) {
            return;
        }

        // Validate modifier class is set and is a string
        if (!isset($modifier['class']) || !is_string($modifier['class'])) {
            return;
        }


        if (is_array($block_name)) {
            foreach ($block_name as $block) {
                block_style_modifiers_register_single_modifier($block, $modifier);
            }
        } else {
            block_style_modifiers_register_single_modifier($block_name, $modifier);
        }
    }
}

if (!function_exists("block_style_modifiers_register_single_modifier")) {
    /**
     * Register a single block style modifier.
     *
     * @param string $block_name Block type name including namespace.
     * @param array $modifier Array containing the properties of the style modifier: name, label, class, description, category, inline_style
     *
     * @return void
     * @since 1.0.0
     */
    function block_style_modifiers_register_single_modifier(string $block_name, array $modifier)
    {
        $registry = &block_style_modifiers_get_registry();


        if (!isset($registry[$block_name])) {
            $registry[$block_name] = [];
        }

        // Handle category: store only the slug, not the entire object
        // JavaScript will resolve the category from the category registry
        $category_slug = '';
        if (isset($modifier['category'])) {
            if (is_string($modifier['category'])) {
                // Already a slug, just use it
                $category_slug = $modifier['category'];
            } else if (is_array($modifier['category']) && isset($modifier['category']['slug'])) {
                // Extract slug from category object
                $category_slug = $modifier['category']['slug'];
            }
        }

        $registry[$block_name][$modifier['name']] = wp_parse_args(
            $modifier,
            [
                'label' => $modifier['name'],
                'description' => '',
                'category' => '',
                'inline_style' => '',
            ]
        );

        // Override category with just the slug
        $registry[$block_name][$modifier['name']]['category'] = $category_slug;
    }
}


if (!function_exists("block_style_modifiers_collect_inline_styles")) {
    /**
     * Collect inline styles from all registered modifiers.
     *
     * @return string
     * @since 1.0.0
     */
    function block_style_modifiers_collect_inline_styles(): string
    {
        $registry = &block_style_modifiers_get_registry();
        $styles = '';

        foreach ($registry as $block => $modifiers) {
            foreach ($modifiers as $modifier) {
                if (!empty($modifier['inline_style'])) {
                    $styles .= $modifier['inline_style'];
                }
            }
        }

        return trim($styles);
    }
}


if (!function_exists("block_style_modifiers_enqueue_editor_assets")) {
    /**
     * Enqueue editor assets for block style modifiers.
     *
     * @return void
     * @since 1.0.0
     */
    function block_style_modifiers_enqueue_editor_assets(): void
    {
        wp_enqueue_script(
            'block-style-modifiers-editor',
            BSM_PLUGIN_URL . '/build/editor.js',
            ['wp-blocks', 'wp-element', 'wp-components', 'wp-compose', 'wp-data', 'wp-hooks', 'wp-editor'],
            BSM_PLUGIN_VERSION,
            true
        );

        if (function_exists('wp_set_script_translations')) {
            $path = defined('BSM_PLUGIN_DIR') ? BSM_PLUGIN_DIR . 'languages' : '';
            wp_set_script_translations('block-style-modifiers-editor', 'block-style-modifiers', $path);
        }

        // Enqueue built editor stylesheet
        wp_enqueue_style(
            'block-style-modifiers-editor-style',
            BSM_PLUGIN_URL . '/build/editor.css',
            [],
            BSM_PLUGIN_VERSION
        );

        wp_enqueue_style(
            'block-style-modifier-editor-style-custom',
            BSM_PLUGIN_URL . '/assets/default-modifiers.css',
            [],
            BSM_PLUGIN_VERSION
        );

        $inline_css = block_style_modifiers_collect_inline_styles();
        if ($inline_css) {
            wp_add_inline_style(
                'block-style-modifiers-editor-style',
                esc_html($inline_css)
            );
        }

        wp_add_inline_script(
            'block-style-modifiers-editor',
            'window.__BLOCK_STYLE_MODIFIERS__ = ' . wp_json_encode(
                block_style_modifiers_get_registry()
            ) . ';' .
            'window.__BLOCK_STYLE_MODIFIERS_CATEGORIES__ = ' . wp_json_encode(
                block_style_modifiers_get_category_registry()
            ) . ';',
            'before'
        );

        // Debug log
        $cat_registry = block_style_modifiers_get_category_registry();
        error_log('BSM: Enqueuing assets. Category registry count: ' . count($cat_registry) . ' | Keys: ' . implode(', ', array_keys($cat_registry)));
    }
}

if (!function_exists('block_style_modifiers_load_custom_modifiers')) {
    /**
     * Load custom modifiers from wp_options
     *
     * @return void
     * @since 1.0.8
     */
    function block_style_modifiers_load_custom_modifiers()
    {
        // Load custom categories
        $custom_categories = get_option('bsm_custom_categories', []);
        if (is_array($custom_categories)) {
            foreach ($custom_categories as $category) {
                if (isset($category['slug']) && !empty($category['slug'])) {
                    // Convert exclusive to boolean - handle various formats more reliably
                    $exclusive = false;
                    if (isset($category['exclusive'])) {
                        // REST API sends true boolean, but when retrieved from options it might be different
                        if (is_bool($category['exclusive'])) {
                            $exclusive = $category['exclusive'];
                        } else if (is_numeric($category['exclusive'])) {
                            $exclusive = (int)$category['exclusive'] === 1;
                        } else if (is_string($category['exclusive'])) {
                            $exclusive = in_array(strtolower($category['exclusive']), ['true', '1', 'yes', 'on'], true);
                        }
                    }

                    // Debug log - remove after testing
                    error_log(sprintf(
                        'BSM: Loading custom category: %s | exclusive input=%s (type=%s) | exclusive output=%s',
                        $category['slug'],
                        var_export($category['exclusive'] ?? 'not set', true),
                        gettype($category['exclusive'] ?? null),
                        $exclusive ? 'true' : 'false'
                    ));

                    block_style_modifiers_register_category(
                        $category['slug'],
                        [
                            'label' => $category['label'] ?? $category['slug'],
                            'description' => $category['description'] ?? '',
                            'exclusive' => $exclusive,
                        ]
                    );
                }
            }
        }

        // Load custom modifiers
        $custom_modifiers = get_option('bsm_custom_modifiers', []);
        if (is_array($custom_modifiers)) {
            foreach ($custom_modifiers as $modifier) {
                if (isset($modifier['blocks']) && isset($modifier['name']) && isset($modifier['class'])) {
                    block_style_modifiers_register_style(
                        $modifier['blocks'],
                        [
                            'name' => $modifier['name'],
                            'label' => $modifier['label'] ?? $modifier['name'],
                            'class' => $modifier['class'],
                            'description' => $modifier['description'] ?? '',
                            'category' => $modifier['category'] ?? '',
                            'inline_style' => $modifier['inline_style'] ?? '',
                        ]
                    );
                }
            }
        }
    }
}


// Initialize plugin on plugins_loaded hook
add_action('plugins_loaded', function () {
    // Load default modifiers
    add_action('init', 'block_style_modifiers_register_defaults');

    // Load custom modifiers
    add_action('init', 'block_style_modifiers_load_custom_modifiers', 11);

    // Enqueue assets both for editor and frontend
    add_action('enqueue_block_assets', 'block_style_modifiers_enqueue_editor_assets');

    // Register REST API routes
    add_action('rest_api_init', function () {
        $controller = new BSM_REST_Controller();
        $controller->register_routes();
    });

    // Add admin menu
    add_action('admin_menu', 'block_style_modifiers_add_admin_menu');

    // Enqueue admin assets
    add_action('admin_enqueue_scripts', 'block_style_modifiers_enqueue_admin_assets');
});

if (!function_exists('block_style_modifiers_add_admin_menu')) {
    /**
     * Add admin menu page
     *
     * @return void
     * @since 1.0.8
     */
    function block_style_modifiers_add_admin_menu()
    {
        add_options_page(
            __('Block Style Modifiers', 'block-style-modifiers'),
            __('Block Style Modifiers', 'block-style-modifiers'),
            'manage_options',
            'block-style-modifiers',
            'block_style_modifiers_render_admin_page'
        );
    }
}

if (!function_exists('block_style_modifiers_render_admin_page')) {
    /**
     * Render admin page
     *
     * @return void
     * @since 1.0.8
     */
    function block_style_modifiers_render_admin_page()
    {
        echo '<div class="wrap">';
        echo '<div id="bsm-admin-root"></div>';
        echo '</div>';
    }
}

if (!function_exists('block_style_modifiers_enqueue_admin_assets')) {
    /**
     * Enqueue admin assets
     *
     * @param string $hook_suffix
     * @return void
     * @since 1.0.8
     */
    function block_style_modifiers_enqueue_admin_assets($hook_suffix)
    {
        // Only load on our settings page
        if ($hook_suffix !== 'settings_page_block-style-modifiers') {
            return;
        }

        $asset_file = BSM_PLUGIN_DIR . 'build/admin.asset.php';

        if (!file_exists($asset_file)) {
            return;
        }

        $asset = include $asset_file;

        wp_enqueue_script(
            'block-style-modifiers-admin',
            BSM_PLUGIN_URL . 'build/admin.js',
            $asset['dependencies'],
            $asset['version'],
            true
        );

        if (function_exists('wp_set_script_translations')) {
            wp_set_script_translations(
                'block-style-modifiers-admin',
                'block-style-modifiers',
                BSM_PLUGIN_DIR . 'languages'
            );
        }

        // Only enqueue CSS if it exists
        $css_file = BSM_PLUGIN_DIR . 'build/admin.css';
        if (file_exists($css_file)) {
            wp_enqueue_style(
                'block-style-modifiers-admin',
                BSM_PLUGIN_URL . 'build/admin.css',
                ['wp-components'],
                $asset['version']
            );
        }

        // Pass data to JavaScript
        wp_localize_script(
            'block-style-modifiers-admin',
            'bsmAdmin',
            [
                'apiUrl' => rest_url('block-style-modifiers/v1'),
                'nonce' => wp_create_nonce('wp_rest'),
            ]
        );
    }
}

