# API

Полный справочник всего, что экспортирует nuvra: компоненты, функции, константы и типы.

Элементы с пометкой **Новое в 0.6.0** добавлены в версии 0.6.0; см. [История изменений](/docs/changelog).

## Экспорты

```ts
import {
  DocumentCompare,
  DocumentEditor,
  DocumentForm,
  Editor,
  buildDocx,
  buildTableOfContents,
  collaboratorColor,
  compareDocuments,
  createCommentId,
  createHeaderFooter,
  createPageSettings,
  createWatermark,
  editorLocales,
  en,
  fillTemplate,
  formatAmountInWords,
  formatLongDate,
  formatShortDate,
  getDocumentTemplate,
  getTemplateVariables,
  numberToWords,
  parseAmount,
  readDocx,
  readOutline,
  ru,
  setEditorLocale,
  transliterate,
  uz,
  uzCyrl,
  type Collaborator,
  type DocumentComment,
  type DocumentCommentReply,
  type DocumentComparison,
  type DocumentEngine,
  type DocumentImageUploadHandler,
  type DocumentTemplate,
  type DocumentTemplateId,
  type DocumentViewMode,
  type DocxImport,
  type DocxSource,
  type EditorLocale,
  type EditorLocaleCode,
  type EditorLocaleInput,
  type EditorUiState,
  type FillTemplateOptions,
  type IconName,
  type NumberWordsLocale,
  type OutlineHeading,
  type PageHeaderFooter,
  type PageMargins,
  type PageOrientation,
  type PageSettings,
  type PageSizeKey,
  type PageWatermark,
  type SelectionOffsets,
  type SlashCommand,
  type TableOfContentsEntry,
  type TableOfContentsOptions,
  type TemplateValues,
  type TemplateVariable,
  type TrackedChange,
  type TransliterationDirection
} from 'nuvra';
import 'nuvra/style.css';
```

## DocumentEditor

Полноценный редактор в стиле Word: панель инструментов, страничный или веб-режим, строка состояния, поиск и замена, комментарии, отслеживаемые изменения, сноски, печать, импорт и экспорт.

### Props

| Проп | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `author` | `string` | `''` | Имя, которое записывается автором новых комментариев, ответов и отслеживаемых изменений; см. [Комментарии и сравнение](/docs/review). |
| `autofocus` | `boolean` | `false` | Ставит курсор в конец документа, как только редактор готов. |
| `canvasPadding` | `number \| string` | `50` | Серое пространство вокруг страницы или веб-листа. |
| `collaborators` | `Collaborator[]` | `[]` | **Новое в 0.6.0.** Другие люди, редактирующие документ; их курсоры и выделения рисуются поверх него. См. [Совместное редактирование](/docs/collaboration). |
| `defaultViewMode` | `DocumentViewMode` | `'page'` | Режим, показываемый первым; пользователь может переключить его в строке состояния. |
| `disabled` | `boolean` | `false` | Делает документ доступным только для чтения и отключает все элементы редактирования. |
| `height` | `number \| string` | `760` | Высота всего редактора или `'auto'`, чтобы он рос вместе с содержимым в пределах от `minHeight` до `maxHeight`. |
| `locale` | `EditorLocaleInput` | — | Язык интерфейса: `uz`, `uzCyrl`, `en`, `ru` или их коды; по умолчанию — общий язык приложения. |
| `maxHeight` | `number \| string` | `600` | Наибольшая высота редактора с автовысотой; более длинные документы прокручиваются внутри него. |
| `maxImageSizeMb` | `number` | `10` | Наибольший допустимый размер файла изображения в мегабайтах. |
| `maxLength` | `number` | `0` | Наибольшее число символов; `0` — без ограничений. |
| `minHeight` | `number \| string` | `240` | Наименьшая высота редактора с автовысотой. |
| `placeholder` | `string` | `''` | Текст, показываемый, пока документ пуст; если не задан, используется метка `editor.placeholder`. |
| `ruler` | `boolean` | `true` | Показывает линейку над листом в страничном режиме; пользователь также может включить или выключить её в меню «Ещё». |
| `slashCommands` | `SlashCommand[]` | `[]` | Команды вашего приложения, показываемые первыми в меню `/`; см. [Использование](/docs/usage). |
| `title` | `string` | `''` | Заголовок при печати и имя экспортируемого файла; если не задан, используется метка `editor.document`. |
| `uploadImage` | `DocumentImageUploadHandler` | — | Загружает вставленное изображение и возвращает его URL; без него изображения встраиваются как data URL. |
| `variables` | `TemplateVariable[]` | `[]` | Переменные шаблона, которые может вставлять пользователь; см. [Шаблоны и подписи](/docs/templates). |

