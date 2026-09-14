import type { Locale } from '../../i18n';

/** A text in every site language. */
export type Localized = Record<Locale, string>;

/** An article of the documentation; `slug` is also the name of its Markdown files. */
export interface DocsPageEntry {
  slug: string;
  title: Localized;
}

/** A titled group of articles in the sidebar. */
export interface DocsGroup {
  title: Localized;
  pages: DocsPageEntry[];
}

/** Sidebar of the documentation. */
export const DOCS_NAV: DocsGroup[] = [
  {
    title: { en: 'Guide', uz: 'Qo‘llanma' },
    pages: [
      { slug: 'getting-started', title: { en: 'Getting started', uz: 'Boshlash' } },
      { slug: 'usage', title: { en: 'Usage', uz: 'Foydalanish' } },
      { slug: 'templates', title: { en: 'Templates and signatures', uz: 'Shablonlar va imzolar' } },
      { slug: 'review', title: { en: 'Comments and comparison', uz: 'Izohlar va solishtirish' } },
      { slug: 'word-files', title: { en: 'Word files and long documents', uz: 'Word fayllari va katta hujjatlar' } },
      { slug: 'translations', title: { en: 'Languages', uz: 'Tillar' } },
      { slug: 'theming', title: { en: 'Theming', uz: 'Ranglar va mavzu' } }
    ]
  },
  {
    title: { en: 'Reference', uz: 'Ma’lumotnoma' },
    pages: [
      { slug: 'api', title: { en: 'API', uz: 'API' } },
      { slug: 'keyboard-shortcuts', title: { en: 'Keyboard shortcuts', uz: 'Tezkor tugmalar' } },
      { slug: 'browser-support', title: { en: 'Browser support', uz: 'Brauzerlarni qo‘llab-quvvatlash' } },
      { slug: 'changelog', title: { en: 'Changelog', uz: 'O‘zgarishlar tarixi' } }
    ]
  }
];

/** Every article in sidebar order, used for the previous and next links. */
export const DOCS_PAGES: DocsPageEntry[] = DOCS_NAV.flatMap(group => group.pages);
