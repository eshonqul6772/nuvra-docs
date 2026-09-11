# Keyboard shortcuts

nuvra supports the shortcuts of familiar word processors and converts Markdown-like sequences as you type. The toolbar tooltips show the shortcut of each command.

## Platform notes

The tables use Windows and Linux keys. On macOS use `⌘` instead of `Ctrl` and `⌥` instead of `Alt`. Shortcuts are matched by the physical key, so they keep working with Cyrillic and other keyboard layouts.

## History

| Shortcut | Action |
| --- | --- |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` or `Ctrl+Shift+Z` | Redo |

## Text formatting

| Shortcut | Action |
| --- | --- |
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+U` | Underline |
| `Ctrl+Shift+S` | Strikethrough |
| `Ctrl+E` | Inline code |
| `Ctrl+,` | Subscript |
| `Ctrl+.` | Superscript |
| `Ctrl+Shift+H` | Highlight |

With a collapsed caret, a formatting shortcut applies to the text you type next.

## Paragraphs and headings

| Shortcut | Action |
| --- | --- |
| `Ctrl+Alt+0` | Normal text |
| `Ctrl+Alt+1` … `Ctrl+Alt+6` | Heading 1 to 6 |
| `Ctrl+Shift+B` | Quote |
| `Ctrl+Alt+C` | Code block |
| `Ctrl+Shift+L` | Align left |
| `Ctrl+Shift+E` | Align center |
| `Ctrl+Shift+R` | Align right |
| `Ctrl+Shift+J` | Justify |
| `Enter` | New paragraph |
| `Shift+Enter` | Line break within the paragraph |
| `Ctrl+Enter` | Page break |
| `Tab` / `Shift+Tab` | At the start of a paragraph: increase or decrease the indent. Inside a line, `Tab` types a tab character. |

## Lists

| Shortcut | Action |
| --- | --- |
| `Ctrl+Shift+8` | Bulleted list |
| `Ctrl+Shift+7` | Numbered list |
| `Ctrl+Shift+9` | Checklist |
| `Tab` / `Shift+Tab` | Nest or un-nest the list item |

## Tables

| Shortcut | Action |
| --- | --- |
| `Tab` | Move to the next cell; in the last cell, add a new row |
| `Shift+Tab` | Move to the previous cell |
| `Delete` / `Backspace` | Clear the selected cells |
| `Escape` | Cancel the cell selection |

Drag across cells with the mouse to select a rectangle of cells.

## Images and links

| Shortcut | Action |
| --- | --- |
| `Delete` / `Backspace` | Delete the selected image |
| `Escape` | Deselect the image |
| `Ctrl+click` | Open the link under the pointer in a new tab |

## Editor

| Shortcut | Action |
| --- | --- |
| `Ctrl+F` | Find |
| `Ctrl+H` | Find and replace |
| `Enter` / `Shift+Enter` | In the search field: next or previous match |
| `Enter` | In the replace field: replace the current match |
| `Ctrl+K` | Insert or edit a link |
| `Ctrl+P` | Print |
| `Escape` | Close the open menu or popover, the find bar, or leave fullscreen |

## Markdown-like input rules

Typing these sequences converts them automatically. Rules never apply inside code.

### At the start of a paragraph

| Type | Result |
| --- | --- |
| `#` to `######` and a space | Heading 1 to 6 |
| `-`, `+` or `*` and a space | Bulleted list |
| `1.` and a space | Numbered list; another number starts the list from it |
| `[ ]` or `[x]` and a space | Checklist item, checked with `x` |
| `>` and a space | Quote |
| `` ``` `` | Code block |
| `---` | Horizontal line |
| `___` or `***` and a space | Horizontal line |

### Inline formatting

| Type | Result |
| --- | --- |
| `**text**` or `__text__` | Bold |
| `*text*` or `_text_` | Italic |
| `~~text~~` | Strikethrough |
| `==text==` | Highlight |
| `` `text` `` | Inline code |

After the closing characters, the text you type next is no longer formatted.

### Links

A web address starting with `http://`, `https://` or `www.` becomes a link when you type a space after it. Addresses starting with `www.` get `https://`.

### Typography

| Type | Result |
| --- | --- |
| `--` | — |
| `...` | … |
| `->` | → |
| `<-` | ← |
| `>>` | » |
| `<<` | « |
| `(c)` | © |
| `(r)` | ® |
| `(tm)` | ™ |
| `(sm)` | ℠ |
| `+/-` | ± |
| `!=` | ≠ |
| `3x4` or `3 * 4` | 3×4 or 3 × 4 |
| `"` and `'` | Typographic quotes “ ” and ‘ ’ |