Числа задаются в пикселях; строки используются как CSS-длины. Остальные атрибуты, например `class` и `style`, применяются к корневому элементу редактора.

### v-model

| Привязка | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `v-model` | `string` | `''` | HTML документа. Пустой документ — `''`; при вводе значение обновляется после короткой паузы. |
| `v-model:page` | `PageSettings` | `createPageSettings()` | Размер бумаги, ориентация, поля, колонтитулы, водяной знак и нумерация страниц. |
| `v-model:comments` | `DocumentComment[]` | — | Комментарии к документу. Привязка включает инструменты комментирования; в HTML сохраняются только их якоря. |
| `v-model:trackChanges` | `boolean` | `false` | Записываются ли правки как отслеживаемые изменения. Пункт «Запись исправлений» в меню «Рецензирование» на панели инструментов тоже переключает это значение. |

### События

| Событие | Данные | Описание |
| --- | --- | --- |
| `focus` | — | Область редактирования получила фокус. |
| `blur` | — | Область редактирования потеряла фокус; ожидающие обновления модели уже записаны. |
| `uploadError` | `error: unknown` | Изображение не прошло проверку или его загрузка не удалась. |
| `importError` | `error: unknown` | Не удалось прочитать файл Word; документ остаётся без изменений. |
| `exportError` | `error: unknown` | **Новое в 0.6.0.** Не удалось отрисовать PDF, например потому что браузер этого не разрешает; файл не скачивается. |
| `selectionChange` | `selection: SelectionOffsets \| null` | **Новое в 0.6.0.** Курсор или выделение переместились; `null`, когда они покинули документ. Передавайте это значение другим людям, редактирующим документ. |

### Слоты

| Слот | Props | Описание |
| --- | --- | --- |
| `toolbar` | `{ engine: DocumentEngine; state: EditorUiState; disabled: boolean }` | Кнопки вашего приложения, размещаемые в начале правой группы панели инструментов. `disabled` равен `true`, пока документ доступен только для чтения или показан исходный HTML. |

### Доступные члены

Доступны через ref шаблона.

