import type { TemplateVariable } from 'nuvra';

import type { PlaygroundOptions } from './playground-options';

/** Defaults of `DocumentEditor`; props equal to them are left out of the snippet. */
const EDITOR_DEFAULTS = {
  height: 760,
  minHeight: 240,
  maxHeight: 600,
  canvasPadding: 50,
  maxImageSizeMb: 10
} as const;

/** Sample data the snippet writes out for the switches that pass it. */
export interface PlaygroundSamples {
  variables: readonly TemplateVariable[];
  /** Label of the sample `/` command, which inserts today's date. */
  slashCommandLabel: string;
  /** Name of the sample collaborator. */
  collaboratorName: string;
}

/** A static attribute with its value escaped for HTML. */
const attribute = (name: string, value: string) => `${name}="${value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`;

/** A string literal in single quotes. */
const literal = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/**
 * Single-file component that renders `DocumentEditor` with the chosen options. Props left at their defaults are
 * omitted, so the code stays as short as the choice allows.
 */
export const buildPlaygroundSnippet = (options: PlaygroundOptions, samples: PlaygroundSamples): string => {
  const imports = ['DocumentEditor'];
  const state = ["const html = ref('');"];
  const attributes = ['v-model="html"'];

  if (options.bindComments) {
    imports.push('type DocumentComment');
    state.push('const comments = ref<DocumentComment[]>([]);');
    attributes.push('v-model:comments="comments"');
  }
  if (options.bindTrackChanges) {
    state.push('const trackChanges = ref(false);');
    attributes.push('v-model:track-changes="trackChanges"');
  }
  if (options.bindPage) {
    imports.push('createPageSettings');
    const overrides = [
      options.pageSize !== 'a4' && `size: ${literal(options.pageSize)}`,
      options.orientation !== 'portrait' && `orientation: ${literal(options.orientation)}`
    ].filter(Boolean);
    state.push(
      overrides.length
        ? `const page = ref({ ...createPageSettings(), ${overrides.join(', ')} });`
        : 'const page = ref(createPageSettings());'
    );
    attributes.push('v-model:page="page"');
  }

  if (options.defaultViewMode !== 'page') attributes.push(attribute('default-view-mode', options.defaultViewMode));
  if (options.autoHeight) {
    attributes.push('height="auto"');
    if (options.minHeight !== EDITOR_DEFAULTS.minHeight) attributes.push(`:min-height="${options.minHeight}"`);
    if (options.maxHeight !== EDITOR_DEFAULTS.maxHeight) attributes.push(`:max-height="${options.maxHeight}"`);
  } else if (options.height !== EDITOR_DEFAULTS.height) {
    attributes.push(`:height="${options.height}"`);
  }
  if (options.canvasPadding !== EDITOR_DEFAULTS.canvasPadding)
    attributes.push(`:canvas-padding="${options.canvasPadding}"`);
  attributes.push(attribute('locale', options.locale));
  if (options.disabled) attributes.push('disabled');
  if (options.autofocus) attributes.push('autofocus');
  if (!options.ruler) attributes.push(':ruler="false"');
  if (options.maxLength > 0) attributes.push(`:max-length="${options.maxLength}"`);
  if (options.maxImageSizeMb !== EDITOR_DEFAULTS.maxImageSizeMb)
    attributes.push(`:max-image-size-mb="${options.maxImageSizeMb}"`);
  if (options.placeholder) attributes.push(attribute('placeholder', options.placeholder));
  if (options.title) attributes.push(attribute('title', options.title));
  if (options.author) attributes.push(attribute('author', options.author));

  if (options.toolbarLayout !== 'row') attributes.push(attribute('toolbar-layout', options.toolbarLayout));
  if (options.tools) {
    imports.push('type ToolbarTool');
    state.push(`const tools: ToolbarTool[] = [${options.tools.map(literal).join(', ')}];`);
    attributes.push(':tools="tools"');
  }
  if (options.variables) {
    imports.push('type TemplateVariable');
    const items = samples.variables.map(
      variable => `  { name: ${literal(variable.name)}, label: ${literal(variable.label)} }`
    );
    state.push(`const variables: TemplateVariable[] = [\n${items.join(',\n')}\n];`);
    attributes.push(':variables="variables"');
  }
  if (options.slashCommands) {
    imports.push('type SlashCommand');
    state.push(
      [
        'const slashCommands: SlashCommand[] = [',
        '  {',
        "    id: 'today',",
        `    label: ${literal(samples.slashCommandLabel)},`,
        "    icon: 'calendar-days',",
        '    run: engine => engine.insertText(new Date().toLocaleDateString())',
        '  }',
        '];'
      ].join('\n')
    );
    attributes.push(':slash-commands="slashCommands"');
  }
  if (options.collaborators) {
    imports.push('type Collaborator');
    state.push(
      [
        'const collaborators = ref<Collaborator[]>([',
        `  { id: 'guest', name: ${literal(samples.collaboratorName)}, selection: { anchor: 12, focus: 40 } }`,
        ']);'
      ].join('\n')
    );
    attributes.push(':collaborators="collaborators"');
  }
  if (options.uploadImage) {
    imports.push('type DocumentImageUploadHandler');
    state.push(
      [
        '// Send the file to your server and resolve with the URL it is stored at.',
        'const uploadImage: DocumentImageUploadHandler = async file => {',
        '  const body = new FormData();',
        "  body.append('file', file);",
        "  const response = await fetch('/api/uploads', { method: 'POST', body });",
        '  return (await response.json()).url;',
        '};'
      ].join('\n')
    );
    attributes.push(':upload-image="uploadImage"');
  }

  return [
    '<script setup lang="ts">',
    "import { ref } from 'vue';",
    `import { ${imports.join(', ')} } from 'nuvra';`,
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
