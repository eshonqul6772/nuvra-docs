# Browser support

nuvra targets current evergreen browsers: Chrome, Edge, Safari and Firefox. It uses a few modern web platform features and degrades gracefully where one is missing.

## Popover API

Menus, popovers and the floating toolbars for links, images and tables use the [Popover API](https://developer.mozilla.org/docs/Web/API/Popover_API). It shows them in the browser's top layer, so they appear above dialogs, modals and the fullscreen editor without any z-index configuration.

| Browser | Version |
| --- | --- |
| Chrome and Edge | 114+ |
| Safari | 17+ |
| Firefox | 125+ |

In browsers without the Popover API these panels are shown as fixed elements with a high z-index instead. They still work, but a modal of your app with a higher z-index could cover them.

## CSS Custom Highlight API

Find and replace paints matches through the [CSS Custom Highlight API](https://developer.mozilla.org/docs/Web/API/CSS_Custom_Highlight_API), which highlights text without changing the document. Where the API is not available, search still counts matches, jumps between them and replaces them; the matches are just not highlighted.

## Container queries

The find bar and the status bar use CSS container queries to switch to a compact layout when the editor is narrow, for example in a side panel or on a phone. Browsers without container queries keep the regular layout.

## Clipboard and drag and drop

Copy, cut, paste and drag and drop use the standard clipboard and drag events. No clipboard permission is requested, and pasted content is sanitized before it is inserted.

## Printing and export

Printing renders the document in a hidden frame and opens the browser's own print dialog, where users can also save a PDF. HTML and Word export create the file in the browser and download it; no server is involved.

## Legacy browsers

Internet Explorer and other legacy browsers are not supported.
