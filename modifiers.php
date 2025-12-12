<?php


register_block_style_modifier( 'core/image', [
    'name'  => 'rounded-corners',
    'label' => 'Rounded corners',
    'class' => 'img-rounded',
    'inline_style' => '
        .wp-block-image.img-rounded img {
            border-radius: 16px;
        }
    ',
] );

register_block_style_modifier( 'core/image', [
    'name'  => 'image-shadow',
    'label' => 'Soft shadow',
    'class' => 'img-shadow',
    'inline_style' => '
        .wp-block-image.img-shadow img {
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
    ',
] );

register_block_style_modifier( 'core/paragraph', [
    'name'  => 'lead-text',
    'label' => 'Lead text',
    'class' => 'is-lead-text',
    'inline_style' => '
        .wp-block-paragraph.is-lead-text {
            font-size: 1.25em;
            line-height: 1.6;
        }
    ',
] );

register_block_style_modifier( 'core/paragraph', [
    'name'  => 'muted-text',
    'label' => 'Muted text',
    'class' => 'is-muted-text',
    'inline_style' => '
        .wp-block-paragraph.is-muted-text {
            color: #777;
        }
    ',
] );



register_block_style_modifier( '*', [
    'name'  => 'debug-outline',
    'label' => 'Debug outline',
    'class' => 'debug-outline',
    'inline_style' => '
        .debug-outline {
            outline: 2px dashed red;
            outline-offset: -2px;
        }
    ',
] );

register_block_style_modifier( 'core/group', [
    'name'  => 'large-margin',
    'label' => 'Large margin',
    'class' => 'has-large-margin',
    'inline_style' => '
        .wp-block-group.has-large-margin {
            margin: 4rem 0;
        }
    ',
] );

register_block_style_modifier( 'core/group', [
    'name'  => 'no-margin',
    'label' => 'No margin',
    'class' => 'has-no-margin',
    'inline_style' => '
        .wp-block-group.has-no-margin {
            margin: 0 !important;
        }
    ',
] );


// Text Modifiers
register_block_style_modifier( 'core/heading', [
    'name'         => 'gradient-text',
    'label'        => 'Gradient Text',
    'class'        => 'gradient-text',
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
register_block_style_modifier( 'core/heading', [
    'name'         => 'fade-in-text',
    'label'        => 'Fade In Text',
    'class'        => 'fade-in-text',
    'inline_style' => '
    .wp-block-heading {
        @keyframes fadeIn {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .fade-in-text {
                opacity: 0;
                animation: fadeIn 0.8s ease-in forwards;
        }
    }
    ',
] );

