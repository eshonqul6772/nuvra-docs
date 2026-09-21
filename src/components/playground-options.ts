import type { LocationQuery, LocationQueryRaw } from 'vue-router';
import {
  type DocumentViewMode,
  type EditorLocaleCode,
  type PageOrientation,
  type PageSizeKey,
  TOOLBAR_TOOLS,
  type ToolbarTool
} from 'nuvra';

/** Props and bindings of `DocumentEditor` that the playground can change. */
export interface PlaygroundOptions {
  defaultViewMode: DocumentViewMode;
  /** Height in pixels, used while `autoHeight` is off. */
  height: number;
  autoHeight: boolean;
  /** Bounds of an auto-height editor, in pixels. */
  minHeight: number;
  maxHeight: number;
  /** Space around the sheet, in pixels. */
  canvasPadding: number;
  locale: EditorLocaleCode;
  disabled: boolean;
  autofocus: boolean;
  ruler: boolean;
  /** Character limit; `0` means unlimited. */
  maxLength: number;
  maxImageSizeMb: number;
  placeholder: string;
  title: string;
  author: string;
  /** Toolbar tools shown; `null` shows every tool, as when the prop is left out. */
  tools: ToolbarTool[] | null;
  /** One row of tools, or tools split into tabs. */
  toolbarLayout: PlaygroundToolbarLayout;
  /** Pass the sample template variables. */
  variables: boolean;
  /** Pass a sample `/` command of the host application. */
  slashCommands: boolean;
  /** Pass a sample collaborator whose caret is drawn over the document. */
  collaborators: boolean;
  /** Pass an `uploadImage` handler that simulates a slow upload. */
  uploadImage: boolean;
  bindComments: boolean;
  bindTrackChanges: boolean;
  bindPage: boolean;
  pageSize: PageSizeKey;
  orientation: PageOrientation;
}

/** Arrangements of the toolbar, as the `toolbarLayout` prop takes them. */
export type PlaygroundToolbarLayout = 'row' | 'tabs';
export const TOOLBAR_LAYOUTS: readonly PlaygroundToolbarLayout[] = ['row', 'tabs'];

/** Paper formats of the page settings. */
export const PAGE_SIZES: readonly PageSizeKey[] = ['a4', 'a5', 'a3', 'letter', 'legal'];
export const ORIENTATIONS: readonly PageOrientation[] = ['portrait', 'landscape'];
export const VIEW_MODES: readonly DocumentViewMode[] = ['page', 'web'];

/** Limits of the number fields, which also clamp values read from a shared link. */
export const NUMBER_LIMITS = {
  height: { min: 240, max: 1600, step: 20 },
  minHeight: { min: 120, max: 1200, step: 20 },
  maxHeight: { min: 240, max: 1600, step: 20 },
  canvasPadding: { min: 0, max: 120, step: 5 },
  maxLength: { min: 0, max: 1_000_000, step: 100 },
  maxImageSizeMb: { min: 1, max: 100, step: 1 }
} as const satisfies Partial<Record<keyof PlaygroundOptions, { min: number; max: number; step: number }>>;

type NumberOption = keyof typeof NUMBER_LIMITS;

/** Clamps a typed or shared value into the field's range, falling back to `fallback` when it is not a number. */
export const clampNumber = (key: NumberOption, value: unknown, fallback: number): number => {
  const number = Math.round(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.min(NUMBER_LIMITS[key].max, Math.max(NUMBER_LIMITS[key].min, number));
};

/** Texts of the options that follow the site language. */
export interface LocalizedDefaults {
  locale: EditorLocaleCode;
  placeholder: string;
  title: string;
  author: string;
}

/** The playground as it opens: the editor's own defaults, except for a shorter height and the sample bindings. */
export const createDefaultOptions = (localized: LocalizedDefaults): PlaygroundOptions => ({
  defaultViewMode: 'page',
  height: 640,
  autoHeight: false,
  minHeight: 240,
  maxHeight: 600,
  canvasPadding: 50,
  maxLength: 0,
  maxImageSizeMb: 10,
  disabled: false,
  autofocus: false,
  ruler: true,
  tools: null,
  toolbarLayout: 'row',
  variables: true,
  slashCommands: false,
  collaborators: false,
  uploadImage: false,
  bindComments: true,
  bindTrackChanges: false,
  bindPage: false,
  pageSize: 'a4',
  orientation: 'portrait',
  ...localized
});

const firstValue = (value: LocationQuery[string]): string | undefined =>
  (Array.isArray(value) ? value[0] : value) ?? undefined;

/**
 * Options described by a shared link: every key of the query that names an option replaces its default, and values
 * that do not fit the option are ignored.
 */
export const readOptionsFromQuery = (
  query: LocationQuery,
  defaults: PlaygroundOptions,
  locales: readonly EditorLocaleCode[]
): PlaygroundOptions => {
  const options = { ...defaults };
  const target = options as unknown as Record<string, unknown>;

  for (const [key, raw] of Object.entries(query)) {
    if (!(key in defaults)) continue;
    const value = firstValue(raw);
    if (value === undefined) continue;
    const fallback = defaults[key as keyof PlaygroundOptions];

    if (key === 'tools') {
      options.tools = value === '' ? [] : value.split(',').filter((tool): tool is ToolbarTool => isTool(tool));
    } else if (key === 'locale') {
      if (locales.includes(value as EditorLocaleCode)) options.locale = value as EditorLocaleCode;
    } else if (key === 'defaultViewMode') {
      if (VIEW_MODES.includes(value as DocumentViewMode)) options.defaultViewMode = value as DocumentViewMode;
    } else if (key === 'toolbarLayout') {
      if (TOOLBAR_LAYOUTS.includes(value as PlaygroundToolbarLayout))
        options.toolbarLayout = value as PlaygroundToolbarLayout;
    } else if (key === 'pageSize') {
      if (PAGE_SIZES.includes(value as PageSizeKey)) options.pageSize = value as PageSizeKey;
    } else if (key === 'orientation') {
      if (ORIENTATIONS.includes(value as PageOrientation)) options.orientation = value as PageOrientation;
    } else if (typeof fallback === 'boolean') {
      target[key] = value === '1' || value === 'true';
    } else if (typeof fallback === 'number') {
      target[key] = clampNumber(key as NumberOption, value, fallback);
    } else if (typeof fallback === 'string') {
      target[key] = value;
    }
  }

  return options;
};

/** The query of a link to `options`: only the options that differ from the defaults, so links stay short. */
export const optionsToQuery = (options: PlaygroundOptions, defaults: PlaygroundOptions): LocationQueryRaw => {
  const query: LocationQueryRaw = {};

  for (const key of Object.keys(defaults) as (keyof PlaygroundOptions)[]) {
    const value = options[key];
    if (key === 'tools') {
      if (options.tools) query.tools = options.tools.join(',');
    } else if (value !== defaults[key]) {
      query[key] = typeof value === 'boolean' ? (value ? '1' : '0') : String(value);
    }
  }

  return query;
};

const isTool = (value: string): value is ToolbarTool => (TOOLBAR_TOOLS as readonly string[]).includes(value);
