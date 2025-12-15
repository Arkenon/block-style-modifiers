=== Block Style Modifiers ===
Contributors: arkenon
Tags: block styles, gutenberg, block editor, style variations
Requires at least: 6.1
Tested up to: 6.9
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add multiple block styles to Gutenberg blocks with ease.

== Description ==

Block Style Modifiers is a simple WordPress plugin that allows you to add multiple block styles to Gutenberg blocks.

Style Modifiers are additive CSS classes that:

 - Can be applied in addition to a Block Style
 - Can be selected multiple at the same time
 - Are predefined and documented by themes or plugins
 - Preserve class order, allowing advanced CSS control
 - They behave like checkboxes, not radio buttons.

Registering a block style modifier:

```php
// Example: No bottom margin modifier for Columns block
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

// Example: Lead text modifier for Paragraph block
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

// Example: Global modifier for all blocks
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
```

Example result in markup:

```html
    <div class="wp-block-paragraph is-style-default debug-outline is-lead-text">
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