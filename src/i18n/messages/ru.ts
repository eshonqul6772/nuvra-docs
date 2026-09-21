import type { SiteMessages } from './en';

/** Russian interface texts of the site. */
export const ru: SiteMessages = {
  meta: {
    title: 'nuvra — редактор документов в стиле Word для Vue 3',
    docsTitle: 'Документация nuvra',
    playgroundTitle: 'Песочница · nuvra',
    examplesTitle: 'Примеры · nuvra'
  },
  nav: {
    main: 'Главное меню',
    docs: 'Документация',
    examples: 'Примеры',
    playground: 'Песочница',
    demo: 'Демо',
    search: 'Поиск',
    language: 'Язык',
    theme: 'Сменить цветовую схему',
    github: 'nuvra на GitHub',
    menu: 'Меню документации'
  },
  search: {
    title: 'Поиск по документации',
    placeholder: 'Статьи, пропсы, события…',
    results: 'Результаты поиска',
    hint: 'Ищите по руководству, рецептам и справочнику API.',
    loading: 'Загружаем статьи…',
    empty: (query: string) => `По запросу «${query}» ничего не найдено.`,
    count: (count: number) => {
      const lastTwo = count % 100;
      const last = count % 10;
      if (last === 1 && lastTwo !== 11) return `${count} результат`;
      if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${count} результата`;
      return `${count} результатов`;
    },
    navigate: 'выбор',
    select: 'открыть',
    close: 'Закрыть'
  },
  hero: {
    badge: 'Vue 3 · без UI-библиотек',
    titleLead: 'Настоящие документы —',
    titleAccent: 'прямо внутри Vue.',
    lead: 'nuvra — редактор в стиле Word для Vue 3: страницы с настоящими полями, таблицы, изображения, поиск и замена, печать и экспорт в Word — всё в одном компоненте, а единственная зависимость — Vue.',
    start: 'Начать',
    demo: 'Попробовать вживую',
    managers: 'Менеджер пакетов',
    copy: 'Скопировать команду',
    copied: 'Скопировано'
  },
  demo: {
    eyebrow: 'Живое демо',
    title: 'Смелее, напишите что-нибудь.',
    lead: 'Это настоящий пакет из npm. Переключите язык сайта — и подписи редактора сменятся вместе с ним; включите тёмную тему — редактор тоже станет тёмным.',
    tabs: 'Вид демо',
    documentTab: 'Документ',
    fieldTab: 'Поле формы',
    accent: 'Цвет',
    editorLanguage: 'Язык редактора',
    variables: [
      { name: 'contract_number', label: 'Номер договора' },
      { name: 'contract_date', label: 'Дата договора' },
      { name: 'client_name', label: 'Заказчик' },
      { name: 'client_director', label: 'Руководитель заказчика' },
      { name: 'total_amount', label: 'Общая сумма' }
    ],
    author: 'Гость',
    comment: {
      author: 'Дилноза Рахимова',
      text: 'Может, документы должен согласовывать и юридический отдел? Выделите любой текст и нажмите «Добавить примечание», чтобы оставить свой комментарий.'
    },
    fileName: 'Договор оказания услуг',
    samples: {
      label: 'Образцы документов',
      contract: 'Договор оказания услуг',
      letter: 'Официальное письмо',
      order: 'Приказ',
      application: 'Заявление',
      certificate: 'Справка с места работы'
    },
    fieldTitle: 'Новая роль',
    nameLabel: 'Название роли',
    nameValue: 'Редактор контента',
    descriptionLabel: 'Описание',
    descriptionPlaceholder: 'Чем занимается эта роль?',
    fieldHint: 'Тот же движок в веб-режиме: поле растёт вместе с текстом и встраивается в любую форму.',
    sample: [
      '<h1>Договор оказания услуг</h1>',
      '<p><strong>№ <span data-variable="contract_number">{{contract_number}}</span></strong> · г. Ташкент · <span data-variable="contract_date">{{contract_date}}</span></p>',
      '<p>Настоящий договор заключён между <strong>ООО «Nuvra Studio»</strong> (далее — «Исполнитель») и <strong><span data-variable="client_name">{{client_name}}</span></strong> (далее — «Заказчик»), совместно именуемыми «Стороны».</p>',
      '<h2>1. Предмет договора</h2>',
      '<p>Исполнитель проектирует и внедряет для Заказчика систему документооборота:</p>',
      '<ul><li><p>библиотеку шаблонов договоров и писем;</p></li><li><p><span data-comment="demo-comment">согласование и утверждение по ролям</span>;</p></li><li><p>экспорт в форматы Word и PDF.</p></li></ul>',
      '<h2>2. Сроки и оплата</h2>',
      '<table><tbody>',
      '<tr><th><p>Этап</p></th><th><p>Срок</p></th><th><p>Сумма</p></th></tr>',
      '<tr><td><p>Дизайн</p></td><td><p>1 октября</p></td><td><p>28 000 000 сум</p></td></tr>',
      '<tr><td><p>Разработка</p></td><td><p>15 ноября</p></td><td><p>79 000 000 сум</p></td></tr>',
      '<tr><td><p>Запуск</p></td><td><p>1 декабря</p></td><td><p>15 000 000 сум</p></td></tr>',
      '</tbody></table>',
      '<blockquote><p>Совет: переменные вставляются кнопкой { } или вводом {{total_amount}}, а блоки подписей — кнопкой с ручкой.</p></blockquote>',
      '<p>Подписано от имени Сторон.</p>',
      '<table data-type="signature"><tbody><tr>',
      '<td><p><strong>ЗАКАЗЧИК:</strong></p><p><span data-variable="client_name">{{client_name}}</span></p><p>Директор</p><p>________________ <span data-variable="client_director">{{client_director}}</span></p><p>М.П.</p></td>',
      '<td><p><strong>ИСПОЛНИТЕЛЬ:</strong></p><p>ООО «Nuvra Studio»</p><p>Директор</p><p>________________ А. Каримов</p><p>М.П.</p></td>',
      '</tr></tbody></table>'
    ].join('')
  },
  features: {
    eyebrow: 'Возможности',
    title: 'Всё, что нужно документу.',
    lead: 'Не нужно собирать плагины и писать конфигурацию — установите, и всё работает.',
    items: [
      {
        title: 'Настоящие страницы',
        text: 'A4, Letter, Legal и другие форматы, книжная или альбомная ориентация, поля в миллиметрах. Текст сам перетекает на следующую страницу.'
      },
      {
        title: 'Удобные таблицы',
        text: 'Вставка из сетки размеров, объединение и разделение ячеек, изменение ширины столбцов, строки и столбцы — с плавающей панели.'
      },
      {
        title: 'Изображения по-вашему',
        text: 'Вставляйте, перетаскивайте или загружайте. Подключите свой обработчик загрузки, а затем меняйте размер, выравнивание и описание прямо на месте.'
      },
      {
        title: 'Поиск и замена',
        text: 'Поиск с учётом регистра и по целым словам подсвечивается через CSS Custom Highlight API, а замену можно отменить.'
      },
      {
        title: 'Печать и экспорт',
        text: 'Печать и сохранение в PDF с вашими параметрами страницы, скачивание в HTML или файл Word (.docx), открытие файлов .docx.'
      },
      {
        title: 'Говорит на вашем языке',
        text: 'Интерфейс доступен на узбекском, английском и русском. Язык задаётся для каждого редактора или сразу для всего приложения.'
      },
      {
        title: 'Оформление до пикселя',
        text: 'Обычные CSS-переменные и тёмная палитра. Стили UI-фреймворков не проникают внутрь и не вытекают наружу.'
      },
      {
        title: 'Лёгкий как перо',
        text: 'Единственная зависимость — Vue: около 48 кБ JavaScript в gzip, нативные поповеры и встроенные SVG-иконки.'
      }
    ]
  },
  quickStart: {
    eyebrow: 'Быстрый старт',
    title: 'Три шага до первого документа.',
    lead: 'nuvra подключается к существующему проекту на Vue 3 за минуту.',
    steps: [
      { title: 'Установите', text: 'Добавьте пакет через ваш менеджер пакетов.' },
      { title: 'Подключите стили', text: 'Один раз, во входном файле.' },
      { title: 'Выведите редактор', text: 'Свяжите HTML через v-model — и всё.' }
    ],
    cta: 'Читать руководство'
  },
  stats: [
    { value: '1', label: 'зависимость — Vue' },
    { value: '48 кБ', label: 'JavaScript в gzip' },
    { value: '229', label: 'переводимых подписей' },
    { value: 'MIT', label: 'лицензия, бесплатно навсегда' }
  ],
  footer: {
    tagline: 'Редактор документов в стиле Word для Vue 3.',
    license: 'Распространяется по лицензии MIT.',
    docs: 'Документация'
  },
  docs: {
    onThisPage: 'На этой странице',
    previous: 'Назад',
    next: 'Далее',
    menu: 'Меню',
    copy: 'Копировать',
    copyCode: 'Скопировать код',
    copied: 'Скопировано',
    missingTitle: 'Такой страницы нет',
    missingText: 'Выберите тему в меню.'
  },
  examples: {
    getStarted: 'Начало',
    overview: 'Обзор',
    breadcrumb: 'Навигационная цепочка',
    filter: 'Фильтр примеров',
    reset: 'Сбросить',
    pager: 'Другие примеры',
    previous: 'Предыдущий',
    next: 'Следующий',
    lines: (count: number) => `строк: ${count}`,
    eyebrow: 'Примеры',
    title: 'Посмотрите в работе, затем возьмите код.',
    lead: (count: number) =>
      `${count} живых примеров nuvra во Vue-приложении. Каждый работает прямо на странице, а код под ним — ровно тот, что выполняется.`,
    all: 'Все',
    menu: 'Примеры',
    demo: 'Живая демонстрация',
    guide: 'Читать руководство',
    loading: 'Загрузка примера…',
    missingTitle: 'Такого примера нет',
    missingText: 'Возможно, он был переименован.'
  },
  playground: {
    eyebrow: 'Песочница',
    title: 'Попробуйте свойства и скопируйте код.',
    lead: 'Каждое изменение на панели сразу применяется к редактору, вкладки ниже показывают, что он отдаёт, а ссылка в адресной строке всегда открывает именно эту настройку.',
    editor: 'Редактор',
    controls: 'Свойства',
    groupLayout: 'Размеры',
    groupBehaviour: 'Поведение',
    groupText: 'Тексты',
    groupToolbar: 'Панель инструментов',
    groupData: 'Данные и обработчики',
    bindings: 'Привязки',
    viewMode: 'Начальный вид',
    viewPage: 'Страница',
    viewWeb: 'Веб',
    height: 'Высота в пикселях',
    heightAuto: 'Расти вместе с текстом',
    minHeight: 'Наименьшая авто-высота',
    maxHeight: 'Наибольшая авто-высота',
    canvasPadding: 'Отступ вокруг листа',
    locale: 'Язык интерфейса',
    disabled: 'Только для чтения',
    autofocus: 'Фокус на документ при монтировании',
    ruler: 'Линейка над листом',
    maxLength: 'Лимит символов, 0 — без лимита',
    maxImageSizeMb: 'Наибольшее изображение, МБ',
    placeholder: 'Текст пустого документа',
    placeholderValue: 'Начните писать документ…',
    printTitle: 'Заголовок печати и имя файла',
    author: 'Автор комментариев и правок',
    toolbarLayout: 'Расположение панели',
    toolbarRow: 'Одна строка',
    toolbarTabs: 'Вкладки',
    tools: 'Выбрать инструменты',
    toolsHint: 'Выключено: свойство не передаётся, видны все инструменты.',
    toolsAll: 'Все',
    toolsNone: 'Ни одного',
    variables: 'Передать примеры переменных',
    slashCommands: 'Добавить команду в меню /',
    slashCommandLabel: 'Сегодняшняя дата',
    collaborators: 'Показать соавтора',
    collaboratorName: 'Азиза',
    uploadImage: 'Имитировать медленную загрузку',
    comments: 'Привязать v-model:comments',
    commentsHint: 'Включает инструменты комментариев.',
    trackChanges: 'Привязать v-model:trackChanges',
    trackChangesOn: 'Записывать правки',
    bindPage: 'Привязать v-model:page',
    pageSize: 'Формат бумаги',
    orientation: 'Ориентация',
    portrait: 'Книжная',
    landscape: 'Альбомная',
    content: 'Документ',
    loadSample: 'Загрузить пример',
    clear: 'Очистить',
    reset: 'Сбросить всё',
    copyLink: 'Копировать ссылку',
    linkCopied: 'Ссылка скопирована',
    output: 'Результат',
    code: 'Код',
    html: 'HTML',
    events: 'События',
    eventsEmpty: 'Поставьте фокус в редактор, переместите курсор или вставьте изображение, чтобы увидеть события.',
    clearEvents: 'Очистить',
    notBound: (binding: string) => `Включите ${binding}, чтобы увидеть значение.`,
    characters: (count: number) => `${count.toLocaleString('ru')} символов`
  },
  notFound: {
    title: 'Страница не найдена',
    text: 'Страница, которую вы ищете, перемещена или никогда не существовала.',
    home: 'На главную'
  }
};
