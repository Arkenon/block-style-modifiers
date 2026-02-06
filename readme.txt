=== Block Style Modifiers ===
Contributors: arkenon
Tags: block styles, gutenberg, block editor, style variations, custom styles
Requires at least: 6.1
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.0.6
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add multiple block styles to Gutenberg blocks with ease.

== Description ==
Block Style Modifiers is a simple WordPress plugin that allows you to add multiple block styles to Gutenberg blocks.

Style Modifiers are additive CSS classes that:

* Can be applied in addition to a Block Style
* Can be selected multiple at the same time
* Support both checkbox (non-exclusive) and radio (exclusive) behavior per category
* Are predefined and documented by themes or plugins
* Preserve class order, allowing advanced CSS control

= Category Behavior =

Style modifiers are organized into categories with two behaviors:

* **Non-exclusive categories** (checkbox): Multiple modifiers can be selected simultaneously (default: `exclusive: false`)
* **Exclusive categories** (radio): Only one modifier from the category can be selected at a time (`exclusive: true`)

= Structured Category Object =

Categories must be defined as objects with:

* `slug` - Language-independent identifier for grouping (required)
* `label` - Translatable UI label (required)
* `description` - Optional category description
* `exclusive` - Boolean flag for radio behavior (default: false)


== Features ==
* Register multiple style modifiers for any block type
* Apply multiple style modifiers to a single block
* Global style modifiers that apply to all blocks
* Inline CSS support for easy styling of modifiers
* Structured category objects with exclusive/non-exclusive behavior
* Theme-independent default modifiers via Block Style Modifier Pack

= Default Modifiers =
Plugin provides a set of default style modifiers that can be used with any theme:
* **Animations** - Fade In, Slide Up, Scale In
* **Animation Delay** - Fast, Normal, Slow
* **Hover Effects** - Zoom, Rotate, Bounce, Grayscale
* **Text Effects** - Underline Reveal, Text Fade

All default modifiers are theme-independent and performance-optimized.

You can easily extend or override these defaults by registering your own style modifiers in your theme or custom plugin.

== Usage ==
* Define your style modifiers using the `block_style_modifiers_register_style` function via your theme's `functions.php` file or a custom plugin.
* Select style modifiers in the block editor sidebar under "Block Style Modifiers".
* Style modifiers will be applied as additional CSS classes to the block's wrapper element.
* It is possible that reordering of classes may affect CSS specificity and styling.

**Note:** There is available an experimental plugin includes blocks style modifiers:  [Block Style Modifier Pack](https://github.com/Arkenon/block-style-modifier-pack) plugin to function.

== Registering a Block Style Modifier ==

You can easily register your own style modifiers in your theme or custom plugin.

Here are some examples of how to register style modifiers with different category behaviors:

= Exclusive Category (Radio Behavior) =

`block_style_modifiers_register_style( [ 'core/image', 'core/cover' ], [
    'name'        => 'zoom-on-hover',
    'label'       => __( 'Zoom on Hover', 'my-theme' ),
    'class'       => 'bsm-zoom-on-hover',
    'description' => __( 'Zoom into image on hover', 'my-theme' ),
    'category'    => [
        'slug'        => 'hover-effects',
        'label'       => __( 'Hover Effects', 'my-theme' ),
        'description' => __( 'Transform-based hover interactions', 'my-theme' ),
        'exclusive'   => true,
    ],
] );`

= Non-Exclusive Category (Checkbox Behavior) =

`block_style_modifiers_register_style( '*', [
    'name'     => 'hide-sm',
    'label'    => __( 'Hide on Small Screens', 'my-theme' ),
    'class'    => 'bsm-hide-sm',
    'category' => [
        'slug'        => 'responsive',
        'label'       => __( 'Responsive', 'my-theme' ),
        'description' => __( 'Responsive visibility controls', 'my-theme' ),
        'exclusive'   => false,
    ],
] );`

That's it! You can now select multiple style modifiers for your blocks in the Block Editor.

== Example Result in Markup ==

`class="wp-block-cover has-custom-content-position is-position-bottom-left bsm-zoom-hover bsm-fade-in bsm-delay-normal"`

It is important to note that the order of classes may affect CSS specificity and styling. You can easily reorder your modifiers with drag/drop functionality in the Block Editor.

== Source Code ==
It is available on GitHub:
* GitHub: https://github.com/Arkenon/block-style-modifiers

== Installation ==
1. You have a couple options:
	* Go to Plugins -> Add New and search for "Block Style Modifiers". Once found, click "Install".
	* Download the Block Style Modifiers from wordpress.org and make sure the folder us zipped. Then upload via Plugins -> Add New -> Upload.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Add your custom style modifiers using the `register_block_style_modifier` function in your theme's `functions.php` file or a custom plugin.

== Changelog ==
= 1.0.6 =
* Added: Structured category object support (slug, label, description, exclusive)
* Added: Exclusive category behavior (radio selection within categories)
* Added: Non-exclusive category behavior (checkbox selection - default)
* Breaking: Category must now be a structured object (string format no longer supported)
* Updated: Documentation with structured category examples
* Added: Default modifiers

= 1.0.5 =
* Added: Structured category object support (slug, label, description, exclusive)
* Added: Exclusive category behavior (radio selection within categories)
* Added: Non-exclusive category behavior (checkbox selection - default)
* Breaking: Category must now be a structured object (string format no longer supported)
* Updated: Documentation with structured category examples
* Updated: Block Style Modifier Pack with theme-independent default modifiers
* Improved: Category-based grouping and selection UI

= 1.0.4 =
Updated: readme.txt

= 1.0.3 =
Updated: readme.txt

= 1.0.2 =
Updated: readme.txt

= 1.0.1 =
* Added: Source code section in readme.
* Escaped: $inline_style variable to prevent potential security issues.

= 1.0.0 =
* Initial release of Block Style Modifiers.