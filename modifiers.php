<?php

// Text Modifiers
register_block_style_modifier( 'core/heading', [
    'name'         => 'gradient-text',
    'label'        => 'Gradient Text',
    'class'        => 'gradient-text',
    'description'  => 'Apply gradient color to text',
    'category'     => 'Text Effects',
    'inline_style' => '
        .wp-block-heading.gradient-text {
            background: linear-gradient(90deg, #ff7e5f, #feb47b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color: transparent;
        }
    ',
] );
register_block_style_modifier( 'core/heading', [
    'name'         => 'neon-glow',
    'label'        => 'Neon Glow',
    'class'        => 'neon-glow-text',
    'description'  => 'Add neon glow effect to text',
    'category'     => 'Text Effects',
    'inline_style' => '
        .wp-block-heading.neon-glow-text {
            color: #0c0c0c;
            text-shadow:
                0 0 5px #0ff,
                0 0 10px #0ff,
                0 0 20px #0ff,
                0 0 30px #09f,
                0 0 40px #09f,
                0 0 50px #09f;
        }
    ',
] );
register_block_style_modifier( 'core/paragraph', [
    'name'         => 'skewed-text',
    'label'        => 'Skewed Text',
    'class'        => 'skewed-text',
    'description'  => 'Apply skew transformation to text',
    'category'     => 'Text Effects',
    'inline_style' => '
        .wp-block-paragraph.skewed-text {
            display: inline-block;
            transform: skewX(-12deg);
            font-weight: bold;
        }
    ',
] );
register_block_style_modifier( 'core/paragraph', [
    'name'         => 'shadow-3d',
    'label'        => '3D Text Shadow',
    'class'        => 'text-shadow-3d',
    'description'  => 'Add 3D shadow effect to text',
    'category'     => 'Text Effects',
    'inline_style' => '
        .wp-block-paragraph.text-shadow-3d {
            text-shadow:
                1px 1px 0 #aaa,
                2px 2px 0 #999,
                3px 3px 0 #888,
                4px 4px 0 #777;
        }
    ',
] );


register_block_style_modifier( '*', [
    'name'         => 'hide-sm',
    'label'        => 'Hide on Small Screens',
    'class'        => 'hide-sm',
    'description'  => 'Hide block on small (max-width: 576px) screens',
    'category'     => 'Responsive',
    'inline_style' => '
        @media (max-width: 576px) {
            .hide-sm {
                display: none !important;
            }
        }
    ',
] );

register_block_style_modifier( '*', [
    'name'         => 'hide-md',
    'label'        => 'Hide on Medium Screens',
    'class'        => 'hide-md',
    'description'  => 'Hide block on medium (max-width: 768px) screens',
    'category'     => 'Responsive',
    'inline_style' => '
        @media (max-width: 768px) {
            .hide-md {
                display: none !important;
            }
        }
    ',
] );

register_block_style_modifier( '*', [
    'name'         => 'center-md',
    'label'        => 'Center on Medium Screens',
    'class'        => 'center-md',
    'description'  => 'Align content center on medium screens',
    'category'     => 'Responsive',
    'inline_style' => '
        @media (max-width: 768px) {
            .center-md {
                text-align: center !important;
                margin-left: auto !important;
                margin-right: auto !important;
            }
        }
    ',
] );

register_block_style_modifier( '*', [
    'name'         => 'stack-lg',
    'label'        => 'Stack on Large Screens',
    'class'        => 'stack-lg',
    'description'  => 'Force vertical stack layout on large screens',
    'category'     => 'Responsive',
    'inline_style' => '
        @media (min-width: 1024px) {
            .stack-lg {
                display: block !important;
            }
        }
    ',
] );

register_block_style_modifier( '*', [
    'name'         => 'fade-in',
    'label'        => 'Fade In',
    'class'        => 'fade-in',
    'description'  => 'Fade in animation on load',
    'category'     => 'Animations',
    'inline_style' => '
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .fade-in {
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
        }
    ',
] );

register_block_style_modifier( '*', [
    'name'         => 'bounce',
    'label'        => 'Bounce In',
    'class'        => 'bounce',
    'description'  => 'Bounce effect on load',
    'category'     => 'Animations',
    'inline_style' => '
        @keyframes bounceIn {
            0% { transform: scale(0.9); opacity: 0; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); }
        }
        .bounce {
            animation: bounceIn 0.8s ease forwards;
        }
    ',
] );

register_block_style_modifier( '*', [
    'name'         => 'delay-2s',
    'label'        => 'Delay 2 Seconds',
    'class'        => 'delay-2s',
    'description'  => 'Add 2-second delay to animation',
    'category'     => 'Animations',
    'inline_style' => '
        .delay-2s {
            animation-delay: 2s !important;
        }
    ',
] );

register_block_style_modifier( '*', [
    'name'         => 'slide-up',
    'label'        => 'Slide Up',
    'class'        => 'slide-up',
    'description'  => 'Slide in from bottom',
    'category'     => 'Animations',
    'inline_style' => '
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .slide-up {
            animation: slideUp 0.6s ease-out forwards;
        }
    ',
] );

register_block_style_modifier( '*', [
    'name'         => 'delay-1s',
    'label'        => 'Delay 1 Second',
    'class'        => 'delay-1s',
    'description'  => 'Add 1-second delay to animation',
    'category'     => 'Animations',
    'inline_style' => '
        .delay-1s {
            animation-delay: 1s !important;
        }
    ',
] );

