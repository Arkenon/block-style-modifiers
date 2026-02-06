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

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Register default block style modifiers
 * Called on plugins_loaded hook
 *
 * @since 1.0.6
 */
function block_style_modifiers_register_defaults() {

    // Common animation blocks
    $animation_blocks = [
        'core/group',
        'core/row',
        'core/stack',
        'core/grid',
        'core/column',
        'core/columns',
        'core/heading',
        'core/paragraph',
        'core/image',
        'core/cover',
    ];

    // Hover effect blocks
    $hover_blocks = [
        'core/group',
        'core/column',
        'core/columns',
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
    block_style_modifiers_register_style( $animation_blocks, [
        'name'        => 'fade-in',
        'label'       => __( 'Fade In', 'block-style-modifiers' ),
        'class'       => 'bsm-fade-in',
        'description' => __( 'Smooth entrance animation with fade effect', 'block-style-modifiers' ),
        'category'    => [
            'slug'        => 'animations',
            'label'       => __( 'Animations', 'block-style-modifiers' ),
            'description' => __( 'Entrance animations for blocks', 'block-style-modifiers' ),
            'exclusive'   => true,
        ],
    ] );

    // Slide Up
    block_style_modifiers_register_style( $animation_blocks, [
        'name'        => 'slide-up',
        'label'       => __( 'Slide Up', 'block-style-modifiers' ),
        'class'       => 'bsm-slide-up',
        'description' => __( 'Slide from bottom with fade effect', 'block-style-modifiers' ),
        'category'    => [
            'slug'        => 'animations',
            'label'       => __( 'Animations', 'block-style-modifiers' ),
            'description' => __( 'Entrance animations for blocks', 'block-style-modifiers' ),
            'exclusive'   => true,
        ],
    ] );

    // Scale In
    block_style_modifiers_register_style( $animation_blocks, [
        'name'        => 'scale-in',
        'label'       => __( 'Scale In', 'block-style-modifiers' ),
        'class'       => 'bsm-scale-in',
        'description' => __( 'Scale up animation with fade effect', 'block-style-modifiers' ),
        'category'    => [
            'slug'        => 'animations',
            'label'       => __( 'Animations', 'block-style-modifiers' ),
            'description' => __( 'Entrance animations for blocks', 'block-style-modifiers' ),
            'exclusive'   => true,
        ],
    ] );

    /* ========================================
       2️⃣ ANIMATION DELAY
       Category: Exclusive (radio behavior)
       Note: Only works with Animation category
       ======================================== */

    // Fast Delay
    block_style_modifiers_register_style( $animation_blocks, [
        'name'        => 'delay-fast',
        'label'       => __( 'Fast (0.2s)', 'block-style-modifiers' ),
        'class'       => 'bsm-delay-fast',
        'description' => __( 'Fast animation delay (0.2 seconds)', 'block-style-modifiers' ),
        'category'    => [
            'slug'        => 'animation-delay',
            'label'       => __( 'Animation Delay', 'block-style-modifiers' ),
            'description' => __( 'Control animation timing (works with Animations)', 'block-style-modifiers' ),
            'exclusive'   => true,
        ],
    ] );

    // Normal Delay
    block_style_modifiers_register_style( $animation_blocks, [
        'name'        => 'delay-normal',
        'label'       => __( 'Normal (0.4s)', 'block-style-modifiers' ),
        'class'       => 'bsm-delay-normal',
        'description' => __( 'Normal animation delay (0.4 seconds)', 'block-style-modifiers' ),
        'category'    => [
            'slug'        => 'animation-delay',
            'label'       => __( 'Animation Delay', 'block-style-modifiers' ),
            'description' => __( 'Control animation timing (works with Animations)', 'block-style-modifiers' ),
            'exclusive'   => true,
        ],
    ] );

    // Slow Delay
    block_style_modifiers_register_style( $animation_blocks, [
        'name'        => 'delay-slow',
        'label'       => __( 'Slow (0.8s)', 'block-style-modifiers' ),
        'class'       => 'bsm-delay-slow',
        'description' => __( 'Slow animation delay (0.8 seconds)', 'block-style-modifiers' ),
        'category'    => [
            'slug'        => 'animation-delay',
            'label'       => __( 'Animation Delay', 'block-style-modifiers' ),
            'description' => __( 'Control animation timing (works with Animations)', 'block-style-modifiers' ),
            'exclusive'   => true,
        ],
    ] );

    /* ========================================
       3️⃣ HOVER EFFECTS (Transform-based)
       Category: Exclusive (radio behavior)
       ======================================== */

    // Zoom In on Hover
    block_style_modifiers_register_style( $hover_blocks, [
        'name'        => 'zoom-hover',
        'label'       => __( 'Zoom In on Hover', 'block-style-modifiers' ),
        'class'       => 'bsm-zoom-hover',
        'description' => __( 'Zoom into block on hover', 'block-style-modifiers' ),
        'category'    => [
            'slug'        => 'hover-effects',
            'label'       => __( 'Hover Effects', 'block-style-modifiers' ),
            'description' => __( 'Transform-based hover interactions', 'block-style-modifiers' ),
            'exclusive'   => true,
        ],
    ] );

    // Subtle Rotate on Hover
    block_style_modifiers_register_style( $hover_blocks, [
        'name'        => 'rotate-hover',
        'label'       => __( 'Subtle Rotate on Hover', 'block-style-modifiers' ),
        'class'       => 'bsm-rotate-hover',
        'description' => __( 'Subtle rotation effect on hover', 'block-style-modifiers' ),
        'category'    => [
            'slug'        => 'hover-effects',
            'label'       => __( 'Hover Effects', 'block-style-modifiers' ),
            'description' => __( 'Transform-based hover interactions', 'block-style-modifiers' ),
            'exclusive'   => true,
        ],
    ] );

    // Bounce on Hover
    block_style_modifiers_register_style( $hover_blocks, [
        'name'        => 'bounce-hover',
        'label'       => __( 'Bounce on Hover', 'block-style-modifiers' ),
        'class'       => 'bsm-bounce-hover',
        'description' => __( 'Very subtle bounce effect on hover', 'block-style-modifiers' ),
        'category'    => [
            'slug'        => 'hover-effects',
            'label'       => __( 'Hover Effects', 'block-style-modifiers' ),
            'description' => __( 'Transform-based hover interactions', 'block-style-modifiers' ),
            'exclusive'   => true,
        ],
    ] );

    // Grayscale on Hover (Image/Cover only)
    block_style_modifiers_register_style( $image_blocks, [
        'name'        => 'grayscale-hover',
        'label'       => __( 'Grayscale on Hover', 'block-style-modifiers' ),
        'class'       => 'bsm-grayscale-hover',
        'description' => __( 'Image appears grayscale and reveals color on hover', 'block-style-modifiers' ),
        'category'    => [
            'slug'        => 'hover-effects',
            'label'       => __( 'Hover Effects', 'block-style-modifiers' ),
            'description' => __( 'Transform-based hover interactions', 'block-style-modifiers' ),
            'exclusive'   => true,
        ],
    ] );

    /* ========================================
       4️⃣ TEXT EFFECTS (Micro-interactions)
       Category: Exclusive (radio behavior)
       ======================================== */

    // Underline Reveal on Hover
    block_style_modifiers_register_style( $text_blocks, [
        'name'        => 'underline-reveal',
        'label'       => __( 'Underline Reveal on Hover', 'block-style-modifiers' ),
        'class'       => 'bsm-underline-reveal',
        'description' => __( 'Animated underline appears on hover', 'block-style-modifiers' ),
        'category'    => [
            'slug'        => 'text-effects',
            'label'       => __( 'Text Effects', 'block-style-modifiers' ),
            'description' => __( 'Micro-interactions for text blocks', 'block-style-modifiers' ),
            'exclusive'   => true,
        ],
    ] );

    // Soft Text Fade on Hover
    block_style_modifiers_register_style( $text_blocks, [
        'name'        => 'text-fade-hover',
        'label'       => __( 'Soft Text Fade on Hover', 'block-style-modifiers' ),
        'class'       => 'bsm-text-fade-hover',
        'description' => __( 'Text softly fades on hover', 'block-style-modifiers' ),
        'category'    => [
            'slug'        => 'text-effects',
            'label'       => __( 'Text Effects', 'block-style-modifiers' ),
            'description' => __( 'Micro-interactions for text blocks', 'block-style-modifiers' ),
            'exclusive'   => true,
        ],
    ] );
}

// Register defaults on plugins_loaded with priority 10
add_action( 'plugins_loaded', 'block_style_modifiers_register_defaults', 10 );

