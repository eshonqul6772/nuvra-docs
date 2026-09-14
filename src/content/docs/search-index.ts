import type { Locale } from '../../i18n';
import { DOCS_PAGES } from './nav';
import { slugify } from './slugify';

/** A part of an article between two headings: the unit the search matches and links to. */
export interface SearchSection {
  /** Article the section belongs to. */
  slug: string;
  /** Title of the article. */
  title: string;
  /** Heading of the section; empty for the introduction above the first heading. */
  heading: string;
  /** Id of the heading as rendered in the article; empty for the introduction. */
  anchor: string;
  /** Prose of the section as plain text. */
  text: string;
  /** Contents of the section's code blocks. */
  code: string;
}

/** A part of a snippet; `match` marks the words the query found. */
export interface SnippetPart {
  text: string;
  match: boolean;
}

/** A section found by a query. */
export interface SearchResult {
  section: SearchSection;
  /** Text around the first match, split into matched and plain parts. */
  snippet: SnippetPart[];
  score: number;
}

/**
 * Markdown sources of every article as raw text. The glob is resolved at build time and every file becomes its own
 * small chunk, so a visitor only downloads the articles of the language they search in.
 */
const SOURCES = import.meta.glob<string>('./*/*.md', { query: '?raw', import: 'default' });
/** Most results a query returns. */
const RESULT_LIMIT = 20;
/** Characters of context kept before and after the first match in a snippet. */
const SNIPPET_BEFORE = 40;
const SNIPPET_AFTER = 110;
/** Apostrophe variants typed for Uzbek letters; the index and the query treat them as one character. */
const APOSTROPHES = /[‘’'`ʻʼ]/g;

/** Plain text of a line of Markdown: links, emphasis, code spans, tables and list markers are reduced to their text. */
const toPlainText = (line: string) =>
  line
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(^|[\s(])[*_](\S.*?)[*_](?=[\s).,:;!?]|$)/g, '$1$2')
    .replace(/\\([\\`*_{}[\]()#+\-.!|])/g, '$1')
    .replace(/^\s*(?:>\s*)+/, '')
    .replace(/^\s*(?:[-*+]|\d+[.)])\s+/, '')
    .replace(/^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-*:?\s*$/, '')
    .replace(/\s*\|\s*/g, ' ')
    .trim();

/** Splits an article into sections, giving each heading the id markdown-it-anchor gives it in the rendered page. */
const parseArticle = (slug: string, title: string, source: string): SearchSection[] => {
  const sections: SearchSection[] = [];
  const usedIds = new Set<string>();
  let current: SearchSection = { slug, title, heading: '', anchor: '', text: '', code: '' };
  let fence = '';

  /** The id of a heading, numbered like markdown-it-anchor when the same text occurs twice. */
  const uniqueId = (text: string) => {
    const base = slugify(text);
    let id = base;
    for (let index = 1; usedIds.has(id); index++) id = `${base}-${index}`;
    usedIds.add(id);
    return id;
  };

  for (const line of source.split(/\r?\n/)) {
    const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fence) {
      if (fenceMatch?.[1]?.startsWith(fence)) fence = '';
      else current.code += `${line}\n`;
      continue;
    }
    if (fenceMatch?.[1]) {
      fence = fenceMatch[1];
      continue;
    }
    const heading = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (heading?.[1] && heading[2]) {
      const text = toPlainText(heading[2]);
      const anchor = uniqueId(text);
      // The first-level heading is the article title; its introduction stays in the first section.
      if (heading[1].length === 1) continue;
      sections.push(current);
      current = { slug, title, heading: text, anchor, text: '', code: '' };
      continue;
    }
    const text = toPlainText(line);
    if (text) current.text += `${text} `;
  }
  sections.push(current);
  return sections.filter(section => section.heading || section.text);
};

/** Sections per language, parsed once per visit. */
const cache = new Map<Locale, Promise<SearchSection[]>>();

/** Loads and indexes every article of a language. */
export const loadSearchIndex = (locale: Locale): Promise<SearchSection[]> => {
  let index = cache.get(locale);
  if (!index) {
    index = Promise.all(
      DOCS_PAGES.map(async page => {
        const load = SOURCES[`./${locale}/${page.slug}.md`];
        return load ? parseArticle(page.slug, page.title[locale], await load()) : [];
      })
    ).then(articles => articles.flat());
    cache.set(locale, index);
  }
  return index;
};

/** Lower-case text with a single apostrophe, so `o'z` finds `o‘z`. */
const normalize = (text: string) => text.toLowerCase().replace(APOSTROPHES, "'");

/** Counts the occurrences of a term, stopping at a small number since more do not change the ranking much. */
const countOf = (haystack: string, term: string) => {
  let count = 0;
  for (
    let position = haystack.indexOf(term);
    position !== -1 && count < 5;
    position = haystack.indexOf(term, position + 1)
  )
    count++;
  return count;
};

/** Text around the first match of any term, with every match marked. */
const buildSnippet = (source: string, terms: string[]): SnippetPart[] => {
  const normalized = normalize(source);
  const positions = terms.map(term => normalized.indexOf(term)).filter(position => position !== -1);
  const first = positions.length ? Math.min(...positions) : 0;
  let start = Math.max(0, first - SNIPPET_BEFORE);
  let end = Math.min(source.length, first + SNIPPET_AFTER);
  // Snippets start and end on word boundaries.
  if (start > 0) start = source.indexOf(' ', start) + 1 || start;
  if (end < source.length) end = source.lastIndexOf(' ', end) > first ? source.lastIndexOf(' ', end) : end;
  const excerpt = source.slice(start, end);
  const excerptNormalized = normalized.slice(start, end);

  const parts: SnippetPart[] = [];
  let cursor = 0;
  while (cursor < excerpt.length) {
    let next = -1;
    let length = 0;
    for (const term of terms) {
      const position = excerptNormalized.indexOf(term, cursor);
      if (position !== -1 && (next === -1 || position < next)) {
        next = position;
        length = term.length;
      }
    }
    if (next === -1) {
      parts.push({ text: excerpt.slice(cursor), match: false });
      break;
    }
    if (next > cursor) parts.push({ text: excerpt.slice(cursor, next), match: false });
    parts.push({ text: excerpt.slice(next, next + length), match: true });
    cursor = next + length;
  }
  if (start > 0) parts.unshift({ text: '… ', match: false });
  if (end < source.length) parts.push({ text: ' …', match: false });
  return parts;
};

/**
 * Finds the sections that contain every word of the query. Matches in headings rank above matches in titles, which
 * rank above matches in the text and then in code.
 */
export const searchSections = (sections: readonly SearchSection[], query: string): SearchResult[] => {
  const terms = [...new Set(normalize(query).split(/\s+/).filter(Boolean))];
  if (!terms.length) return [];
  const phrase = normalize(query.trim());
  const results: SearchResult[] = [];

  for (const section of sections) {
    const heading = normalize(section.heading);
    const title = normalize(section.title);
    const text = normalize(section.text);
    const code = normalize(section.code);
    let score = 0;
    let complete = true;
    for (const term of terms) {
      const found =
        (heading.includes(term) ? 10 : 0) +
        (title.includes(term) ? 6 : 0) +
        countOf(text, term) +
        countOf(code, term) * 0.5;
      if (!found) {
        complete = false;
        break;
      }
      score += found;
    }
    if (!complete) continue;
    if (heading === phrase || (!section.heading && title === phrase)) score += 20;
    else if (heading.includes(phrase)) score += 8;
    const inText = terms.some(term => text.includes(term));
    const source = inText || !section.code ? section.text : section.code.replace(/\s+/g, ' ');
    results.push({ section, snippet: buildSnippet(source.trim(), terms), score });
  }

  return results.sort((first, second) => second.score - first.score).slice(0, RESULT_LIMIT);
};
