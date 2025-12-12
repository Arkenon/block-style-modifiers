# Style Modifiers API Specification

This document defines the public API for registering and consuming **Style Modifiers**  
in the WordPress Block Editor.

The API is designed to be:
- Explicit
- Additive
- Non-invasive
- Fully compatible with existing Block Styles

---

## Core Concepts

### Block Style (existing Core concept)

- Single-select
- Mutually exclusive
- Represents a visual variation
- Implemented via `is-style-{name}`

### Style Modifier (this plugin)

- Multi-select
- Additive
- Represents a small visual adjustment
- Implemented via plain CSS class names
- Order-sensitive

---

## Registration API

### `register_block_style_modifier()`

Registers one or more style modifiers for a block.

```php
register_block_style_modifier(
    string $block_name,
    array  $modifier
);
```
### Parameters

#### `$block_name` (string)

The target block name.

Examples:

-   `core/paragraph`
-   `core/group`
-   `my-plugin/custom-block`
-   `*` (wildcard – optional global modifier)
    

----------

#### `$modifier` (array)

Defines a single style modifier.
```php
[
    'name'        => 'no-margin',
    'label'       => 'No margin',
    'class'       => 'no-margin',
    'description' => 'Removes bottom margin from the block',
    'category'    => 'Spacing',
    'supports'    => [
        'editor' => true,
        'front'  => true,
    ],
]
```
----------

**Modifier Properties**

| Key | Type |  Required| Description|
|--|--|--|--|
| `name` | string| ✔| Unique identifier (slug-style)|
| `label` | string| ✔| Human-readable label|
| `class` | string| ✔| CSS class to apply|
| `description` | string| ✖| Help text shown in the editor|
| `category` | string| ✖| Logical grouping in UI|
| `supports.editor` | bool|✖|Apply in editor (default: true)|
| `supports.front` | bool| ✖| Apply on frontend (default: true)|

### Naming Rules

-   `name` MUST be unique per block
    
-   `class` MUST NOT:
    
    -   start with `is-style-`
        
    -   override WordPress-reserved classes
        
-   Plugin or theme prefixes are strongly recommended
    

Examples:

-   `has-divider`
    
-   `u-no-margin`
    
-   `theme-accent-border`
    

----------

## Multiple Modifiers

Multiple modifiers may be registered for the same block:
```php
wpxx_register_block_style_modifier( 'core/paragraph', [ 'name' => 'no-margin', 'label' => 'No margin', 'class' => 'no-margin',
] ); wpxx_register_block_style_modifier( 'core/paragraph', [ 'name' => 'has-divider', 'label' => 'Divider', 'class' => 'has-divider',
] );` 
```
----------

## Block Attribute Model

Each block using style modifiers stores them in a **single attribute**:
```js
`attributes: { styleModifiers: { type: 'array', default: [],
    },
}` 
```

This ensures:
-   Predictable serialization
-   Easy migration    
-   Clean server-side rendering

----------

## Class Composition Rules

At render time, final `className` is composed as:

1.  Block default classes
    
2.  Selected Block Style (`is-style-*`)
    
3.  Selected Style Modifiers (in user-defined order)
    
4.  Alignment / utility classes
    

Example:

```html
<div  class="
  wp-block-paragraph
  is-style-default
  no-margin
  has-divider
  alignwide
">
```
**Order is preserved exactly as selected by the user.**

----------

## Editor UI Contract

### Location

Style Modifiers MUST appear in the Inspector under a dedicated panel:

`Styles
  ○ Default
  ○ Fancy

Modifiers
  ☑ No margin ☑ Divider` 

They MUST NOT:

-   Replace the existing Styles panel
    
-   Interfere with Core UI behavior
    

----------

### UI Component

The default UI implementation uses:

-   `FormTokenField` or checkbox list
    
-   Multi-select
    
-   Drag-reorder support (optional but recommended)
    

----------

## Wildcard (Global) Modifiers

A modifier MAY target all blocks:
```php
`wpxx_register_block_style_modifier( '*', [ 'name' => 'no-radius', 'label' => 'No border radius', 'class' => 'no-radius',
] );` 
```
**Use with caution.**  
Themes SHOULD document global modifiers explicitly.

----------

## Non-Goals (Explicit)

The API does NOT:

-   Resolve CSS conflicts
    
-   Validate visual compatibility
    
-   Enforce design systems
    
-   Modify Core block styles
    
-   Override `Additional CSS Class(es)`
    

----------

## Compatibility Guarantees

-   Fully compatible with Core Block Styles
    
-   Fully compatible with `Additional CSS Class(es)`
    
-   Does not alter saved block markup format
    
-   Safe to deactivate (classes remain in markup)
    

----------

## Future Considerations (Non-Binding)

Possible future extensions (not part of this contract):

-   `theme.json` integration
    
-   Modifier presets
    
-   Conditional modifiers
    
-   Responsive modifiers
    

These are intentionally out of scope for the initial API.

----------

## Summary

This API defines **Style Modifiers** as:

-   Additive
    
-   Explicit
    
-   User-controlled
    
-   Theme-authored
    
-   Order-sensitive
    

It intentionally complements WordPress Core  
without redefining or weakening it.
