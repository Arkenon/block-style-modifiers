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
    // Get the raw option value, defaulting to '1' if not set
    $enable_defaults = get_option('bsm_enable_default_modifiers', '1');

    // Convert to boolean for comparison
    $enable_defaults = ($enable_defaults === '1' || $enable_defaults === 1 || $enable_defaults === true);

    if (!$enable_defaults) {
        return;
    }

    /* ========================================
       REGISTER CATEGORIES FIRST
       ======================================== */

    // Animations Category
    block_style_modifiers_register_category('bsm-animations', [
        'label' => __('Animations', 'block-style-modifiers'),
        'description' => __('Entrance animations for blocks', 'block-style-modifiers'),
        'exclusive' => true,
    ]);

    // Animation Delay Category
    block_style_modifiers_register_category('bsm-animation-delay', [
        'label' => __('Animation Delay', 'block-style-modifiers'),
        'description' => __('Control animation timing (works with Animations)', 'block-style-modifiers'),
        'exclusive' => true,
    ]);

    // Hover Effects Category (transform-based, works on all blocks)
    block_style_modifiers_register_category('bsm-hover-effects', [
        'label' => __('Hover Effects', 'block-style-modifiers'),
        'description' => __('Transform-based hover interactions', 'block-style-modifiers'),
        'exclusive' => true,
    ]);

    // Image Hover Effects Category (filter-based, image/cover blocks only)
    block_style_modifiers_register_category('bsm-image-hover-effects', [
        'label' => __('Image Hover Effects', 'block-style-modifiers'),
        'description' => __('Filter-based hover effects for image and cover blocks', 'block-style-modifiers'),
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
        'core/columns',
        'core/cover'
    ];

    // Hover effect blocks
    $hover_blocks = [
        'core/image',
        'core/cover',
        'core/media-text',
        'core/group',
        'core/column',
        'core/columns',
        'core/section',
        'core/row'
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
        'category' => 'bsm-animations',
    ]);

    // Slide Up
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'slide-up',
        'label' => __('Slide Up', 'block-style-modifiers'),
        'class' => 'bsm-slide-up',
        'description' => __('Slide from bottom with fade effect', 'block-style-modifiers'),
        'category' => 'bsm-animations',
    ]);

    // Scale In
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'scale-in',
        'label' => __('Scale In', 'block-style-modifiers'),
        'class' => 'bsm-scale-in',
        'description' => __('Scale up animation with fade effect', 'block-style-modifiers'),
        'category' => 'bsm-animations',
    ]);

    // Slide Down
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'slide-down',
        'label' => __('Slide Down', 'block-style-modifiers'),
        'class' => 'bsm-slide-down',
        'description' => __('Slide from top with fade effect', 'block-style-modifiers'),
        'category' => 'bsm-animations',
    ]);

    // Slide Left
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'slide-left',
        'label' => __('Slide Left', 'block-style-modifiers'),
        'class' => 'bsm-slide-left',
        'description' => __('Slide from right with fade effect', 'block-style-modifiers'),
        'category' => 'bsm-animations',
    ]);

    // Slide Right
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'slide-right',
        'label' => __('Slide Right', 'block-style-modifiers'),
        'class' => 'bsm-slide-right',
        'description' => __('Slide from left with fade effect', 'block-style-modifiers'),
        'category' => 'bsm-animations',
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
        'category' => 'bsm-animation-delay',
    ]);

    // Normal Delay
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'delay-normal',
        'label' => __('Normal (0.4s)', 'block-style-modifiers'),
        'class' => 'bsm-delay-normal',
        'description' => __('Normal animation delay (0.4 seconds)', 'block-style-modifiers'),
        'category' => 'bsm-animation-delay',
    ]);

    // Slow Delay
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'delay-slow',
        'label' => __('Slow (0.8s)', 'block-style-modifiers'),
        'class' => 'bsm-delay-slow',
        'description' => __('Slow animation delay (0.8 seconds)', 'block-style-modifiers'),
        'category' => 'bsm-animation-delay',
    ]);

    // Very Slow Delay
    block_style_modifiers_register_style($animation_blocks, [
        'name' => 'delay-very-slow',
        'label' => __('Very Slow (1.2s)', 'block-style-modifiers'),
        'class' => 'bsm-delay-very-slow',
        'description' => __('Very Slow animation delay (1.2 seconds)', 'block-style-modifiers'),
        'category' => 'bsm-animation-delay',
    ]);

    /* ========================================
       3️⃣ HOVER EFFECTS (Transform-based)
       Category: Exclusive (radio behavior)
       Works on all hover blocks
       ======================================== */

    // Zoom In on Hover
    block_style_modifiers_register_style(array_merge($hover_blocks, $image_blocks), [
        'name' => 'zoom-hover',
        'label' => __('Zoom In on Hover', 'block-style-modifiers'),
        'class' => 'bsm-zoom-hover',
        'description' => __('Zoom into block on hover', 'block-style-modifiers'),
        'category' => 'bsm-hover-effects',
    ]);

    // Subtle Rotate on Hover
    block_style_modifiers_register_style(array_merge($hover_blocks, $image_blocks), [
        'name' => 'rotate-hover',
        'label' => __('Subtle Rotate on Hover', 'block-style-modifiers'),
        'class' => 'bsm-rotate-hover',
        'description' => __('Subtle rotation effect on hover', 'block-style-modifiers'),
        'category' => 'bsm-hover-effects',
    ]);

    // Bounce on Hover
    block_style_modifiers_register_style(array_merge($hover_blocks, $image_blocks), [
        'name' => 'bounce-hover',
        'label' => __('Bounce on Hover', 'block-style-modifiers'),
        'class' => 'bsm-bounce-hover',
        'description' => __('Subtle lift effect on hover', 'block-style-modifiers'),
        'category' => 'bsm-hover-effects',
    ]);

    // Shake on Hover
    block_style_modifiers_register_style(array_merge($hover_blocks, $image_blocks), [
        'name' => 'shake-hover',
        'label' => __('Shake on Hover', 'block-style-modifiers'),
        'class' => 'bsm-shake-hover',
        'description' => __('Subtle shake/vibrate effect on hover', 'block-style-modifiers'),
        'category' => 'bsm-hover-effects',
    ]);


    /* ========================================
       3b️⃣ IMAGE HOVER EFFECTS (Filter-based)
       Category: Exclusive (radio behavior)
       Works on Image and Cover blocks only
       ======================================== */

    // Brightness on Hover
    block_style_modifiers_register_style($image_blocks, [
        'name' => 'brightness-hover',
        'label' => __('Brighten on Hover', 'block-style-modifiers'),
        'class' => 'bsm-brightness-hover',
        'description' => __('Increase brightness on hover', 'block-style-modifiers'),
        'category' => 'bsm-image-hover-effects',
    ]);

    // Blur to Focus on Hover
    block_style_modifiers_register_style($image_blocks, [
        'name' => 'blur-to-focus-hover',
        'label' => __('Blur to Focus on Hover', 'block-style-modifiers'),
        'class' => 'bsm-blur-to-focus-hover',
        'description' => __('Image starts blurred and becomes sharp on hover', 'block-style-modifiers'),
        'category' => 'bsm-image-hover-effects',
    ]);

    // Darken on Hover
    block_style_modifiers_register_style($image_blocks, [
        'name' => 'darken-hover',
        'label' => __('Darken on Hover', 'block-style-modifiers'),
        'class' => 'bsm-darken-hover',
        'description' => __('Decrease brightness on hover', 'block-style-modifiers'),
        'category' => 'bsm-image-hover-effects',
    ]);

    // Grayscale to Color on Hover
    block_style_modifiers_register_style($image_blocks, [
        'name' => 'grayscale-to-color-hover',
        'label' => __('Grayscale to Color on Hover', 'block-style-modifiers'),
        'class' => 'bsm-grayscale-to-color-hover',
        'description' => __('Image starts grayscale and reveals color on hover', 'block-style-modifiers'),
        'category' => 'bsm-image-hover-effects',
    ]);
}
