import type { DocumentViewMode, EditorLocaleCode, TemplateVariable } from 'nuvra';

/** Height of `DocumentEditor` when the `height` prop is not set, in pixels. */
export const DEFAULT_EDITOR_HEIGHT = 760;

/** Props and bindings chosen in the playground. */
export interface PlaygroundOptions {
  defaultViewMode: DocumentViewMode;
  /** Height in pixels, used while `autoHeight` is off. */
  height: number;
  autoHeight: boolean;
  locale: EditorLocaleCode;
  disabled: boolean;
  ruler: boolean;
  /** Character limit; `0` means unlimited. */
  maxLength: number;
  placeholder: string;
  title: string;
  author: string;
  bindComments: boolean;
  bindTrackChanges: boolean;
  /** Sample variables, or `undefined` when none are passed. */
  variables: readonly TemplateVariable[] | undefined;
}

/** A static attribute with its value escaped for HTML. */
const attribute = (name: string, value: string) => `${name}="${value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`;

/** A string literal in single quotes. */
const literal = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/**
 * Single-file component that renders `DocumentEditor` with the chosen options. Props left at their defaults are
 * omitted, so the code stays as short as the choice allows.
 */
export const buildPlaygroundSnippet = (options: PlaygroundOptions): string => {
  const types = ['DocumentEditor'];
  const state = ["const html = ref('');"];
  const attributes = ['v-model="html"'];

  if (options.bindComments) {
    types.push('type DocumentComment');
    state.push('const comments = ref<DocumentComment[]>([]);');
    attributes.push('v-model:comments="comments"');
  }
  if (options.bindTrackChanges) {
    state.push('const trackChanges = ref(false);');
    attributes.push('v-model:track-changes="trackChanges"');
  }
  if (options.defaultViewMode !== 'page') attributes.push(attribute('default-view-mode', options.defaultViewMode));
  if (options.autoHeight) attributes.push('height="auto"');
  else if (options.height !== DEFAULT_EDITOR_HEIGHT) attributes.push(`:height="${options.height}"`);
  attributes.push(attribute('locale', options.locale));
  if (options.disabled) attributes.push('disabled');
  if (!options.ruler) attributes.push(':ruler="false"');
  if (options.maxLength > 0) attributes.push(`:max-length="${options.maxLength}"`);
  if (options.placeholder) attributes.push(attribute('placeholder', options.placeholder));
  if (options.title) attributes.push(attribute('title', options.title));
  if (options.author) attributes.push(attribute('author', options.author));
  if (options.variables) {
    types.push('type TemplateVariable');
    const items = options.variables.map(
      variable => `  { name: ${literal(variable.name)}, label: ${literal(variable.label)} }`
    );
    state.push(`const variables: TemplateVariable[] = [\n${items.join(',\n')}\n];`);
    attributes.push(':variables="variables"');
  }

  return [
    '<script setup lang="ts">',
    "import { ref } from 'vue';",
    `import { ${types.join(', ')} } from 'nuvra';`,
    '',
    ...state,
    '</script>',
    '',
    '<template>',
    '  <DocumentEditor',
    ...attributes.map(line => `    ${line}`),
    '  />',
    '</template>'
  ].join('\n');
};
