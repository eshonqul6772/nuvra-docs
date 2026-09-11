# Theming

The editor's colors come from CSS custom properties. Override them to match your design, or switch on the built-in dark palette.

## How the variables work

All variables are declared on the `.document-editor` element, the root of every editor. Menus, popovers and floating toolbars are rendered inside that element, so they use the same values.

The defaults have zero specificity (they are declared with `:where()` since nuvra 0.2.1), so any rule that targets `.document-editor` overrides them, whatever order the stylesheets load in. Set variables on the editor element itself: values on an ancestor such as `body` do not apply, because the editor declares its own.

```css
.document-editor {
  --nuvra-color-primary: #7c3aed;
  --nuvra-color-primary-hover: #8b5cf6;
  --nuvra-color-primary-border: #c4b5fd;
  --nuvra-color-primary-muted: #ddd6fe;
  --nuvra-color-primary-soft: #f5f3ff;
}
```

To style a single editor, give it a class; the class is applied to the editor root:

```vue
<template>
  <DocumentEditor v-model="html" class="contract-editor" />
</template>

<style>
.document-editor.contract-editor {
  --nuvra-color-primary: #0f766e;
  --nuvra-color-primary-soft: #f0fdfa;
}
</style>
```

## Variables

| Variable | Light default | Dark palette | Used for |
| --- | --- | --- | --- |
| `--nuvra-color-primary` | `#409eff` | same | Active buttons, focus, primary buttons |
| `--nuvra-color-primary-hover` | `#79bbff` | `#66b1ff` | Hovered primary buttons |
| `--nuvra-color-primary-border` | `#a0cfff` | `#2a598a` | Focused editor frame, disabled primary buttons |
| `--nuvra-color-primary-muted` | `#c6e2ff` | `#213d5b` | Table size preview, hovered button borders |
| `--nuvra-color-primary-soft` | `#ecf5ff` | `#18222c` | Active button and menu item backgrounds |
| `--nuvra-color-on-primary` | `#fff` | same | Text on primary buttons |
| `--nuvra-color-danger` | `#f56c6c` | same | Destructive actions, reached character limit |
| `--nuvra-color-danger-soft` | `#fef0f0` | `#2b1d1d` | Hovered destructive actions |
| `--nuvra-text-strong` | `#303133` | `#e5eaf3` | Headings in forms |
| `--nuvra-text` | `#606266` | `#cfd3dc` | Regular text and icons |
| `--nuvra-text-muted` | `#909399` | `#a3a6ad` | Labels, captions, status bar |
| `--nuvra-text-placeholder` | `#a8abb2` | `#8d9095` | Placeholders, shortcut hints |
| `--nuvra-text-disabled` | `#c0c4cc` | `#6c6e72` | Disabled buttons |
| `--nuvra-border` | `#dcdfe6` | `#4c4d4f` | Editor frame, inputs |
| `--nuvra-border-hover` | `#c0c4cc` | `#6c6e72` | Hovered inputs |
| `--nuvra-border-light` | `#e4e7ed` | `#414243` | Popovers and floating panels |
| `--nuvra-border-lighter` | `#ebeef5` | `#363637` | Dividers |
| `--nuvra-fill` | `#f5f7fa` | `#262727` | Hovered buttons, segmented controls |
| `--nuvra-bg` | `#fff` | `#141414` | Toolbar, status bar, inputs |
| `--nuvra-bg-overlay` | `#fff` | `#1d1e1f` | Popovers, menus, find bar |
| `--nuvra-shadow` | `0 0 12px rgb(0 0 0 / 12%)` | `0 0 12px rgb(0 0 0 / 72%)` | Popovers and floating panels |
| `--nuvra-fullscreen-z-index` | `2000` | same | Stacking order of the fullscreen editor |

The document sheet itself is always white, like paper, so printed output and the page view look the same.

## Dark mode

The dark palette is applied when an ancestor of the editor, usually `html`, has the `dark` class or the `data-theme="dark"` attribute:

```html
<!-- either -->
<html class="dark">
<!-- or -->
<html data-theme="dark">
```

```ts
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.classList.toggle('dark', prefersDark);
```

A plain `.document-editor` rule overrides a variable in both palettes. To change only the dark value, target `.dark .document-editor` (or `[data-theme="dark"] .document-editor`).

## Following an Element Plus theme

nuvra does not depend on Element Plus, but its default palette matches it. If your app customizes Element Plus, map the variables to its own:

```css
.document-editor {
  --nuvra-color-primary: var(--el-color-primary);
  --nuvra-color-primary-hover: var(--el-color-primary-light-3);
  --nuvra-color-primary-border: var(--el-color-primary-light-5);
  --nuvra-color-primary-muted: var(--el-color-primary-light-8);
  --nuvra-color-primary-soft: var(--el-color-primary-light-9);
  --nuvra-color-danger: var(--el-color-danger);
  --nuvra-text-strong: var(--el-text-color-primary);
  --nuvra-text: var(--el-text-color-regular);
  --nuvra-text-muted: var(--el-text-color-secondary);
  --nuvra-text-placeholder: var(--el-text-color-placeholder);
  --nuvra-text-disabled: var(--el-text-color-disabled);
  --nuvra-border: var(--el-border-color);
  --nuvra-border-light: var(--el-border-color-light);
  --nuvra-border-lighter: var(--el-border-color-lighter);
  --nuvra-fill: var(--el-fill-color-light);
  --nuvra-bg: var(--el-bg-color);
  --nuvra-bg-overlay: var(--el-bg-color-overlay);
  --nuvra-shadow: var(--el-box-shadow-light);
}
```

## Fullscreen stacking order

In fullscreen the editor is a fixed element with `z-index: var(--nuvra-fullscreen-z-index)`. Raise the value if other fixed elements of your app, such as a header or notifications, appear above it:

```css
.document-editor {
  --nuvra-fullscreen-z-index: 5000;
}
```

Menus and popovers opened from the editor are shown in the browser's top layer, so they appear above the fullscreen editor regardless of this value. See [Browser support](/docs/browser-support).
