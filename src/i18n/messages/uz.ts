import type { SiteMessages } from './en';

/** Uzbek interface texts of the site. */
export const uz: SiteMessages = {
  meta: {
    title: 'nuvra — Vue 3 uchun Word uslubidagi hujjat muharriri',
    docsTitle: 'nuvra hujjatlari'
  },
  nav: {
    main: 'Asosiy menyu',
    docs: 'Hujjatlar',
    demo: 'Demo',
    language: 'Til',
    theme: 'Rang sxemasini almashtirish',
    github: 'nuvra GitHub’da',
    menu: 'Hujjatlar menyusi'
  },
  hero: {
    badge: 'Vue 3 · UI kutubxonalarsiz',
    titleLead: 'Haqiqiy hujjatlar —',
    titleAccent: 'to‘g‘ridan-to‘g‘ri Vue ichida.',
    lead: 'nuvra — Vue 3 uchun Word uslubidagi muharrir: haqiqiy hoshiyali sahifalar, jadvallar, rasmlar, qidirish va almashtirish, chop etish hamda Word’ga eksport — barchasi bitta komponentda, yagona bog‘liqligi esa Vue.',
    start: 'Boshlash',
    demo: 'Jonli sinab ko‘rish',
    managers: 'Paket menejeri',
    copy: 'Buyruqni nusxalash',
    copied: 'Nusxalandi'
  },
  demo: {
    eyebrow: 'Jonli demo',
    title: 'Marhamat, shu yerda yozib ko‘ring.',
    lead: 'Bu npm’dagi haqiqiy paket. Sayt tilini almashtirsangiz, muharrir yozuvlari ham o‘zgaradi; tungi rejimga o‘tsangiz, muharrir ham o‘tadi.',
    tabs: 'Demo turi',
    documentTab: 'Hujjat',
    fieldTab: 'Forma maydoni',
    accent: 'Rang',
    fileName: 'Xizmat ko‘rsatish shartnomasi',
    fieldTitle: 'Yangi rol',
    nameLabel: 'Rol nomi',
    nameValue: 'Kontent muharriri',
    descriptionLabel: 'Tavsif',
    descriptionPlaceholder: 'Bu rol qanday vazifalarni bajaradi?',
    fieldHint: 'Veb ko‘rinishdagi o‘sha dvigatel: matn ko‘paygan sari kengayadi va istalgan formaga joylashadi.',
    sample: [
      '<h1>Xizmat ko‘rsatish shartnomasi</h1>',
      '<p><strong>№ 24/09</strong> · Toshkent sh. · 2026-yil 11-sentabr</p>',
      '<p>Ushbu shartnoma <strong>“Nuvra Studio” MChJ</strong> (keyingi o‘rinlarda “Ijrochi”) va <em>Buyurtmachi</em> (birgalikda “Tomonlar”) o‘rtasida tuzildi.</p>',
      '<h2>1. Ish hajmi</h2>',
      '<p>Ijrochi Buyurtmachi uchun hujjat aylanishi tizimini loyihalaydi va topshiradi:</p>',
      '<ul><li><p>shartnoma va xatlar uchun shablonlar kutubxonasi;</p></li><li><p>rollar bo‘yicha ko‘rib chiqish va tasdiqlash;</p></li><li><p>Word va PDF formatlariga eksport.</p></li></ul>',
      '<h2>2. Muddatlar va to‘lov</h2>',
      '<table><tbody>',
      '<tr><th><p>Bosqich</p></th><th><p>Muddat</p></th><th><p>Summa</p></th></tr>',
      '<tr><td><p>Dizayn</p></td><td><p>1-oktabr</p></td><td><p>28 000 000 so‘m</p></td></tr>',
      '<tr><td><p>Ishlab chiqish</p></td><td><p>15-noyabr</p></td><td><p>79 000 000 so‘m</p></td></tr>',
      '<tr><td><p>Ishga tushirish</p></td><td><p>1-dekabr</p></td><td><p>15 000 000 so‘m</p></td></tr>',
      '</tbody></table>',
      '<blockquote><p>Maslahat: jadval katagini bossangiz, jadval paneli ochiladi; qidirish uchun Ctrl+F tugmalarini bosing.</p></blockquote>',
      '<p>Tomonlar nomidan imzolandi.</p>'
    ].join('')
  },
  features: {
    eyebrow: 'Imkoniyatlar',
    title: 'Hujjat uchun kerak bo‘lgan hamma narsa.',
    lead: 'Plaginlar yig‘ish ham, sozlash ham shart emas — o‘rnatasiz va ishlaydi.',
    items: [
      {
        title: 'Haqiqiy sahifalar',
        text: 'A4, Letter, Legal va boshqalar, kitob yoki albom holatida, hoshiyalar millimetrda. Yozgan sari matn keyingi sahifaga o‘tadi.'
      },
      {
        title: 'Qulay jadvallar',
        text: 'O‘lcham to‘ridan qo‘shing, kataklarni birlashtiring va ajrating, ustunlar kengligini o‘zgartiring, qator va ustunlarni suzuvchi paneldan qo‘shing.'
      },
      {
        title: 'Rasmlar — o‘zingiz xohlagandek',
        text: 'Joylang, sudrab tashlang yoki yuklang. O‘z yuklash funksiyangizni ulang, rasmni joyida kattalashtiring, tekislang va tavsif yozing.'
      },
      {
        title: 'Qidirish va almashtirish',
        text: 'Katta-kichik harf va butun so‘z bo‘yicha qidiruv CSS Custom Highlight API bilan belgilanadi; almashtirishni bekor qilish mumkin.'
      },
      {
        title: 'Chop etish va eksport',
        text: 'Sahifa sozlamalari bilan chop eting yoki PDF saqlang, hujjatni HTML yoki Word (.doc) fayli sifatida yuklab oling.'
      },
      {
        title: 'Sizning tilingizda',
        text: 'Har bir yozuv bitta tarjima funksiyasidan o‘tadi. O‘zbek tili ichida bor; vue-i18n yoki istalgan lug‘atni ulang.'
      },
      {
        title: 'Dizaynga to‘liq moslanadi',
        text: 'Oddiy CSS o‘zgaruvchilari va tungi palitra. UI framework uslublari na kiradi, na chiqadi.'
      },
      {
        title: 'Pat kabi yengil',
        text: 'Yagona bog‘liqlik — Vue: taxminan 48 kB siqilgan JavaScript, native popoverlar va ichki SVG ikonkalar.'
      }
    ]
  },
  quickStart: {
    eyebrow: 'Tez boshlash',
    title: 'Birinchi hujjatgacha uch qadam.',
    lead: 'nuvra mavjud Vue 3 loyihasiga bir daqiqada qo‘shiladi.',
    steps: [
      { title: 'O‘rnating', text: 'Paketni o‘z paket menejeringiz bilan qo‘shing.' },
      { title: 'Uslublarni ulang', text: 'Kirish faylida bir marta import qiling.' },
      { title: 'Muharrirni chiqaring', text: 'HTML’ni v-model bilan bog‘lang — bo‘ldi.' }
    ],
    cta: 'Qo‘llanmani o‘qish'
  },
  stats: [
    { value: '1', label: 'bog‘liqlik — Vue' },
    { value: '48 kB', label: 'siqilgan JavaScript' },
    { value: '124', label: 'tarjima qilinadigan yozuv' },
    { value: 'MIT', label: 'litsenziya, doim bepul' }
  ],
  footer: {
    tagline: 'Vue 3 uchun Word uslubidagi hujjat muharriri.',
    license: 'MIT litsenziyasi ostida tarqatiladi.',
    docs: 'Hujjatlar'
  },
  docs: {
    onThisPage: 'Ushbu sahifada',
    previous: 'Oldingi',
    next: 'Keyingi',
    menu: 'Menyu',
    copy: 'Nusxalash',
    copied: 'Nusxalandi',
    missingTitle: 'Bunday sahifa yo‘q',
    missingText: 'Menyudan mavzuni tanlang.'
  },
  notFound: {
    title: 'Sahifa topilmadi',
    text: 'Siz qidirgan sahifa ko‘chirilgan yoki umuman bo‘lmagan.',
    home: 'Bosh sahifaga qaytish'
  }
};
