/**
 * Heading ids: lower-case words joined by dashes; Uzbek apostrophes are dropped so ids stay readable. The Markdown
 * pipeline and the search index share it, so a search result links to the heading the article renders.
 */
export const slugify = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/[‘’'`ʻʼ]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
