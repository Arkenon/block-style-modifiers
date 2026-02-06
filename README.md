
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
 - Can be selected multiple at the same time (or exclusively within a category)
 - Are predefined and documented by themes or plugins
 - Preserve class order, allowing advanced CSS control
 - Support both checkbox (non-exclusive) and radio (exclusive) behavior per category

**Category Behavior**

Style modifiers are organized into categories with two behaviors:

- **Non-exclusive categories** (checkbox behavior): Multiple modifiers can be selected simultaneously (default: `exclusive: false`)
- **Exclusive categories** (radio behavior): Only one modifier can be selected at a time within the category (`exclusive: true`)

Registering block style modifiers:

```php
// Example 1: Exclusive category (radio behavior)
block_style_modifiers_register_style( [ 'core/image', 'core/cover' ], [
    'name'        => 'zoom-on-hover',
    'label'       => __( 'Zoom on Hover', 'block-style-modifier-pack' ),
    'class'       => 'bsm-zoom-on-hover',
    'description' => __( 'Zoom into image on hover', 'block-style-modifier-pack' ),
    'category'    => [
        'slug'        => 'hover-effects',
        'label'       => __( 'Hover Effects', 'block-style-modifier-pack' ),
        'description' => __( 'Transform-based hover interactions', 'block-style-modifier-pack' ),
        'exclusive'   => true,  // Only one hover effect can be selected at a time
    ],
] );

// Example 2: Another modifier in the same exclusive category
block_style_modifiers_register_style( [ 'core/image', 'core/cover' ], [
    'name'        => 'grayscale-hover',
    'label'       => __( 'Grayscale on Hover', 'block-style-modifier-pack' ),
    'class'       => 'bsm-grayscale-hover',
    'description' => __( 'Image appears grayscale and reveals color on hover', 'block-style-modifier-pack' ),
    'category'    => [
        'slug'        => 'hover-effects',
        'label'       => __( 'Hover Effects', 'block-style-modifier-pack' ),
        'exclusive'   => true,
    ],
] );

// Example 3: Non-exclusive category (checkbox behavior)
block_style_modifiers_register_style( '*', [
    'name'         => 'hide-sm',
    'label'        => __( 'Hide on Small Screens', 'block-style-modifier-pack' ),
    'class'        => 'bsm-hide-sm',
    'description'  => __( 'Hide block on small (max-width: 600px) screens', 'block-style-modifier-pack' ),
    'category'     => [
        'slug'        => 'responsive',
        'label'       => __( 'Responsive', 'block-style-modifier-pack' ),
        'description' => __( 'Responsive visibility controls', 'block-style-modifier-pack' ),
        'exclusive'   => false,  // Multiple modifiers can be selected
    ],
    'inline_style' => '
        @media (max-width: 600px) {
            .bsm-hide-sm {
                display: none !important;
            }
        }
    ',
] );
```

Example result in markup:

```html
<div class="wp-block-cover has-custom-content-position is-position-bottom-left bsm-zoom-hover bsm-fade-in bsm-delay-normal">
    ...
</div>
```

**Category Object Structure**

Categories must be defined as structured objects with the following properties:

- **slug** (string, required): Language-independent identifier used for grouping
- **label** (string, required): Translatable label shown in the UI
- **description** (string, optional): Descriptive text shown under the category title
- **exclusive** (boolean, optional): If `true`, only one modifier from this category can be selected at a time (radio behavior). Default: `false` (checkbox behavior)

Example:

```php
'category' => [
    'slug'        => 'hover-effects',
    'label'       => __( 'Hover Effects', 'my-theme' ),
    'description' => __( 'Transform-based hover interactions', 'my-theme' ),
    'exclusive'   => true,
]
```

Modifiers are:
- Predefined
- Named
- Documented
- Block-specific if desired

This makes them safer than free-text CSS classes, not riskier.

**Default Modifiers**

Block Style Modifiers comes with **theme-independent default modifiers** that work with any WordPress theme without conflicts.

**Philosophy**
- ✅ Enhance **behavior**, not visual design
- ✅ No borders, shadows, spacing, or color palettes
- ✅ Work with **any theme** without conflicts
- ✅ Atomic and performant
- ✅ Respect `prefers-reduced-motion`

**1️⃣ Animations** (Exclusive Category)
Applied to: **Group, Row, Stack, Grid, Column, Columns** (wrapper blocks only)
- **Fade In** - Smooth entrance animation with fade effect
- **Slide Up** - Slide from bottom with fade effect
- **Scale In** - Scale up animation with fade effect
- **Slide Down** - Slide from top with fade effect
- **Slide Left** - Slide from right with fade effect
- **Slide Right** - Slide from left with fade effect
- **Rotate In** - Rotate animation with fade effect
- **Flip In X** - Flip animation along X-axis with fade effect

**2️⃣ Animation Delay** (Exclusive Category)
Works with Animation category
- **Fast (0.2s)** - Quick animation start
- **Normal (0.4s)** - Standard animation delay
- **Slow (0.8s)** - Delayed animation start

**3️⃣ Hover Effects** (Exclusive Category)
Applied to: **Image, Cover, Media & Text** (content blocks only)
- **Zoom In on Hover** - Block scales up on hover
- **Subtle Rotate on Hover** - Block rotates slightly on hover
- **Bounce on Hover** - Very subtle bounce animation on hover
- **Shake on Hover** - Subtle shake/vibrate effect on hover
- **Brighten on Hover** - Increase brightness on hover
- **Darken on Hover** - Decrease brightness on hover
- **Grayscale to Color on Hover** - Image starts grayscale and reveals color on hover (Image/Cover only)
- **Blur to Focus on Hover** - Image starts blurred and becomes sharp on hover (Image/Cover only)

**4️⃣ Text Effects** (Exclusive Category)
Applied to: **Paragraph, Heading** (text blocks only)
- **Underline Reveal on Hover** - Animated underline appears on hover
- **Soft Text Fade on Hover** - Text softly fades on hover

All default modifiers respect user preferences and animations are disabled when `prefers-reduced-motion` is set.

**Architecture Note:** Animations are only available for wrapper blocks (Group, Row, Stack, etc.) while Hover Effects are for content blocks (Image, Cover, Media & Text). This separation prevents CSS property conflicts and ensures all modifiers work seamlessly together.

---

**Creating Custom Modifiers**

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
   