import type { Component } from 'vue';

import type { Localized } from '../content/docs/nav';

/** Pictures drawn on the cards of the gallery, one per kind of example. */
export type ExampleArt =
  | 'text'
  | 'form'
  | 'sheet'
  | 'lock'
  | 'globe'
  | 'palette'
  | 'file'
  | 'chips'
  | 'numbers'
  | 'toc'
  | 'comment'
  | 'split'
  | 'cursors'
  | 'command'
  | 'image'
  | 'save';

/** A live example: a component in `./demos` whose own source is shown under it. */
export interface ExampleEntry {
  /** Name of the example's file in `./demos`, and its address under `/examples`. */
  slug: string;
  /** Picture on the example's card. */
  art: ExampleArt;
  title: Localized;
  description: Localized;
  /** Components, props and functions of nuvra the example shows, listed on its card. */
  features: string[];
  /** Guide article that explains the topic in depth. */
  guide?: string;
}

/** A titled group of examples, as listed in the gallery and the sidebar. */
export interface ExampleGroup {
  title: Localized;
  examples: ExampleEntry[];
}

export const EXAMPLE_GROUPS: ExampleGroup[] = [
  {
    title: { en: 'Basics', uz: 'Asoslar', ru: 'Основы' },
    examples: [
      {
        slug: 'default-editor',
        art: 'text',
        title: { en: 'Document editor', uz: 'Hujjat muharriri', ru: 'Редактор документов' },
        description: {
          en: 'The full editor in the page view: bind the HTML and the page settings, and you have a word processor.',
          uz: 'Sahifa ko‘rinishidagi to‘liq muharrir: HTML va sahifa sozlamalarini bog‘lang — tayyor matn protsessori.',
          ru: 'Полный редактор в режиме страниц: привяжите HTML и настройки страницы — и у вас текстовый процессор.'
        },
        features: ['DocumentEditor', 'v-model', 'v-model:page'],
        guide: 'getting-started'
      },
      {
        slug: 'form-field',
        art: 'form',
        title: { en: 'Form field', uz: 'Forma maydoni', ru: 'Поле формы' },
        description: {
          en: 'The same engine as a rich text field that grows with its content, with a limit and validation.',
          uz: 'Xuddi shu dvigatel — mazmuni bilan birga o‘sadigan, cheklov va tekshiruvli matn maydoni.',
          ru: 'Тот же движок как поле форматированного текста, растущее с содержимым, с лимитом и валидацией.'
        },
        features: ['Editor', 'maxLength', 'minHeight', 'maxHeight'],
        guide: 'recipe-forms'
      },
      {
        slug: 'page-setup',
        art: 'sheet',
        title: { en: 'Page setup', uz: 'Sahifa sozlamalari', ru: 'Параметры страницы' },
        description: {
          en: 'Paper size, orientation, headers and footers with page numbers, and a watermark — from your own controls.',
          uz: 'Qog‘oz o‘lchami, yo‘nalishi, sahifa raqamli kolontitullar va suv belgisi — o‘z boshqaruvlaringizdan.',
          ru: 'Размер бумаги, ориентация, колонтитулы с номерами страниц и водяной знак — из ваших элементов управления.'
        },
        features: ['v-model:page', 'createHeaderFooter', 'createWatermark'],
        guide: 'usage'
      },
      {
        slug: 'read-only',
        art: 'lock',
        title: { en: 'Read-only document', uz: 'Faqat o‘qish uchun', ru: 'Только для чтения' },
        description: {
          en: 'Lock a signed document: no edits, but selecting, copying, searching and printing still work.',
          uz: 'Imzolangan hujjatni qulflang: tahrirlab bo‘lmaydi, lekin belgilash, nusxalash, qidirish va chop etish ishlaydi.',
          ru: 'Заблокируйте подписанный документ: правка запрещена, но выделение, копирование, поиск и печать работают.'
        },
        features: ['disabled'],
        guide: 'usage'
      },
      {
        slug: 'languages',
        art: 'globe',
        title: { en: 'Interface languages', uz: 'Interfeys tillari', ru: 'Языки интерфейса' },
        description: {
          en: 'Uzbek (Latin and Cyrillic), Russian and English are built in; switch them on the fly.',
          uz: 'O‘zbek (lotin va kirill), rus va ingliz tillari o‘rnatilgan; ularni darhol almashtiring.',
          ru: 'Узбекский (латиница и кириллица), русский и английский встроены; переключайте на лету.'
        },
        features: ['locale', 'editorLocales', 'setEditorLocale'],
        guide: 'translations'
      },
      {
        slug: 'theming',
        art: 'palette',
        title: { en: 'Theming', uz: 'Ranglar', ru: 'Оформление' },
        description: {
          en: 'Give the editor your brand colour with a few CSS variables; dark mode comes built in.',
          uz: 'Bir nechta CSS o‘zgaruvchisi bilan muharrirga brendingiz rangini bering; qorong‘i rejim tayyor.',
          ru: 'Задайте редактору фирменный цвет несколькими CSS-переменными; тёмная тема уже встроена.'
        },
        features: ['--nuvra-color-primary'],
        guide: 'theming'
      }
    ]
  },
  {
    title: { en: 'Documents', uz: 'Hujjatlar', ru: 'Документы' },
    examples: [
      {
        slug: 'word-files',
        art: 'file',
        title: { en: 'Word, PDF and print', uz: 'Word, PDF va chop etish', ru: 'Word, PDF и печать' },
        description: {
          en: 'Open .docx files and download the document as Word, PDF or HTML from your own buttons.',
          uz: '.docx fayllarni oching va hujjatni o‘z tugmalaringiz orqali Word, PDF yoki HTML qilib yuklab oling.',
          ru: 'Открывайте файлы .docx и скачивайте документ в Word, PDF или HTML своими кнопками.'
        },
        features: ['importWord', 'exportWord', 'exportPdf', 'print'],
        guide: 'word-files'
      },
      {
        slug: 'templates',
        art: 'chips',
        title: { en: 'Template variables', uz: 'Shablon o‘zgaruvchilari', ru: 'Переменные шаблона' },
        description: {
          en: 'Insert {{variables}} into a document and fill them with values — in the browser or on a server.',
          uz: 'Hujjatga {{o‘zgaruvchilar}} qo‘ying va ularni qiymatlar bilan to‘ldiring — brauzerda yoki serverda.',
          ru: 'Вставляйте {{переменные}} в документ и заполняйте их значениями — в браузере или на сервере.'
        },
        features: ['variables', 'fillTemplate'],
        guide: 'templates'
      },
      {
        slug: 'document-form',
        art: 'form',
        title: { en: 'Fill in as a form', uz: 'Forma sifatida to‘ldirish', ru: 'Заполнение как формы' },
        description: {
          en: 'Show a template exactly as it prints, with an input in place of every variable, and validate it.',
          uz: 'Shablonni xuddi chop etilgandek, har bir o‘zgaruvchi o‘rnida kiritish maydoni bilan ko‘rsating va tekshiring.',
          ru: 'Покажите шаблон так, как он печатается, с полем ввода вместо каждой переменной, и проверьте его.'
        },
        features: ['DocumentForm', 'validate', 'getHTML'],
        guide: 'templates'
      },
      {
        slug: 'text-tools',
        art: 'numbers',
        title: {
          en: 'Amounts, dates and alphabets',
          uz: 'Summalar, sanalar va alifbolar',
          ru: 'Суммы, даты и алфавиты'
        },
        description: {
          en: 'Write amounts in words, format long dates and convert Uzbek between Latin and Cyrillic.',
          uz: 'Summalarni so‘z bilan yozing, sanalarni to‘liq shaklda chiqaring, o‘zbek matnini lotin va kirill orasida o‘giring.',
          ru: 'Пишите суммы прописью, форматируйте даты и переводите узбекский текст между латиницей и кириллицей.'
        },
        features: ['formatAmountInWords', 'formatLongDate', 'transliterate', 'engine.insertText'],
        guide: 'templates'
      },
      {
        slug: 'table-of-contents',
        art: 'toc',
        title: { en: 'Table of contents', uz: 'Mundarija', ru: 'Оглавление' },
        description: {
          en: 'Insert a table of contents with page numbers and build your own outline of the headings.',
          uz: 'Sahifa raqamlari bilan mundarija qo‘ying va sarlavhalardan o‘z navigatsiyangizni yarating.',
          ru: 'Вставьте оглавление с номерами страниц и постройте собственную навигацию по заголовкам.'
        },
        features: ['updateTableOfContents', 'readOutline'],
        guide: 'word-files'
      }
    ]
  },
  {
    title: { en: 'Advanced', uz: 'Kengaytirilgan', ru: 'Продвинутые' },
    examples: [
      {
        slug: 'comments-and-changes',
        art: 'comment',
        title: {
          en: 'Comments and track changes',
          uz: 'Izohlar va o‘zgarishlarni kuzatish',
          ru: 'Комментарии и правки'
        },
        description: {
          en: 'Review a document like in Word: comments with replies and tracked edits by author.',
          uz: 'Hujjatni Word’dagidek ko‘rib chiqing: javobli izohlar va muallif bo‘yicha kuzatiladigan tahrirlar.',
          ru: 'Рецензируйте документ как в Word: комментарии с ответами и отслеживаемые правки по авторам.'
        },
        features: ['v-model:comments', 'v-model:trackChanges', 'author'],
        guide: 'review'
      },
      {
        slug: 'compare-versions',
        art: 'split',
        title: { en: 'Compare versions', uz: 'Versiyalarni solishtirish', ru: 'Сравнение версий' },
        description: {
          en: 'See what changed between two versions, word by word, while you edit.',
          uz: 'Ikki versiya orasida nima o‘zgarganini tahrirlash davomida so‘zma-so‘z ko‘ring.',
          ru: 'Смотрите, что изменилось между двумя версиями, пословно и прямо во время правки.'
        },
        features: ['DocumentCompare', 'compareDocuments'],
        guide: 'review'
      },
      {
        slug: 'collaboration',
        art: 'cursors',
        title: { en: 'Editing together', uz: 'Birgalikda tahrirlash', ru: 'Совместная работа' },
        description: {
          en: 'Show other people’s carets, names and selections; the transport is up to your app.',
          uz: 'Boshqalarning kursori, ismi va belgilashlarini ko‘rsating; ma’lumot uzatish ilovangiz ixtiyorida.',
          ru: 'Показывайте курсоры, имена и выделения других людей; транспорт остаётся за вашим приложением.'
        },
        features: ['collaborators', 'selectionChange'],
        guide: 'collaboration'
      },
      {
        slug: 'custom-commands',
        art: 'command',
        title: { en: 'Your own commands', uz: 'O‘z buyruqlaringiz', ru: 'Свои команды' },
        description: {
          en: 'Add commands to the “/” menu and buttons to the toolbar that run on the editing engine.',
          uz: '“/” menyusiga buyruqlar va toolbar’ga tahrirlash dvigatelida ishlaydigan tugmalar qo‘shing.',
          ru: 'Добавьте команды в меню «/» и кнопки на панель инструментов, работающие с движком редактора.'
        },
        features: ['slashCommands', '#toolbar', 'engine'],
        guide: 'usage'
      },
      {
        slug: 'image-upload',
        art: 'image',
        title: { en: 'Image upload', uz: 'Rasm yuklash', ru: 'Загрузка изображений' },
        description: {
          en: 'Store inserted, pasted and dropped images on your server instead of inside the HTML.',
          uz: 'Qo‘yilgan, joylashtirilgan va tashlangan rasmlarni HTML ichida emas, o‘z serveringizda saqlang.',
          ru: 'Храните вставленные и перетащенные изображения на своём сервере, а не внутри HTML.'
        },
        features: ['uploadImage', 'maxImageSizeMb', 'uploadError'],
        guide: 'recipe-image-upload'
      },
      {
        slug: 'autosave',
        art: 'save',
        title: { en: 'Autosave', uz: 'Avtosaqlash', ru: 'Автосохранение' },
        description: {
          en: 'Save the document a moment after typing stops, and restore it on the next visit.',
          uz: 'Yozish to‘xtagach hujjatni saqlang va keyingi tashrifda qayta tiklang.',
          ru: 'Сохраняйте документ после паузы в наборе и восстанавливайте при следующем визите.'
        },
        features: ['v-model', 'watch'],
        guide: 'recipe-autosave'
      }
    ]
  }
];

/** Every example in gallery order, for the previous and next links. */
export const EXAMPLES: ExampleEntry[] = EXAMPLE_GROUPS.flatMap(group => group.examples);

/** Group an example belongs to. */
export const groupOf = (slug: string): ExampleGroup | undefined =>
  EXAMPLE_GROUPS.find(group => group.examples.some(example => example.slug === slug));

const COMPONENTS = import.meta.glob<{ default: Component }>('./demos/*.vue');
const SOURCES = import.meta.glob<string>('./demos/*.vue', { query: '?raw', import: 'default' });

/** Loads the component of an example; every example is its own chunk. */
export const loadExample = (slug: string): Promise<{ default: Component }> | undefined =>
  COMPONENTS[`./demos/${slug}.vue`]?.();

/** Loads the source code of an example, exactly as it runs on the page. */
export const loadExampleSource = (slug: string): Promise<string> | undefined => SOURCES[`./demos/${slug}.vue`]?.();

/** File name shown above the source: the slug in PascalCase, like a component file in an app. */
export const exampleFileName = (slug: string): string =>
  `${slug.replace(/(^|-)(\w)/g, (_, _dash: string, letter: string) => letter.toUpperCase())}.vue`;