| Член | Тип | Описание |
| --- | --- | --- |
| `focus` | `() => void` | Переводит фокус клавиатуры в документ. |
| `getHTML` | `() => string` | Записывает ожидающие правки в модель и возвращает HTML документа. |
| `insertVariable` | `(name: string) => void` | Вставляет переменную шаблона в место выделения. |
| `updateTableOfContents` | `() => Promise<void>` | Вставляет оглавление в место выделения или обновляет существующее. |
| `importWord` | `(file: File) => Promise<void>` | Заменяет документ и параметры страницы содержимым файла `.docx` за один шаг отмены. Ошибки передаются через `importError`. |
| `print` | `() => Promise<void>` | Открывает диалог печати браузера. |
| `exportHtml` | `() => Promise<void>` | Скачивает документ как HTML-страницу. |
| `exportWord` | `() => Promise<void>` | Скачивает документ как файл Word (`.docx`). |
| `exportPdf` | `() => Promise<void>` | **Новое в 0.6.0.** Скачивает документ как PDF, отрисованный из его страниц, без диалога печати; текст в PDF нельзя выделить. Ошибки передаются через `exportError`. См. [Файлы Word и большие документы](/docs/word-files#скачивание-pdf). |
| `engine` | `DocumentEngine \| null` | Движок редактирования для продвинутых интеграций; `null`, пока редактор не смонтирован. |

## Editor

Поле форматированного текста для форм: `DocumentEditor` в веб-режиме с `height: 'auto'`, растущий вместе с содержимым в пределах от `minHeight` до `maxHeight`.

### Props

| Проп | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `autofocus` | `boolean` | `false` | Ставит курсор в конец содержимого, когда редактор готов. |
| `canvasPadding` | `number \| string` | `50` | Серое пространство вокруг листа. |
| `disabled` | `boolean` | `false` | Делает содержимое доступным только для чтения и отключает панель инструментов. |
| `locale` | `EditorLocaleInput` | — | Язык интерфейса: `uz`, `uzCyrl`, `en`, `ru` или их коды; по умолчанию — общий язык приложения. |
| `maxHeight` | `number \| string` | `600` | Высота, при которой поле перестаёт расти и начинает прокручиваться. |
| `maxImageSizeMb` | `number` | `10` | Наибольший допустимый размер файла изображения в мегабайтах. |
| `maxLength` | `number` | `0` | Ограничение числа символов; `0` — без ограничений. |
| `minHeight` | `number \| string` | `240` | Наименьшая высота поля с учётом серого пространства вокруг листа. |
| `placeholder` | `string` | `''` | Текст, показываемый, пока поле пусто. |
| `uploadImage` | `DocumentImageUploadHandler` | — | Загружает изображение и возвращает его URL; без него изображения встраиваются как data URL. |
| `variables` | `TemplateVariable[]` | `[]` | Переменные шаблона, которые может вставлять пользователь. |

### v-model и события

| Имя | Тип | Описание |
| --- | --- | --- |
| `v-model` | `string` | Значение поля в виде очищенного HTML; пустое поле — `''`. |
| `focus` | событие | Редактируемая область получила фокус. |
| `blur` | событие | Редактируемая область потеряла фокус. |
| `uploadError` | событие, `error: unknown` | Изображение отклонено или не удалось его загрузить. |

У `Editor` нет `v-model:page`, `v-model:comments`, `v-model:trackChanges`, `author`, `defaultViewMode`, `height`, `title`, `ruler`, `slashCommands` и слота `toolbar`, и он не предоставляет методов. Меню `/` в нём работает со встроенными командами.

## DocumentCompare

Сравнение двух версий документа только для чтения: новая версия, в которой вставленные слова подчёркнуты зелёным, а удалённые зачёркнуты красным, и число изменений над ней. См. [Комментарии и сравнение](/docs/review).

### Props

| Проп | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `before` | `string` | — | HTML более ранней версии. Обязательный. |
| `after` | `string` | — | HTML более поздней версии. Обязательный. |
| `locale` | `EditorLocaleInput` | — | Язык интерфейса; по умолчанию — общий язык приложения. |
| `height` | `number \| string` | `'auto'` | Высота компонента; `'auto'` растёт вместе с документом, при фиксированной высоте содержимое прокручивается. |

У него нет событий и доступных членов.

## DocumentForm

Шаблон, заполняемый как форма: документ показан так, как будет напечатан, и полями ввода являются только его переменные. См. [Шаблоны и подписи](/docs/templates).

### Props

| Проп | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `template` | `string` | — | HTML шаблона в том виде, в каком его сохранил редактор. Обязательный. |
| `variables` | `TemplateVariable[]` | `[]` | Метки, показываемые в пустых полях; переменные встроенных шаблонов документов получают метки и без него. |
| `locale` | `EditorLocaleInput` | — | Язык встроенных меток переменных; по умолчанию — общий язык приложения. |
| `readonly` | `boolean` | `false` | Показывает значения без возможности их изменить. |

### v-model

| Привязка | Тип | По умолчанию | Описание |
| --- | --- | --- | --- |
| `v-model` | `Record<string, string>` | `{}` | Значения по именам переменных. Все поля одной переменной разделяют одно значение. |

### Доступные члены

| Член | Тип | Описание |
| --- | --- | --- |
| `getHTML` | `(options?: FillTemplateOptions) => string` | HTML заполненного документа, полученный с помощью `fillTemplate`. |
| `validate` | `() => string[]` | Имена переменных, оставшихся пустыми. Помечает их поля и переводит фокус на первое; пустой список означает, что форма заполнена. |

## Функции

### createPageSettings

```ts
function createPageSettings(): PageSettings;
```

Возвращает новые параметры страницы по умолчанию: A4, книжная ориентация, поля 25.4 мм с каждой стороны. Каждый вызов возвращает новый объект.

### createHeaderFooter, createWatermark

```ts
function createHeaderFooter(): PageHeaderFooter;
function createWatermark(): PageWatermark;
```

Пустой верхний или нижний колонтитул (`{ left: '', center: '', right: '' }`) и пустой водяной знак цвета по умолчанию: `{ text: '', color: '#9ca3af', diagonal: true }`.

### setEditorLocale

```ts
function setEditorLocale(locale: EditorLocaleInput): void;
```

Задаёт язык интерфейса всех редакторов, у которых нет собственного пропса `locale`. Реактивна: редакторы, уже находящиеся на странице, переключаются сразу. См. [Языки](/docs/translations).

### fillTemplate

```ts
function fillTemplate(html: string, values: TemplateValues, options?: FillTemplateOptions): string;
```

Заменяет переменные шаблона в сохранённом HTML значениями с экранированием HTML. Переменные без значения сохраняются, если `options.missing` не равно `'empty'` или `'name'`. Работает без DOM, поэтому выполняется и на сервере Node. См. [Шаблоны и подписи](/docs/templates).

### getTemplateVariables

```ts
function getTemplateVariables(html: string): string[];
```

Имена переменных шаблона, используемых в сохранённом HTML, — каждое по одному разу, в порядке следования в документе.

### getDocumentTemplate

```ts
function getDocumentTemplate(id: DocumentTemplateId, locale?: EditorLocaleCode): DocumentTemplate;
```

Встроенный шаблон документа с его переменными на указанном языке (по умолчанию — узбекском).

### numberToWords, formatAmountInWords, parseAmount

```ts
function numberToWords(value: number, locale?: NumberWordsLocale): string;
function formatAmountInWords(value: number, locale?: NumberWordsLocale): string;
function parseAmount(text: string): number | null;
```

`numberToWords` записывает целую часть числа прописью, вплоть до триллионов. `formatAmountInWords` добавляет цифры с разделением на группы: `15 000 000 (o‘n besh million)`. `parseAmount` читает введённые суммы, например `15 000 000`, `1 250,50` или `1,250.50`.

### formatShortDate, formatLongDate

```ts
function formatShortDate(date: Date): string;
function formatLongDate(date: Date, locale?: NumberWordsLocale): string;
```

`14.09.2026` и развёрнутая форма, принятая в официальных документах, на указанном языке.

### transliterate

```ts
function transliterate(text: string, direction: TransliterationDirection, previous?: string): string;
```

Переводит узбекский текст с латиницы на кириллицу и обратно; `{заполнители}` и `{{переменные}}` остаются без изменений.

### buildDocx

```ts
function buildDocx(source: DocxSource): Promise<Blob>;
```

Создаёт файл Word (Office Open XML) из HTML документа, заголовка и параметров страницы. Изображения встраиваются из data URL или загружаются по их адресу. Работает в браузере. См. [Файлы Word и большие документы](/docs/word-files).

### readDocx

```ts
function readDocx(data: ArrayBuffer | Uint8Array): Promise<DocxImport>;
```

Читает файл `.docx` в HTML редактора и параметры страницы. Завершается ошибкой, если файл не является документом Word. Работает в браузере.

### compareDocuments

```ts
function compareDocuments(before: string, after: string): DocumentComparison;
```

Сравнивает две версии документа и возвращает HTML новой версии для отображения с пометками `<ins>` и `<del>`, а также число вставленных и удалённых слов. На ней построен `DocumentCompare`. Требует DOM.

### createCommentId

```ts
function createCommentId(): string;
```

Новый случайный идентификатор для комментария или ответа, пригодный для значения HTML-атрибута, например `cmfz3k1a9x2b7q`.

### collaboratorColor

```ts
function collaboratorColor(collaborator: Pick<Collaborator, 'id' | 'color'>): string;
```

**Новое в 0.6.0.** Цвет, которым редактор рисует участника: его собственный `color` или один из восьми цветов, выбранный по `id`, — для одного и того же идентификатора всегда один и тот же. Пригодится для списка участников рядом с редактором.

### readOutline

```ts
function readOutline(root: HTMLElement, depth?: number): OutlineHeading[];
```

Заголовки, записанные непосредственно в `root` (не внутри таблиц, списков или цитат), до уровня `depth` (по умолчанию 6). Пустые заголовки пропускаются.

### buildTableOfContents

```ts
function buildTableOfContents(entries: TableOfContentsEntry[], options: TableOfContentsOptions): string;
```

HTML оглавления: заголовок, затем по одной строке на каждый элемент с номером страницы справа. Элементы верхнего уровня выделяются полужирным, более глубокие уровни — отступом. Результат — таблица без границ `<table data-type="toc">`.

## Константы

### uz, uzCyrl, en, ru

```ts
const uz: EditorLocale;
const uzCyrl: EditorLocale;
const en: EditorLocale;
const ru: EditorLocale;
```

Встроенные языки интерфейса: узбекский на латинице (по умолчанию) и кириллице, английский и русский.

### editorLocales

```ts
const editorLocales: ReadonlyArray<EditorLocale>;
```

Все встроенные локали — для списков выбора языка.

## Типы

### PageSettings

```ts
interface PageSettings {
  /** Формат бумаги. */
  size: PageSizeKey;
  /** Ориентация бумаги. */
  orientation: PageOrientation;
  /** Поля в миллиметрах. */
  margins: PageMargins;
  /** Текст, повторяемый в верхнем поле каждой страницы; отсутствует, пока в документе нет верхнего колонтитула. */
  header?: PageHeaderFooter;
  /** Текст, повторяемый в нижнем поле каждой страницы; отсутствует, пока в документе нет нижнего колонтитула. */
  footer?: PageHeaderFooter;
  /** Водяной знак, рисуемый за текстом каждой страницы; отсутствует, пока в документе его нет. */
  watermark?: PageWatermark;
  /** Скрываются ли на первой странице колонтитулы и номер страницы. */
  differentFirstPage?: boolean;
  /** Номер, печатаемый на первой странице; следующие страницы нумеруются от него. По умолчанию 1. */
  firstPageNumber?: number;
}
```

### PageMargins

```ts
/** Поля страницы в миллиметрах. */
interface PageMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
```

### PageHeaderFooter

```ts
/** Текст, повторяемый в верхнем или нижнем поле каждой страницы, из трёх выровненных частей. */
interface PageHeaderFooter {
  left: string;
  center: string;
  right: string;
}
```

Тексты могут содержать токены `{page}`, `{pages}`, `{date}` и `{title}`; см. [Использование](/docs/usage).

### PageWatermark

```ts
interface PageWatermark {
  /** Текст водяного знака, например ЧЕРНОВИК или КОПИЯ. */
  text: string;
  /** Цвет текста; он рисуется бледно. */
  color: string;
  /** Идёт ли текст по диагонали страницы. */
  diagonal: boolean;
}
```

### PageOrientation

```ts
type PageOrientation = 'portrait' | 'landscape';
```

### PageSizeKey

```ts
type PageSizeKey = 'a3' | 'a4' | 'a5' | 'letter' | 'legal';
```

### DocumentViewMode

```ts
/** `page` показывает листы, как в текстовом процессоре, `web` — сплошную поверхность. */
type DocumentViewMode = 'page' | 'web';
```

### DocumentImageUploadHandler

```ts
/** Загружает изображение и возвращает его публичный URL. */
type DocumentImageUploadHandler = (file: File) => Promise<string>;
```

### DocumentComment

```ts
interface DocumentComment {
  /** Уникальный идентификатор; якорь в HTML — `<span data-comment="id">`. */
  id: string;
  /** Текст комментария. */
  text: string;
  /** Имя написавшего, если у редактора задан `author`. */
  author?: string;
  /** Когда комментарий написан, строка ISO 8601. */
  createdAt: string;
  /** Закрыто ли обсуждение; у решённых комментариев якорь сохраняется, но не подсвечивается. */
  resolved?: boolean;
  /** Ответы в порядке написания. */
  replies?: DocumentCommentReply[];
}
```

### DocumentCommentReply

```ts
interface DocumentCommentReply {
  id: string;
  text: string;
  author?: string;
  /** Строка ISO 8601. */
  createdAt: string;
}
```

### TrackedChange

```ts
/** Отслеживаемая вставка или удаление; части одной правки объединяются. */
interface TrackedChange {
  /** Общий идентификатор частей правки; `data-change` в HTML. */
  id: string;
  /** Был ли текст вставлен или удалён. */
  type: 'insert' | 'delete';
  /** Имя автора; может быть пустым. */
  author: string;
  /** Когда внесено изменение, строка ISO 8601. */
  time: string;
  /** Вставленный или удалённый текст. */
  text: string;
}
```

### DocumentComparison

```ts
interface DocumentComparison {
  /** HTML новой версии для отображения с отмеченными вставками и удалениями. */
  html: string;
  /** Число вставленных слов, включая слова во вставленных блоках. */
  insertions: number;
  /** Число удалённых слов, включая слова в удалённых блоках. */
  deletions: number;
}
```

### DocxSource

```ts
interface DocxSource {
  /** Чистый HTML документа в том виде, в каком его сохранил редактор. */
  html: string;
  /** Заголовок документа; записывается в свойства файла и используется токеном `{title}`. */
  title: string;
  /** Размер страницы, ориентация, поля, колонтитулы, водяной знак и нумерация страниц. */
  page: PageSettings;
}
```

### DocxImport

```ts
interface DocxImport {
  /** Содержимое документа в виде HTML. */
  html: string;
  /** Параметры страницы первого раздела документа; следующие разделы приходят как разрывы разделов. */
  page: PageSettings;
}
```

### OutlineHeading

```ts
interface OutlineHeading {
  /** Уровень заголовка, от 1 до 6. */
  level: number;
  /** Текст заголовка со схлопнутыми пробелами. */
  text: string;
  /** Элемент заголовка. */
  element: HTMLElement;
}
```

### TableOfContentsEntry

```ts
interface TableOfContentsEntry {
  /** Уровень заголовка, от 1 до 6; более глубокие уровни выводятся с отступом. */
  level: number;
  /** Текст заголовка. */
  text: string;
  /** Страница, на которой начинается заголовок, или `null`, если документ не разбит на страницы. */
  page: number | null;
}
```

### TableOfContentsOptions

```ts
interface TableOfContentsOptions {
  /** Заголовок над элементами. */
  title: string;
  /** Текст, показываемый вместо элементов, когда заголовков нет. */
  emptyText: string;
  /** Ширина текстовой колонки в пикселях; таблица занимает её плюс колонку номеров страниц. */
  width?: number;
}
```

### SlashCommand

```ts
interface SlashCommand {
  /** Уникальный идентификатор; по нему тоже ищет введённый фильтр. */
  id: string;
  /** Название, показываемое в меню. */
  label: string;
  /** Иконка из набора иконок редактора; если не задана — `plus`. */
  icon?: IconName;
  /** Дополнительные слова, по которым фильтр находит команду, например на других языках. */
  keywords?: readonly string[];
  /** Выполняет команду; введённый `/фильтр` к этому моменту уже удалён. */
  run: (engine: DocumentEngine) => void;
}
```

### Collaborator, SelectionOffsets

**Новое в 0.6.0.** См. [Совместное редактирование](/docs/collaboration).

```ts
/** Выделение как позиции символов по всему документу; равные позиции означают курсор. */
interface SelectionOffsets {
  /** Где началось выделение. */
  anchor: number;
  /** Где находится курсор. */
  focus: number;
}

/** Другой человек, редактирующий тот же документ. */
interface Collaborator {
  /** Постоянный идентификатор человека или подключения. */
  id: string;
  /** Имя, показываемое рядом с курсором. */
  name: string;
  /** CSS-цвет курсора и выделения; если не задан, выбирается по идентификатору. */
  color?: string;
  /** Где находится курсор или выделение человека, или `null`, пока его нет в документе. */
  selection: SelectionOffsets | null;
}
```

### IconName

Объединение имён встроенных иконок редактора, например `'braces'`, `'calendar-days'`, `'file-text'`, `'signature'` или `'table-of-contents'`. Полный список показывают подсказки типов в вашем редакторе кода.

### DocumentEngine

Движок редактирования, на котором построен `DocumentEditor`; экспортируется только как тип. Экземпляр можно получить из члена `engine` ref шаблона, из слота `toolbar` и в `SlashCommand.run`. Часто используемые методы:

| Метод | Описание |
| --- | --- |
| `insertText(text: string)` | Вставляет обычный текст в место выделения. |
| `insertContent(html: string, options?: { asBlocks?: boolean })` | Вставляет очищенный HTML за один шаг отмены; с `asBlocks` вставка начинается с новой строки. |
| `insertVariable(name: string)` | Вставляет переменную шаблона. |
| `getSelectedText()` | Обычный текст выделения. |
| `toggleMark(mark)` | Включает или выключает `'bold'`, `'italic'`, `'underline'`, `'strike'`, `'code'`, `'subscript'` или `'superscript'`. |
| `setBlockType(tag)` | Превращает текущий блок в `'P'` или `'H1'` … `'H6'`. |
| `toggleList(kind)` | Включает или выключает `'bulletList'`, `'orderedList'` или `'taskList'`. |
| `setListNumbering(style)` | Переключает нумерованный список под курсором между нумерацией `'default'` и `'legal'`. |
| `insertTable(rows, cols, withHeaderRow)` | Вставляет таблицу. |
| `insertPageBreak()`, `insertHorizontalRule()` | Вставляют разрыв страницы или горизонтальную линию. |
| `insertSectionBreak(orientation: 'portrait' \| 'landscape')` | **Новое в 0.6.0.** Вставляет разрыв раздела; страницы после него поворачиваются в ориентацию `orientation`. См. [Файлы Word и большие документы](/docs/word-files#страницы-разной-ориентации). |
| `insertFootnote(text: string)` | Вставляет в место выделения ссылку на сноску вместе с её текстом; возвращает элемент ссылки или `null`, если ничего вставить не удалось. |
| `setFootnoteText(element, text: string)` | Изменяет текст сноски (до 2000 символов). |
| `removeFootnote(element)` | Удаляет ссылку на сноску вместе с её текстом. |
| `getFootnotes()` | Ссылки на сноски с их текстами, `{ element, text }[]`, в порядке следования в документе. |
| `setTrackChanges(enabled: boolean, author?: string)` | Начинает или прекращает запись правок как отслеживаемых изменений. `DocumentEditor` вызывает его сам на основе `v-model:trackChanges` и `author`, поэтому там используйте привязку. |
| `tracksChanges` | Отслеживаются ли правки (свойство только для чтения). |
| `getChanges()` | Отслеживаемые изменения в порядке следования в документе, `TrackedChange[]`. |
| `resolveChanges(accept: boolean, id?: string)` | Принимает (`true`) или отклоняет изменение с указанным идентификатором, а без него — все изменения. |
| `selectChange(id: string)` | Выделяет текст отслеживаемого изменения и прокручивает к нему. |
| `undo()`, `redo()` | Отмена и повтор. |
| `focus(position?: 'start' \| 'end')` | Переводит фокус в документ. |
| `getHTML()` | Чистый HTML документа. |
| `setContent(html: string, options?: { keepSelection?: boolean })` | Заменяет документ и очищает историю отмены. **Новое в 0.6.0:** с `keepSelection` курсор остаётся на той же позиции символа, пока редактор в фокусе; этим пользуется `v-model`. |
| `getSelectionOffsets()` | **Новое в 0.6.0.** Выделение в виде `SelectionOffsets` или `null`. |
| `getOffsetRects(offsets: SelectionOffsets)` | **Новое в 0.6.0.** Прямоугольники во вьюпорте (`DOMRect[]`) текста между двумя позициями; для курсора — один прямоугольник нулевой ширины. |

Каждая команда — это один шаг отмены, и она обновляет `v-model` так же, как ввод текста.

### EditorUiState

Плоский снимок форматирования в месте выделения — в том виде, в каком его показывает панель инструментов. Среди его полей: `bold`, `italic`, `underline`, `headingLevel`, `fontFamily`, `fontSize`, `align`, `bulletList`, `orderedList`, `legalNumbering`, `link`, `canUndo`, `canRedo`, `tableOfContents` (в документе есть оглавление), `textSelected` (выделен непустой текст) и `comment` (идентификатор комментария под курсором или `''`).

### TemplateVariable

```ts
interface TemplateVariable {
  /** Имя, используемое в сохранённом HTML и в `{{name}}`: буквы, цифры, `_`, `.` и `-`. */
  name: string;
  /** Текст, который показывает чип в редакторе и список в меню переменных. */
  label: string;
}
```

### TemplateValues

```ts
type TemplateValues = Readonly<Record<string, string | number | null | undefined>>;
```

### FillTemplateOptions

```ts
interface FillTemplateOptions {
  /** Переменная без значения: сохраняется (по умолчанию), удаляется или записывается текстом `{{name}}`. */
  missing?: 'keep' | 'empty' | 'name';
}
```

### DocumentTemplate, DocumentTemplateId

```ts
type DocumentTemplateId = 'letter' | 'order' | 'application' | 'certificate' | 'act';

interface DocumentTemplate {
  id: DocumentTemplateId;
  /** HTML документа с переменными шаблона. */
  html: string;
  /** Переменные, используемые шаблоном, с метками на запрошенном языке. */
  variables: TemplateVariable[];
}
```

### NumberWordsLocale, TransliterationDirection

```ts
type NumberWordsLocale = 'uz' | 'uz-Cyrl' | 'ru' | 'en';
type TransliterationDirection = 'toCyrillic' | 'toLatin';
```

### EditorLocale

```ts
interface EditorLocale {
  /** Код языка. */
  readonly code: EditorLocaleCode;
  /** Название языка на нём самом, для списков выбора языка. */
  readonly name: string;
}
```

### EditorLocaleCode

```ts
type EditorLocaleCode = 'uz' | 'uz-Cyrl' | 'en' | 'ru';
```

### EditorLocaleInput

```ts
/** Объект локали или только его код. */
type EditorLocaleInput = EditorLocale | EditorLocaleCode;
```
