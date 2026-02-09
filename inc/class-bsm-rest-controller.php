<?php
/**
 * Block Style Modifiers REST API Controller
 * Handles REST API endpoints for plugin settings, categories, and modifiers
 *
 * @package BlockStyleModifiers
 * @since 1.0.8
 */

if (!defined('ABSPATH')) {
    exit;
}

class BSM_REST_Controller extends WP_REST_Controller
{
    /**
     * Namespace for REST API
     * @var string
     */
    protected $namespace = 'block-style-modifiers/v1';

    /**
     * Register REST API routes
     *
     * @since 1.0.8
     */
    public function register_routes()
    {
        // Settings endpoint
        register_rest_route($this->namespace, '/settings', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_settings'],
                'permission_callback' => [$this, 'check_permission'],
            ],
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'update_settings'],
                'permission_callback' => [$this, 'check_permission'],
                'args' => [
                    'enable_default_modifiers' => [
                        'required' => true,
                        'type' => 'boolean',
                        'sanitize_callback' => 'rest_sanitize_boolean',
                    ],
                ],
            ],
        ]);

        // Categories endpoint
        register_rest_route($this->namespace, '/categories', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_categories'],
                'permission_callback' => [$this, 'check_permission'],
            ],
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'create_category'],
                'permission_callback' => [$this, 'check_permission'],
                'args' => [
                    'slug' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_key',
                        'validate_callback' => [$this, 'validate_slug'],
                    ],
                    'label' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'description' => [
                        'required' => false,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_textarea_field',
                    ],
                    'exclusive' => [
                        'required' => false,
                        'type' => 'boolean',
                        'default' => false,
                        'sanitize_callback' => 'rest_sanitize_boolean',
                    ],
                ],
            ],
        ]);

        // Single category endpoint
        register_rest_route($this->namespace, '/categories/(?P<slug>[a-zA-Z0-9_-]+)', [
            [
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => [$this, 'delete_category'],
                'permission_callback' => [$this, 'check_permission'],
                'args' => [
                    'slug' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_key',
                    ],
                ],
            ],
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'update_category'],
                'permission_callback' => [$this, 'check_permission'],
                'args' => [
                    'slug' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_key',
                    ],
                    'label' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'description' => [
                        'required' => false,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_textarea_field',
                    ],
                    'exclusive' => [
                        'required' => false,
                        'type' => 'boolean',
                        'sanitize_callback' => 'rest_sanitize_boolean',
                    ],
                ],
            ],
        ]);

        // Modifiers endpoint
        register_rest_route($this->namespace, '/modifiers', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_modifiers'],
                'permission_callback' => [$this, 'check_permission'],
            ],
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'create_modifier'],
                'permission_callback' => [$this, 'check_permission'],
                'args' => [
                    'name' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_key',
                        'validate_callback' => [$this, 'validate_modifier_name'],
                    ],
                    'label' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'class' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_html_class',
                    ],
                    'description' => [
                        'required' => false,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_textarea_field',
                    ],
                    'category' => [
                        'required' => false,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_key',
                    ],
                    'blocks' => [
                        'required' => true,
                        'type' => 'array',
                        'items' => [
                            'type' => 'string',
                        ],
                    ],
                    'inline_style' => [
                        'required' => false,
                        'type' => 'string',
                        'sanitize_callback' => [$this, 'sanitize_css'],
                    ],
                ],
            ],
        ]);

        // Single modifier endpoint
        register_rest_route($this->namespace, '/modifiers/(?P<name>[a-zA-Z0-9_-]+)', [
            [
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => [$this, 'delete_modifier'],
                'permission_callback' => [$this, 'check_permission'],
                'args' => [
                    'name' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_key',
                    ],
                ],
            ],
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'update_modifier'],
                'permission_callback' => [$this, 'check_permission'],
                'args' => [
                    'name' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_key',
                    ],
                    'label' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'class' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_html_class',
                    ],
                    'description' => [
                        'required' => false,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_textarea_field',
                    ],
                    'category' => [
                        'required' => false,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_key',
                    ],
                    'blocks' => [
                        'required' => true,
                        'type' => 'array',
                        'items' => [
                            'type' => 'string',
                        ],
                    ],
                    'inline_style' => [
                        'required' => false,
                        'type' => 'string',
                        'sanitize_callback' => [$this, 'sanitize_css'],
                    ],
                ],
            ],
        ]);
    }

    /**
     * Check permission for REST API requests
     *
     * @return bool
     * @since 1.0.8
     */
    public function check_permission()
    {
        return current_user_can('manage_options');
    }

    /**
     * Validate slug format
     *
     * @param string $value
     * @return bool
     * @since 1.0.8
     */
    public function validate_slug($value)
    {
        if (empty($value)) {
            return false;
        }

        // Slug should not contain spaces
        if (preg_match('/\s/', $value)) {
            return false;
        }

        return true;
    }

    /**
     * Validate modifier name format
     *
     * @param string $value
     * @return bool
     * @since 1.0.8
     */
    public function validate_modifier_name($value)
    {
        if (empty($value)) {
            return false;
        }

        // Name should not contain spaces
        if (preg_match('/\s/', $value)) {
            return false;
        }

        return true;
    }

    /**
     * Sanitize CSS content
     *
     * @param string $css
     * @return string
     * @since 1.0.8
     */
    public function sanitize_css($css)
    {
        // Basic CSS sanitization - strip tags and normalize whitespace
        $css = wp_strip_all_tags($css);
        return trim($css);
    }

    /**
     * Get plugin settings
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     * @since 1.0.8
     */
    public function get_settings($request)
    {
        // Get the raw option value, defaulting to '1' if not set
        $enable_default_modifiers = get_option('bsm_enable_default_modifiers', '1');

        // Convert to boolean
        $enable_default_modifiers = ($enable_default_modifiers === '1' || $enable_default_modifiers === 1 || $enable_default_modifiers === true);

        $settings = [
            'enable_default_modifiers' => $enable_default_modifiers,
        ];

        return rest_ensure_response($settings);
    }

    /**
     * Update plugin settings
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     * @since 1.0.8
     */
    public function update_settings($request)
    {
        $enable_default = $request->get_param('enable_default_modifiers');

        // Convert boolean to string for reliable storage
        // WordPress options work better with '1' and '0' than true/false
        $value_to_save = $enable_default ? '1' : '0';

        update_option('bsm_enable_default_modifiers', $value_to_save);

        return rest_ensure_response([
            'success' => true,
            'message' => __('Settings saved successfully.', 'block-style-modifiers'),
            'data' => [
                'enable_default_modifiers' => $enable_default,
            ],
        ]);
    }

    /**
     * Get custom categories
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     * @since 1.0.8
     */
    public function get_categories($request)
    {
        $categories = get_option('bsm_custom_categories', []);

        return rest_ensure_response($categories);
    }

    /**
     * Create a new category
     *
     * @param WP_REST_Request $request
     *
     * @return WP_Error | WP_REST_Response
     * @since 1.0.8
     */
    public function create_category( WP_REST_Request $request)
    {
        $categories = get_option('bsm_custom_categories', []);

        $new_category = [
            'slug' => $request->get_param('slug'),
            'label' => $request->get_param('label'),
            'description' => $request->get_param('description') ?? '',
            'exclusive' => $request->get_param('exclusive') ?? false,
        ];

        // Check if category already exists
        foreach ($categories as $category) {
            if ($category['slug'] === $new_category['slug']) {
                return new WP_Error(
                    'category_exists',
                    __('A category with this slug already exists.', 'block-style-modifiers'),
                    ['status' => 400]
                );
            }
        }

        $categories[] = $new_category;
        update_option('bsm_custom_categories', $categories);

        return rest_ensure_response([
            'success' => true,
            'message' => __('Category created successfully.', 'block-style-modifiers'),
            'data' => $new_category,
        ]);
    }

    /**
     * Update a category
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     * @since 1.0.8
     */
    public function update_category($request)
    {
        $categories = get_option('bsm_custom_categories', []);
        $slug = $request->get_param('slug');
        $found = false;

        foreach ($categories as $index => $category) {
            if ($category['slug'] === $slug) {
                $categories[$index] = [
                    'slug' => $slug,
                    'label' => $request->get_param('label'),
                    'description' => $request->get_param('description') ?? '',
                    'exclusive' => $request->get_param('exclusive') ?? false,
                ];
                $found = true;
                break;
            }
        }

        if (!$found) {
            return new WP_Error(
                'category_not_found',
                __('Category not found.', 'block-style-modifiers'),
                ['status' => 404]
            );
        }

        update_option('bsm_custom_categories', $categories);

        return rest_ensure_response([
            'success' => true,
            'message' => __('Category updated successfully.', 'block-style-modifiers'),
            'data' => $categories[$index],
        ]);
    }

    /**
     * Delete a category
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     * @since 1.0.8
     */
    public function delete_category($request)
    {
        $categories = get_option('bsm_custom_categories', []);
        $slug = $request->get_param('slug');
        $found = false;

        foreach ($categories as $index => $category) {
            if ($category['slug'] === $slug) {
                unset($categories[$index]);
                $categories = array_values($categories); // Re-index array
                $found = true;
                break;
            }
        }

        if (!$found) {
            return new WP_Error(
                'category_not_found',
                __('Category not found.', 'block-style-modifiers'),
                ['status' => 404]
            );
        }

        update_option('bsm_custom_categories', $categories);

        return rest_ensure_response([
            'success' => true,
            'message' => __('Category deleted successfully.', 'block-style-modifiers'),
        ]);
    }

    /**
     * Get custom modifiers
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     * @since 1.0.8
     */
    public function get_modifiers($request)
    {
        $modifiers = get_option('bsm_custom_modifiers', []);

        return rest_ensure_response($modifiers);
    }

    /**
     * Create a new modifier
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     * @since 1.0.8
     */
    public function create_modifier($request)
    {
        $modifiers = get_option('bsm_custom_modifiers', []);

        $new_modifier = [
            'name' => $request->get_param('name'),
            'label' => $request->get_param('label'),
            'class' => $request->get_param('class'),
            'description' => $request->get_param('description') ?? '',
            'category' => $request->get_param('category') ?? '',
            'blocks' => $request->get_param('blocks'),
            'inline_style' => $request->get_param('inline_style') ?? '',
        ];

        // Check if modifier already exists
        foreach ($modifiers as $modifier) {
            if ($modifier['name'] === $new_modifier['name']) {
                return new WP_Error(
                    'modifier_exists',
                    __('A modifier with this name already exists.', 'block-style-modifiers'),
                    ['status' => 400]
                );
            }
        }

        $modifiers[] = $new_modifier;
        update_option('bsm_custom_modifiers', $modifiers);

        return rest_ensure_response([
            'success' => true,
            'message' => __('Modifier created successfully.', 'block-style-modifiers'),
            'data' => $new_modifier,
        ]);
    }

    /**
     * Update a modifier
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     * @since 1.0.8
     */
    public function update_modifier($request)
    {
        $modifiers = get_option('bsm_custom_modifiers', []);
        $name = $request->get_param('name');
        $found = false;

        foreach ($modifiers as $index => $modifier) {
            if ($modifier['name'] === $name) {
                $modifiers[$index] = [
                    'name' => $name,
                    'label' => $request->get_param('label'),
                    'class' => $request->get_param('class'),
                    'description' => $request->get_param('description') ?? '',
                    'category' => $request->get_param('category') ?? '',
                    'blocks' => $request->get_param('blocks'),
                    'inline_style' => $request->get_param('inline_style') ?? '',
                ];
                $found = true;
                break;
            }
        }

        if (!$found) {
            return new WP_Error(
                'modifier_not_found',
                __('Modifier not found.', 'block-style-modifiers'),
                ['status' => 404]
            );
        }

        update_option('bsm_custom_modifiers', $modifiers);

        return rest_ensure_response([
            'success' => true,
            'message' => __('Modifier updated successfully.', 'block-style-modifiers'),
            'data' => $modifiers[$index],
        ]);
    }

    /**
     * Delete a modifier
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     * @since 1.0.8
     */
    public function delete_modifier($request)
    {
        $modifiers = get_option('bsm_custom_modifiers', []);
        $name = $request->get_param('name');
        $found = false;

        foreach ($modifiers as $index => $modifier) {
            if ($modifier['name'] === $name) {
                unset($modifiers[$index]);
                $modifiers = array_values($modifiers); // Re-index array
                $found = true;
                break;
            }
        }

        if (!$found) {
            return new WP_Error(
                'modifier_not_found',
                __('Modifier not found.', 'block-style-modifiers'),
                ['status' => 404]
            );
        }

        update_option('bsm_custom_modifiers', $modifiers);

        return rest_ensure_response([
            'success' => true,
            'message' => __('Modifier deleted successfully.', 'block-style-modifiers'),
        ]);
    }
}

