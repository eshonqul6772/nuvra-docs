/** English interface texts of the site; the Uzbek and Russian texts follow the same shape. */
export const en = {
  meta: {
    title: 'nuvra — Word-style document editor for Vue 3',
    docsTitle: 'nuvra docs',
    playgroundTitle: 'Playground · nuvra',
    examplesTitle: 'Examples · nuvra'
  },
  nav: {
    main: 'Main navigation',
    docs: 'Docs',
    examples: 'Examples',
    playground: 'Playground',
    demo: 'Demo',
    search: 'Search',
    language: 'Language',
    theme: 'Switch colour scheme',
    github: 'nuvra on GitHub',
    menu: 'Documentation menu'
  },
  search: {
    title: 'Search the docs',
    placeholder: 'Search articles, props, events…',
    results: 'Search results',
    hint: 'Search the guide, the recipes and the API reference.',
    loading: 'Loading articles…',
    empty: (query: string) => `Nothing found for “${query}”.`,
    count: (count: number) => (count === 1 ? '1 result' : `${count} results`),
    navigate: 'to move',
    select: 'to open',
    close: 'Close'
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
    editorLanguage: 'Editor language',
    variables: [
      { name: 'contract_number', label: 'Contract number' },
      { name: 'contract_date', label: 'Contract date' },
      { name: 'client_name', label: 'Client' },
      { name: 'client_director', label: 'Client’s director' },
      { name: 'total_amount', label: 'Total amount' }
    ],
    author: 'Guest',
    comment: {
      author: 'Dilnoza Rahimova',
      text: 'Should the legal department approve documents too? Select any text and press “Add comment” to leave your own note.'
    },
    fileName: 'Service agreement',
    samples: {
      label: 'Sample documents',
      contract: 'Service agreement',
      letter: 'Official letter',
      order: 'Order',
      application: 'Application',
      certificate: 'Certificate of employment'
    },
    fieldTitle: 'New role',
    nameLabel: 'Role name',
    nameValue: 'Content editor',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'What does this role do?',
    fieldHint: 'The same engine in the web view: it grows with its content and fits into any form.',
    sample: [
      '<h1>Service agreement</h1>',
      '<p><strong>No. <span data-variable="contract_number">{{contract_number}}</span></strong> · Tashkent · <span data-variable="contract_date">{{contract_date}}</span></p>',
      '<p>This agreement is made between <strong>Nuvra Studio LLC</strong> (the “Contractor”) and <strong><span data-variable="client_name">{{client_name}}</span></strong> (the “Client”), together the “Parties”.</p>',
      '<h2>1. Scope of work</h2>',
      '<p>The Contractor designs and delivers a document workflow for the Client:</p>',
      '<ul><li><p>a template library for contracts and letters;</p></li><li><p><span data-comment="demo-comment">role-based review and approval</span>;</p></li><li><p>export to Word and PDF.</p></li></ul>',
      '<h2>2. Schedule and payment</h2>',
      '<table><tbody>',
      '<tr><th><p>Stage</p></th><th><p>Deadline</p></th><th><p>Amount</p></th></tr>',
      '<tr><td><p>Design</p></td><td><p>1 October</p></td><td><p>$2,400</p></td></tr>',
      '<tr><td><p>Development</p></td><td><p>15 November</p></td><td><p>$6,800</p></td></tr>',
      '<tr><td><p>Launch</p></td><td><p>1 December</p></td><td><p>$1,300</p></td></tr>',
      '</tbody></table>',
      '<blockquote><p>Tip: insert variables with the { } button or by typing {{total_amount}}, and signature blocks with the pen button.</p></blockquote>',
      '<p>Signed on behalf of the Parties.</p>',
      '<table data-type="signature"><tbody><tr>',
      '<td><p><strong>CLIENT:</strong></p><p><span data-variable="client_name">{{client_name}}</span></p><p>Director</p><p>________________ <span data-variable="client_director">{{client_director}}</span></p><p>Seal</p></td>',
      '<td><p><strong>CONTRACTOR:</strong></p><p>Nuvra Studio LLC</p><p>Director</p><p>________________ A. Karimov</p><p>Seal</p></td>',
      '</tr></tbody></table>'
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
        text: 'Print or save as PDF with your page settings, download the document as HTML or a Word .docx file, or open a .docx file.'
      },
      {
        title: 'Speaks your language',
        text: 'The interface ships in Uzbek, English and Russian. Pick one per editor or once for the whole app.'
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
    { value: '229', label: 'translatable labels' },
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
    copyCode: 'Copy code',
    copied: 'Copied',
    missingTitle: 'This page doesn’t exist',
    missingText: 'Pick a topic from the menu.'
  },
  examples: {
    getStarted: 'Get started',
    overview: 'Overview',
    breadcrumb: 'Breadcrumb',
    filter: 'Filter the examples',
    reset: 'Reset',
    pager: 'More examples',
    previous: 'Previously',
    next: 'Next up',
    lines: (count: number) => `${count} lines`,
    eyebrow: 'Examples',
    title: 'See it working, then copy the code.',
    lead: (count: number) =>
      `${count} live examples of nuvra in a Vue app. Every one runs right on the page, and the code under it is exactly the code that runs.`,
    all: 'All',
    menu: 'Examples',
    demo: 'Live demo',
    guide: 'Read the guide',
    loading: 'Loading the example…',
    missingTitle: 'This example doesn’t exist',
    missingText: 'It may have been renamed.'
  },
  playground: {
    eyebrow: 'Playground',
    title: 'Try the props, then copy the code.',
    lead: 'Every change on the panel applies to the editor right away, the tabs below show what it emits, and the link in the address bar always opens this exact setup.',
    editor: 'Editor',
    controls: 'Props',
    groupLayout: 'Layout',
    groupBehaviour: 'Behaviour',
    groupText: 'Texts',
    groupToolbar: 'Toolbar',
    groupData: 'Data and handlers',
    bindings: 'Bindings',
    viewMode: 'View shown first',
    viewPage: 'Page',
    viewWeb: 'Web',
    height: 'Height in pixels',
    heightAuto: 'Grow with the content',
    minHeight: 'Smallest auto height',
    maxHeight: 'Largest auto height',
    canvasPadding: 'Space around the sheet',
    locale: 'Interface language',
    disabled: 'Read-only document',
    autofocus: 'Focus the document on mount',
    ruler: 'Ruler above the sheet',
    maxLength: 'Character limit, 0 for none',
    maxImageSizeMb: 'Largest image, in MB',
    placeholder: 'Text of an empty document',
    placeholderValue: 'Start writing your document…',
    printTitle: 'Print title and file name',
    author: 'Author of comments and changes',
    toolbarLayout: 'Toolbar arrangement',
    toolbarRow: 'One row',
    toolbarTabs: 'Tabs',
    tools: 'Choose the toolbar tools',
    toolsHint: 'Off: the prop is left out and every tool is shown.',
    toolsAll: 'All',
    toolsNone: 'None',
    variables: 'Pass sample variables',
    slashCommands: 'Add a command to the / menu',
    slashCommandLabel: 'Today’s date',
    collaborators: 'Show a sample collaborator',
    collaboratorName: 'Aziza',
    uploadImage: 'Simulate a slow image upload',
    comments: 'Bind v-model:comments',
    commentsHint: 'Turns the comment tools on.',
    trackChanges: 'Bind v-model:trackChanges',
    trackChangesOn: 'Record changes',
    bindPage: 'Bind v-model:page',
    pageSize: 'Paper size',
    orientation: 'Orientation',
    portrait: 'Portrait',
    landscape: 'Landscape',
    content: 'Document',
    loadSample: 'Load the sample',
    clear: 'Clear',
    reset: 'Reset all',
    copyLink: 'Copy link',
    linkCopied: 'Link copied',
    output: 'Output',
    code: 'Code',
    html: 'HTML',
    events: 'Events',
    eventsEmpty: 'Focus the editor, move the caret or insert an image to see its events here.',
    clearEvents: 'Clear',
    notBound: (binding: string) => `Turn on ${binding} to see its value here.`,
    characters: (count: number) => `${count.toLocaleString('en')} characters`
  },
  notFound: {
    title: 'Page not found',
    text: 'The page you are looking for has moved or never existed.',
    home: 'Back to home'
  }
};

/** Shape every language's interface texts follow. */
export type SiteMessages = typeof en;
