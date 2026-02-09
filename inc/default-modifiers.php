<?php
/**
 * Default Block Style Modifiers
 * Theme-independent, universal style modifiers that work with any WordPress theme
 *
 * Philosophy:
 * - Enhance behavior, not visual design
 * - No borders, shadows, spacing, or color palettes
 * - Work with any theme without conflicts
 * - Atomic and performant
 *
 * @package BlockStyleModifiers
 * @since 1.0.6
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register default block style modifiers
 * Called on plugins_loaded hook
 *
 * @since 1.0.6
 */
function block_style_modifiers_register_defaults()
{
    // Check if default modifiers are enabled (default: true)
    $enable_defaults = get_option('bsm_enable_default_modifiers', true);
    if (!$enable_defaults) {
        return;
    }

    /* ========================================
       REGISTER CATEGORIES FIRST
       ======================================== */

    // Animations Category
    block_style_modifiers_register_category('animations', [
        'label' => __('Animations', 'block-style-modifiers'),
        'description' => __('Entrance animations for blocks', 'block-style-modifiers'),
        'exclusive' => true,
    ]);

    // Animation Delay Category
    block_style_modifiers_register_category('animation-delay', [
        'label' => __('Animation Delay', 'block-style-modifiers'),
        'description' => __('Control animation timing (works with Animations)', 'block-style-modifiers'),
        'exclusive' => true,
    ]);

    // Hover Effects Category
    block_style_modifiers_register_category('hover-effects', [
        'label' => __('Hover Effects', 'block-style-modifiers'),
        'description' => __('Transform-based hover interactions', 'block-style-modifiers'),
        'exclusive' => true,
    ]);

    // Text Effects Category
    block_style_modifiers_register_category('text-effects', [
        'label' => __('Text Effects', 'block-style-modifiers'),
        'description' => __('Micro-interactions for text blocks', 'block-style-modifiers'),
        'exclusive' => true,
    ]);

    /* ========================================
       DEFINE BLOCK GROUPS
       ======================================== */

    // Common animation blocks
    $animation_blocks = [
        'core/group',
        'core/row',
        'core/stack',
        'core/grid',
        'core/column',
        'core/columns'
    ];

    // Hover effect blocks
    $hover_blocks = [
        'core/image',
        'core/cover',
        'core/media-text',
    ];

    // Text effect blocks
    $text_blocks = [
        'core/paragraph',
        'core/heading',
    ];

    // Image-specific blocks for grayscale
    $image_blocks = [
        'core/image',
        'core/cover',
    ];

    /* ========================================
       1️⃣ ANIMATIONS (Entrance)
       Category: Exclusive (radio behavior)
       ======================================== */

    // Fade In
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'fade-in',
        'label' => __('Fade In', 'block-style-modifiers'),
        'class' => 'bsm-fade-in',
        'description' => __('Smooth entrance animation with fade effect', 'block-style-modifiers'),
        'category' => 'animations',
    ]);

    // Slide Up
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'slide-up',
        'label' => __('Slide Up', 'block-style-modifiers'),
        'class' => 'bsm-slide-up',
        'description' => __('Slide from bottom with fade effect', 'block-style-modifiers'),
        'category' => 'animations',
    ]);

    // Scale In
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'scale-in',
        'label' => __('Scale In', 'block-style-modifiers'),
        'class' => 'bsm-scale-in',
        'description' => __('Scale up animation with fade effect', 'block-style-modifiers'),
        'category' => 'animations',
    ]);

    // Slide Down
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'slide-down',
        'label' => __('Slide Down', 'block-style-modifiers'),
        'class' => 'bsm-slide-down',
        'description' => __('Slide from top with fade effect', 'block-style-modifiers'),
        'category' => 'animations',
    ]);

    // Slide Left
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'slide-left',
        'label' => __('Slide Left', 'block-style-modifiers'),
        'class' => 'bsm-slide-left',
        'description' => __('Slide from right with fade effect', 'block-style-modifiers'),
        'category' => 'animations',
    ]);

    // Slide Right
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'slide-right',
        'label' => __('Slide Right', 'block-style-modifiers'),
        'class' => 'bsm-slide-right',
        'description' => __('Slide from left with fade effect', 'block-style-modifiers'),
        'category' => 'animations',
    ]);

    // Rotate In
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'rotate-in',
        'label' => __('Rotate In', 'block-style-modifiers'),
        'class' => 'bsm-rotate-in',
        'description' => __('Rotate animation with fade effect', 'block-style-modifiers'),
        'category' => 'animations',
    ]);

    // Flip In X
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'flip-in-x',
        'label' => __('Flip In X', 'block-style-modifiers'),
        'class' => 'bsm-flip-in-x',
        'description' => __('Flip animation along X-axis with fade effect', 'block-style-modifiers'),
        'category' => 'animations',
    ]);

    /* ========================================
       2️⃣ ANIMATION DELAY
       Category: Exclusive (radio behavior)
       Note: Only works with Animation category
       ======================================== */

    // Fast Delay
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'delay-fast',
        'label' => __('Fast (0.2s)', 'block-style-modifiers'),
        'class' => 'bsm-delay-fast',
        'description' => __('Fast animation delay (0.2 seconds)', 'block-style-modifiers'),
        'category' => 'animation-delay',
    ]);

    // Normal Delay
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'delay-normal',
        'label' => __('Normal (0.4s)', 'block-style-modifiers'),
        'class' => 'bsm-delay-normal',
        'description' => __('Normal animation delay (0.4 seconds)', 'block-style-modifiers'),
        'category' => 'animation-delay',
    ]);

    // Slow Delay
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'delay-slow',
        'label' => __('Slow (0.8s)', 'block-style-modifiers'),
        'class' => 'bsm-delay-slow',
        'description' => __('Slow animation delay (0.8 seconds)', 'block-style-modifiers'),
        'category' => 'animation-delay',
    ]);

    /* ========================================
       3️⃣ HOVER EFFECTS (Transform-based)
       Category: Exclusive (radio behavior)
       ======================================== */

    // Zoom In on Hover
    block_style_modifiers_register_style($hover_blocks, [
        'name' => 'zoom-hover',
        'label' => __('Zoom In on Hover', 'block-style-modifiers'),
        'class' => 'bsm-zoom-hover',
        'description' => __('Zoom into block on hover', 'block-style-modifiers'),
        'category' => 'hover-effects',
    ]);

    // Subtle Rotate on Hover
    block_style_modifiers_register_style($hover_blocks, [
        'name' => 'rotate-hover',
        'label' => __('Subtle Rotate on Hover', 'block-style-modifiers'),
        'class' => 'bsm-rotate-hover',
        'description' => __('Subtle rotation effect on hover', 'block-style-modifiers'),
        'category' => 'hover-effects',
    ]);

    // Bounce on Hover
    block_style_modifiers_register_style($hover_blocks, [
        'name' => 'bounce-hover',
        'label' => __('Bounce on Hover', 'block-style-modifiers'),
        'class' => 'bsm-bounce-hover',
        'description' => __('Very subtle bounce effect on hover', 'block-style-modifiers'),
        'category' => 'hover-effects',
    ]);

    // Grayscale to Color on Hover (Image/Cover only)
    block_style_modifiers_register_style($image_blocks, [
        'name' => 'grayscale-to-color-hover',
        'label' => __('Grayscale to Color on Hover', 'block-style-modifiers'),
        'class' => 'bsm-grayscale-to-color-hover',
        'description' => __('Image starts grayscale and reveals color on hover', 'block-style-modifiers'),
        'category' => 'hover-effects',
    ]);

    // Shake on Hover
    block_style_modifiers_register_style($hover_blocks, [
        'name' => 'shake-hover',
        'label' => __('Shake on Hover', 'block-style-modifiers'),
        'class' => 'bsm-shake-hover',
        'description' => __('Subtle shake/vibrate effect on hover', 'block-style-modifiers'),
        'category' => 'hover-effects',
    ]);

    // Brightness on Hover
    block_style_modifiers_register_style($hover_blocks, [
        'name' => 'brightness-hover',
        'label' => __('Brighten on Hover', 'block-style-modifiers'),
        'class' => 'bsm-brightness-hover',
        'description' => __('Increase brightness on hover', 'block-style-modifiers'),
        'category' => 'hover-effects',
    ]);

    // Darken on Hover
    block_style_modifiers_register_style($hover_blocks, [
        'name' => 'darken-hover',
        'label' => __('Darken on Hover', 'block-style-modifiers'),
        'class' => 'bsm-darken-hover',
        'description' => __('Decrease brightness on hover', 'block-style-modifiers'),
        'category' => 'hover-effects',
    ]);

    // Blur to Focus on Hover (Image/Cover only)
    block_style_modifiers_register_style($image_blocks, [
        'name' => 'blur-to-focus-hover',
        'label' => __('Blur to Focus on Hover', 'block-style-modifiers'),
        'class' => 'bsm-blur-to-focus-hover',
        'description' => __('Image starts blurred and becomes sharp on hover', 'block-style-modifiers'),
        'category' => 'hover-effects',
    ]);


    /* ========================================
       4️⃣ TEXT EFFECTS (Micro-interactions)
       Category: Exclusive (radio behavior)
       ======================================== */

    // Underline Reveal on Hover
    block_style_modifiers_register_style($text_blocks, [
        'name' => 'underline-reveal',
        'label' => __('Underline Reveal on Hover', 'block-style-modifiers'),
        'class' => 'bsm-underline-reveal',
        'description' => __('Animated underline appears on hover', 'block-style-modifiers'),
        'category' => 'text-effects',
    ]);

    // Soft Text Fade on Hover
    block_style_modifiers_register_style($text_blocks, [
        'name' => 'text-fade-hover',
        'label' => __('Soft Text Fade on Hover', 'block-style-modifiers'),
        'class' => 'bsm-text-fade-hover',
        'description' => __('Text softly fades on hover', 'block-style-modifiers'),
        'category' => 'text-effects',
    ]);
}

