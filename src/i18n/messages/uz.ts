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
    editorLanguage: 'Muharrir tili',
    variables: [
      { name: 'contract_number', label: 'Shartnoma raqami' },
      { name: 'contract_date', label: 'Shartnoma sanasi' },
      { name: 'client_name', label: 'Buyurtmachi' },
      { name: 'client_director', label: 'Buyurtmachi rahbari' },
      { name: 'total_amount', label: 'Umumiy summa' }
    ],
    author: 'Mehmon',
    comment: {
      author: 'Dilnoza Rahimova',
      text: 'Hujjatlarni yuridik bo‘lim ham tasdiqlashi kerakmi? Istalgan matnni belgilab, “Izoh qo‘shish” tugmasi bilan o‘z fikringizni yozing.'
    },
    fileName: 'Xizmat ko‘rsatish shartnomasi',
    fieldTitle: 'Yangi rol',
    nameLabel: 'Rol nomi',
    nameValue: 'Kontent muharriri',
    descriptionLabel: 'Tavsif',
    descriptionPlaceholder: 'Bu rol qanday vazifalarni bajaradi?',
    fieldHint: 'Veb ko‘rinishdagi o‘sha dvigatel: matn ko‘paygan sari kengayadi va istalgan formaga joylashadi.',
    sample: [
      '<h1>Xizmat ko‘rsatish shartnomasi</h1>',
      '<p><strong>№ <span data-variable="contract_number">{{contract_number}}</span></strong> · Toshkent sh. · <span data-variable="contract_date">{{contract_date}}</span></p>',
      '<p>Ushbu shartnoma <strong>“Nuvra Studio” MChJ</strong> (keyingi o‘rinlarda “Ijrochi”) va <strong><span data-variable="client_name">{{client_name}}</span></strong> (keyingi o‘rinlarda “Buyurtmachi”, birgalikda “Tomonlar”) o‘rtasida tuzildi.</p>',
      '<h2>1. Ish hajmi</h2>',
      '<p>Ijrochi Buyurtmachi uchun hujjat aylanishi tizimini loyihalaydi va topshiradi:</p>',
      '<ul><li><p>shartnoma va xatlar uchun shablonlar kutubxonasi;</p></li><li><p><span data-comment="demo-comment">rollar bo‘yicha ko‘rib chiqish va tasdiqlash</span>;</p></li><li><p>Word va PDF formatlariga eksport.</p></li></ul>',
      '<h2>2. Muddatlar va to‘lov</h2>',
      '<table><tbody>',
      '<tr><th><p>Bosqich</p></th><th><p>Muddat</p></th><th><p>Summa</p></th></tr>',
      '<tr><td><p>Dizayn</p></td><td><p>1-oktabr</p></td><td><p>28 000 000 so‘m</p></td></tr>',
      '<tr><td><p>Ishlab chiqish</p></td><td><p>15-noyabr</p></td><td><p>79 000 000 so‘m</p></td></tr>',
      '<tr><td><p>Ishga tushirish</p></td><td><p>1-dekabr</p></td><td><p>15 000 000 so‘m</p></td></tr>',
      '</tbody></table>',
      '<blockquote><p>Maslahat: o‘zgaruvchini { } tugmasi bilan yoki {{total_amount}} deb yozib, imzo blokini esa ruchka tugmasi bilan qo‘shing.</p></blockquote>',
      '<p>Tomonlar nomidan imzolandi.</p>',
      '<table data-type="signature"><tbody><tr>',
      '<td><p><strong>BUYURTMACHI:</strong></p><p><span data-variable="client_name">{{client_name}}</span></p><p>Direktor</p><p>________________ <span data-variable="client_director">{{client_director}}</span></p><p>M.O‘.</p></td>',
      '<td><p><strong>IJROCHI:</strong></p><p>“Nuvra Studio” MChJ</p><p>Direktor</p><p>________________ A. Karimov</p><p>M.O‘.</p></td>',
      '</tr></tbody></table>'
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
        text: 'Sahifa sozlamalari bilan chop eting yoki PDF saqlang, hujjatni HTML yoki Word (.docx) fayli sifatida yuklab oling yoki .docx faylni oching.'
      },
      {
        title: 'Sizning tilingizda',
        text: 'Interfeys o‘zbek (lotin va kirill), ingliz va rus tillarida keladi. Tilni har bir muharrir uchun yoki butun ilovaga bir marta tanlang.'
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
    { value: '229', label: 'tarjima qilinadigan yozuv' },
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
