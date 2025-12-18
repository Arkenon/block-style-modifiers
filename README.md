
**Style Modifiers for the WordPress Block Editor**

The WordPress Block Editor currently supports Block Styles as mutually exclusive visual variations. This works well for large, alternative designs, but it does not address a common and practical need: additive, combinable style modifiers.
This project introduces the concept of Style Modifiers — optional, multi-select CSS classes that can be applied to blocks in a controlled, discoverable, and user-friendly way.
Style Modifiers are not a replacement for Block Styles. They are a complementary concept that fills a well-known gap without changing existing Core behavior.


![Block Style Modifiers](https://kadimgultekin.com/wp-content/uploads/2025/12/block_style_modifiers_ss.jpg)


**What Problem Does This Solve?**

Current situation:
- Block Styles are single-select (radio-button behavior).
- Only one is-style-* class can be active at a time.

Additive styling is only possible via:
- “Additional CSS Class(es)” (manual, error-prone, undocumented)
- Custom block attributes (developer-specific, not standardized)

Result:
- Users cannot combine small visual tweaks (e.g. zoom-on-hover + grayscale-on-hover)
- Theme authors invent ad-hoc solutions
- UX is inconsistent across themes and plugins

**What Are Style Modifiers?**

Style Modifiers are additive CSS classes that:

 - Can be applied in addition to a Block Style
 - Can be selected multiple at the same time
 - Are predefined and documented by themes or plugins
 - Preserve class order, allowing advanced CSS control
 - They behave like checkboxes, not radio buttons.

**Note:** There is available an experimental plugin includes blocks style modifiers:  [Block Style Modifier Pack](https://github.com/Arkenon/block-style-modifier-pack) plugin to function.

Registering a block style modifier:
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

Modifiers are:
- Predefined
- Named
- Documented
- Block-specific if desired

This makes them safer than free-text CSS classes, not riskier.

**Design Principles**

- Additive, not alternative
- Explicit over implicit
- Theme authors define, users choose
- Class order is preserved
- Conflicts are acceptable and expected (Style conflicts are not a bug — they are a design responsibility of the theme.)

**Non-Goals**

- This project does NOT aim to:
- Replace Block Styles
- Auto-resolve CSS conflicts
- Protect users from all visual mistakes
- Enforce design systems

**Those responsibilities belong to:**

- Themes
- Documentation
- Education
- Conclusion

**Style Modifiers represent a missing middle ground between:**

- “One style only”
- “Write your own CSS class”
- They do not weaken WordPress Core — they respect its boundaries.

That is precisely why they belong in a plugin.

**Contributing**
Have ideas for additional modifiers? Found a bug? Contributions are welcome!

- Fork the repository
- Create your feature branch (`git checkout -b feature/my-feature`)
- Commit your changes (`git commit -am 'Add some feature'`)
- Push to the branch (`git push origin feature/my-feature`)
- Open a pull request
- Please ensure any pull requests adhere to the existing coding style and include appropriate tests where applicable.
- For major changes, please open an issue first to discuss what you would like to change.
- Please make sure to update tests as appropriate.

**License**
This project is licensed under the GPLv2 or later license. See the LICENSE file for details

** Installation **
1. Upload the `block-style-modifiers` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Style modifiers can now be registered by themes or plugins and will appear in the Block Editor sidebar for related core blocks.

** Development **

To set up a development environment for the Block Style Modifiers plugin, follow these steps:
1. Clone the repository to your local machine
2. Install dependencies using Composer or npm if applicable (npm install)
3. Build the plugin using the provided build scripts (npm run build)
   