/**
 * Load custom categories from database
 *
 * @since 1.0.8
 */
function block_style_modifiers_load_custom_categories()
{
    $custom_categories = get_option('bsm_custom_categories', []);

    if (!is_array($custom_categories)) {
        return;
    }

    foreach ($custom_categories as $category) {
        if (!isset($category['slug'])) {
            continue;
        }

        block_style_modifiers_register_category(
            $category['slug'],
            [
                'label' => $category['label'] ?? $category['slug'],
                'description' => $category['description'] ?? '',
                'exclusive' => $category['exclusive'] ?? false,
            ]
        );
    }
}

/**
 * Load custom modifiers from database
 *
 * @since 1.0.8
 */
function block_style_modifiers_load_custom_modifiers()
{
    $custom_modifiers = get_option('bsm_custom_modifiers', []);

    if (!is_array($custom_modifiers)) {
        return;
    }

    foreach ($custom_modifiers as $modifier) {
        if (!isset($modifier['name']) || !isset($modifier['blocks'])) {
            continue;
        }

        $blocks = $modifier['blocks'];

        // If blocks is '*', register for all blocks
        if ($blocks === '*' || (is_array($blocks) && in_array('*', $blocks))) {
            $blocks = '*';
        }

        block_style_modifiers_register_style(
            $blocks,
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

