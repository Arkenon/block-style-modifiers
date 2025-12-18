=== Block Style Modifiers ===
Contributors: arkenon
Tags: block styles, gutenberg, block editor, style variations, custom styles
Requires at least: 6.1
Tested up to: 6.9
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add multiple block styles to Gutenberg blocks with ease.

== Description ==

Block Style Modifiers is a simple WordPress plugin that allows you to add multiple block styles to Gutenberg blocks.

![Block Style Modifiers](https://kadimgultekin.com/wp-content/uploads/2025/12/block_style_modifiers_ss.jpg)

Style Modifiers are additive CSS classes that:

* Can be applied in addition to a Block Style
* Can be selected multiple at the same time
* Are predefined and documented by themes or plugins
* Preserve class order, allowing advanced CSS control

== Features ==
* Register multiple style modifiers for any block type
* Apply multiple style modifiers to a single block
* Global style modifiers that apply to all blocks
* Inline CSS support for easy styling of modifiers

== Usage ==
* Define your style modifiers using the `register_block_style_modifier` function via your theme's `functions.php` file or a custom plugin.
* Select style modifiers in the block editor sidebar under "Block Style Modifiers".
* Style modifiers will be applied as additional CSS classes to the block's wrapper element.
* It is possible that reordering of classes may affect CSS specificity and styling.

**Note:** There is available an experimental plugin includes blocks style modifiers:  [Block Style Modifier Pack](https://github.com/Arkenon/block-style-modifier-pack) plugin to function.

== Registering a Block Style Modifier ==

```php
// Example: Register a style modifier for multiple blocks
 block_style_modifiers_register_style( [ 'core/image', 'core/cover' ], [
    'name'        => 'zoom-on-hover',
    'label'       => __( 'Zoom on Hover', 'block-style-modifier-pack' ),
    'class'       => 'bsmp-zoom-on-hover',
    'description' => __( 'Zoom into image on hover', 'block-style-modifier-pack' ),
    'category'    => __( 'Hover Effects', 'block-style-modifier-pack' ),
 ] );

// Register a style modifier for a single block
block_style_modifiers_register_style( [ 'core/image', 'core/cover' ], [
    'name'        => 'hover-overlay-dark',
    'label'       => __( 'Dark Overlay on Hover', 'block-style-modifier-pack' ),
    'class'       => 'bsmp-hover-overlay-dark',
    'description' => __( 'Dark semi-transparent overlay appears on hover', 'block-style-modifier-pack' ),
    'category'    => __( 'Overlay Effects', 'block-style-modifier-pack' ),
] );

// Example: Global modifier for all blocks with inline style
block_style_modifiers_register_style( '*', [
    'name'         => 'hide-sm',
    'label'        => 'Hide on Small Screens',
    'class'        => 'bsmp-hide-sm',
    'description'  => __( 'Hide block on small (max-width: 600px) screens'),
    'category'     => __( 'Responsive'),
    'inline_style' => '
        @media (max-width: 600px) {
        .bsmp-hide-sm {
                display: none !important;
            }
        }
    ',
] );
```

Example result in markup:

```html
    <div class="wp-block-cover has-custom-content-position is-position-bottom-left bsmp-zoom-on-hover bsmp-hover-overlay-dark bsmp-hide-sm">
        ...
 ```

== Installation ==
1. You have a couple options:
	* Go to Plugins -> Add New and search for "Block Style Modifiers". Once found, click "Install".
	* Download the Block Style Modifiers from wordpress.org and make sure the folder us zipped. Then upload via Plugins -> Add New -> Upload.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Add your custom style modifiers using the `register_block_style_modifier` function in your theme's `functions.php` file or a custom plugin.

== Changelog ==

= 1.0.0 =
* Initial release of Block Style Modifiers.