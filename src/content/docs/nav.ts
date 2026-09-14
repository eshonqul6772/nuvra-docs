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
    title: { en: 'Guide', uz: 'Qo‘llanma', ru: 'Руководство' },
    pages: [
      { slug: 'getting-started', title: { en: 'Getting started', uz: 'Boshlash', ru: 'Начало работы' } },
      { slug: 'usage', title: { en: 'Usage', uz: 'Foydalanish', ru: 'Использование' } },
      {
        slug: 'templates',
        title: { en: 'Templates and signatures', uz: 'Shablonlar va imzolar', ru: 'Шаблоны и подписи' }
      },
      {
        slug: 'review',
        title: { en: 'Comments and comparison', uz: 'Izohlar va solishtirish', ru: 'Комментарии и сравнение' }
      },
      {
        slug: 'collaboration',
        title: { en: 'Editing together', uz: 'Birgalikda tahrirlash', ru: 'Совместное редактирование' }
      },
      {
        slug: 'word-files',
        title: {
          en: 'Word files and long documents',
          uz: 'Word fayllari va katta hujjatlar',
          ru: 'Файлы Word и большие документы'
        }
      },
      { slug: 'translations', title: { en: 'Languages', uz: 'Tillar', ru: 'Языки' } },
      { slug: 'theming', title: { en: 'Theming', uz: 'Ranglar va mavzu', ru: 'Оформление' } }
    ]
  },
  {
    title: { en: 'Recipes', uz: 'Retseptlar', ru: 'Рецепты' },
    pages: [
      { slug: 'recipe-autosave', title: { en: 'Autosave', uz: 'Avtosaqlash', ru: 'Автосохранение' } },
      {
        slug: 'recipe-forms',
        title: { en: 'Forms and validation', uz: 'Formalar va tekshiruv', ru: 'Формы и валидация' }
      },
      {
        slug: 'recipe-image-upload',
        title: { en: 'Image upload', uz: 'Rasmlarni yuklash', ru: 'Загрузка изображений' }
      },
      {
        slug: 'recipe-letters',
        title: { en: 'Letters from a template', uz: 'Shablondan xatlar', ru: 'Письма по шаблону' }
      },
      { slug: 'recipe-nuxt', title: { en: 'Nuxt 3', uz: 'Nuxt 3', ru: 'Nuxt 3' } }
    ]
  },
  {
    title: { en: 'Reference', uz: 'Ma’lumotnoma', ru: 'Справочник' },
    pages: [
      { slug: 'api', title: { en: 'API', uz: 'API', ru: 'API' } },
      {
        slug: 'keyboard-shortcuts',
        title: { en: 'Keyboard shortcuts', uz: 'Tezkor tugmalar', ru: 'Сочетания клавиш' }
      },
      {
        slug: 'browser-support',
        title: { en: 'Browser support', uz: 'Brauzerlarni qo‘llab-quvvatlash', ru: 'Поддержка браузеров' }
      },
      { slug: 'changelog', title: { en: 'Changelog', uz: 'O‘zgarishlar tarixi', ru: 'История изменений' } }
    ]
  }
];

/** Every article in sidebar order, used for the previous and next links. */
export const DOCS_PAGES: DocsPageEntry[] = DOCS_NAV.flatMap(group => group.pages);
