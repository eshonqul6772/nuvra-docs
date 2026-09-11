/** English interface texts of the site; the Uzbek texts follow the same shape. */
export const en = {
  meta: {
    title: 'nuvra — Word-style document editor for Vue 3',
    docsTitle: 'nuvra docs'
  },
  nav: {
    main: 'Main navigation',
    docs: 'Docs',
    demo: 'Demo',
    language: 'Language',
    theme: 'Switch colour scheme',
    github: 'nuvra on GitHub',
    menu: 'Documentation menu'
  },
  hero: {
    badge: 'Vue 3 · zero UI dependencies',
    titleLead: 'Real documents,',
    titleAccent: 'right inside Vue.',
    lead: 'nuvra is a Word-style editor for Vue 3: pages with real margins, tables, images, find & replace, printing and Word export — in one component, with Vue as its only dependency.',
    start: 'Get started',
    demo: 'Try it live',
    managers: 'Package manager',
    copy: 'Copy command',
    copied: 'Copied'
  },
  demo: {
    eyebrow: 'Live demo',
    title: 'Go ahead, type something.',
    lead: 'This is the actual package from npm. Switch the site language and the editor’s labels follow; switch to dark mode and the editor does too.',
    tabs: 'Demo type',
    documentTab: 'Document',
    fieldTab: 'Form field',
    accent: 'Accent',
    fileName: 'Service agreement',
    fieldTitle: 'New role',
    nameLabel: 'Role name',
    nameValue: 'Content editor',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'What does this role do?',
    fieldHint: 'The same engine in the web view: it grows with its content and fits into any form.',
    sample: [
      '<h1>Service agreement</h1>',
      '<p><strong>No. 24/09</strong> · Tashkent · 11 September 2026</p>',
      '<p>This agreement is made between <strong>Nuvra Studio LLC</strong> (the “Contractor”) and <em>the Client</em>, together the “Parties”.</p>',
      '<h2>1. Scope of work</h2>',
      '<p>The Contractor designs and delivers a document workflow for the Client:</p>',
      '<ul><li><p>a template library for contracts and letters;</p></li><li><p>role-based review and approval;</p></li><li><p>export to Word and PDF.</p></li></ul>',
      '<h2>2. Schedule and payment</h2>',
      '<table><tbody>',
      '<tr><th><p>Stage</p></th><th><p>Deadline</p></th><th><p>Amount</p></th></tr>',
      '<tr><td><p>Design</p></td><td><p>1 October</p></td><td><p>$2,400</p></td></tr>',
      '<tr><td><p>Development</p></td><td><p>15 November</p></td><td><p>$6,800</p></td></tr>',
      '<tr><td><p>Launch</p></td><td><p>1 December</p></td><td><p>$1,300</p></td></tr>',
      '</tbody></table>',
      '<blockquote><p>Tip: click a table cell to open the table toolbar, or press Ctrl+F to search.</p></blockquote>',
      '<p>Signed on behalf of the Parties.</p>'
    ].join('')
  },
  features: {
    eyebrow: 'Features',
    title: 'Everything a document needs.',
    lead: 'No plugins to assemble and no configuration to write — install it and it works.',
    items: [
      {
        title: 'Real pages',
        text: 'A4, Letter, Legal and more, portrait or landscape, with margins in millimetres. Text flows onto the next page as you type.'
      },
      {
        title: 'Tables that behave',
        text: 'Insert from a size grid, merge and split cells, resize columns, and add rows or columns from a floating toolbar.'
      },
      {
        title: 'Images, your way',
        text: 'Paste, drop or upload. Plug in your own upload handler, then resize, align and describe images in place.'
      },
      {
        title: 'Find & replace',
        text: 'Case-sensitive and whole-word search, highlighted with the CSS Custom Highlight API, with undoable replace.'
      },
      {
        title: 'Print & export',
        text: 'Print or save as PDF with your page settings, or download the document as HTML or a Word .doc file.'
      },
      {
        title: 'Speaks your language',
        text: 'Every label goes through one translator function. Uzbek is built in; plug in vue-i18n or any dictionary.'
      },
      {
        title: 'Themeable to the pixel',
        text: 'Plain CSS variables and a dark palette. No UI framework styles leak in, and none leak out.'
      },
      {
        title: 'Light as a feather',
        text: 'Vue is the only dependency: about 48 kB of gzipped JavaScript, native popovers and inline SVG icons.'
      }
    ]
  },
  quickStart: {
    eyebrow: 'Quick start',
    title: 'Three steps to your first document.',
    lead: 'nuvra drops into an existing Vue 3 project in a minute.',
    steps: [
      { title: 'Install', text: 'Add the package with your package manager.' },
      { title: 'Import the styles', text: 'Once, in your entry file.' },
      { title: 'Render the editor', text: 'Bind the HTML with v-model — that’s it.' }
    ],
    cta: 'Read the guide'
  },
  stats: [
    { value: '1', label: 'dependency — Vue' },
    { value: '48 kB', label: 'of gzipped JavaScript' },
    { value: '124', label: 'translatable labels' },
    { value: 'MIT', label: 'licensed, free forever' }
  ],
  footer: {
    tagline: 'Word-style document editor for Vue 3.',
    license: 'Released under the MIT license.',
    docs: 'Docs'
  },
  docs: {
    onThisPage: 'On this page',
    previous: 'Previous',
    next: 'Next',
    menu: 'Menu',
    copy: 'Copy',
    copied: 'Copied',
    missingTitle: 'This page doesn’t exist',
    missingText: 'Pick a topic from the menu.'
  },
  notFound: {
    title: 'Page not found',
    text: 'The page you are looking for has moved or never existed.',
    home: 'Back to home'
  }
};

/** Shape every language's interface texts follow. */
export type SiteMessages = typeof en;
