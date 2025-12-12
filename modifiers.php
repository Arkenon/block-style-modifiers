<?php


register_block_style_modifier( 'core/image', [
    'name'  => 'rounded-image',
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

register_block_style_modifier( 'core/columns', [
    'name'  => 'tight-gap',
    'label' => 'Tight gap',
    'class' => 'has-tight-gap',
    'inline_style' => '
        .wp-block-columns.has-tight-gap {
            gap: 0.75rem;
        }
    ',
] );

register_block_style_modifier( 'core/columns', [
    'name'  => 'no-bottom-margin',
    'label' => 'No bottom margin',
    'class' => 'no-margin-bottom',
    'inline_style' => '
        .wp-block-columns.no-margin-bottom {
            margin-bottom: 0 !important;
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

