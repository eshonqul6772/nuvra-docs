# Rasmlarni yuklash

Yuklash funksiyasi berilmasa, hujjatga qo‘shilgan rasmlar HTML ichiga data URL sifatida joylanadi va hujjat og‘irlashadi. Bu retsept rasmlarni serveringizda saqlaydi, yuklash jarayonini ko‘rsatadi va xatolarni foydalanuvchiga bildiradi. `DocumentEditor` va `Editor` uchun bir xil ishlaydi.

## Yuklash funksiyasi

`uploadImage` `File` obyektini oladi va saqlangan rasm manzilini qaytaradi. `fetch` so‘rov tanasining yuborilish jarayonini bildira olmaydi, shuning uchun quyidagi funksiya `XMLHttpRequest` dan foydalanadi:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DocumentEditor, type DocumentImageUploadHandler } from 'nuvra';

const html = ref('');
const progress = ref<number | null>(null); // joriy faylning foizi, yuklash bo‘lmasa null
const message = ref('');
let request: XMLHttpRequest | null = null;

const uploadImage: DocumentImageUploadHandler = file =>
  new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    request = xhr;
    progress.value = 0;

    xhr.open('POST', '/api/images');
    xhr.responseType = 'json';
    xhr.timeout = 60_000;

    xhr.upload.onprogress = event => {
      if (event.lengthComputable) progress.value = Math.round((event.loaded / event.total) * 100);
    };
    xhr.onload = () => {
      const url = (xhr.response as { url?: unknown } | null)?.url;
      if (xhr.status < 200 || xhr.status >= 300) reject(new Error(`Rasmni yuklab bo‘lmadi (${xhr.status}).`));
      else if (typeof url !== 'string' || !url) reject(new Error('Server rasm manzilini qaytarmadi.'));
      else resolve(url);
    };
    xhr.onerror = () => reject(new Error('Rasmni yuklashda tarmoq xatosi.'));
    xhr.ontimeout = () => reject(new Error('Yuklash juda uzoq davom etdi.'));
    xhr.onabort = () => reject(new Error('Yuklash bekor qilindi.'));
    xhr.onloadend = () => {
      progress.value = null;
      request = null;
    };

    const body = new FormData();
    body.append('file', file);
    xhr.send(body);
  });

const cancelUpload = () => request?.abort();

const onUploadError = (error: unknown) => {
  message.value = error instanceof Error ? error.message : 'Rasmni yuklab bo‘lmadi.';
};
</script>

<template>
  <div v-if="progress !== null" class="upload-progress">
    <progress max="100" :value="progress" />
    <span>{{ progress }}%</span>
    <button type="button" @click="cancelUpload">Bekor qilish</button>
  </div>
  <p v-if="message" class="upload-error" role="alert">
    {{ message }}
    <button type="button" @click="message = ''">Yopish</button>
  </p>

  <DocumentEditor
    v-model="html"
    :upload-image="uploadImage"
    :max-image-size-mb="5"
    @upload-error="onUploadError"
  />
</template>
```

- Funksiya ishlayotganda muharrir o‘zining “yuklanmoqda” belgisini ko‘rsatadi. Yuqoridagi jarayon chizig‘i katta fayllar uchun qo‘shimcha, u muharrirdan tashqarida turadi.
- Bir nechta rasm (birga qo‘yilgan yoki sudrab tashlangan) ketma-ket yuklanadi, shuning uchun `progress` doim joriy faylga tegishli.
- `timeout` va `abort()` qotib qolgan yuklashni to‘xtatadi. Promise rad etiladi, rasm qo‘shilmaydi, muharrir esa `uploadError` ni chiqaradi.

## Xatolar

`uploadError` `unknown` qiymat oladi, chunki u ikki xil xatoni bildiradi:

- **Muharrir tekshiruvi.** Turi `image/*` bo‘lmagan yoki `maxImageSizeMb` (standart 10 MB) dan katta fayl funksiya chaqirilishidan oldin rad etiladi. Bular muharrir interfeysi tilidagi xabarli `Error` obyektlari, ularni to‘g‘ridan-to‘g‘ri ko‘rsatish mumkin.
- **Sizning funksiyangiz.** Promise nima bilan rad etilsa, o‘sha qiymat o‘zgarishsiz uzatiladi. Yuqoridagidek, foydalanuvchi ko‘rishi kerak bo‘lgan xabarli `Error` obyektlari bilan rad eting. Funksiya bo‘sh satr qaytarsa, muharrir buni ham xato sifatida bildiradi.

Rasmlardan biri yuklanmasa ham, shu qo‘yish yoki sudrab tashlashdagi qolgan rasmlar qo‘shiladi.

## Server

Endpoint `multipart/form-data` so‘rovini oladi, rasm `file` maydonida bo‘ladi, javob esa JSON:

```json
{ "url": "/files/images/2026/09/5f1c2a.png" }
```

- Fayl hajmi va haqiqiy turini serverda tekshiring: brauzerdagi tekshiruvlar faqat qulaylik uchun, `file.type` esa mijozdan keladi.
- `image/*` ga SVG ham kiradi, unda skript bo‘lishi mumkin. Uni rad eting yoki yuklangan fayllarni alohida domendan tarqating.
- `https://` (yoki `http://`) manzil yoki `/files/…` kabi nisbiy manzil qaytaring. Boshqa sxemali manzil e’tiborsiz qoldiriladi: rasm qo‘shilmaydi va xato chiqarilmaydi.
- Hujjatdan o‘chirilgan rasmlar serverda qoladi. Ularni tozalash uchun vaqti-vaqti bilan saqlangan fayllarni saqlangan HTML’dagi `src` manzillari bilan solishtiring.

Asboblar panelida veb-manzil orqali qo‘shilgan rasmlar `uploadImage` ga berilmaydi; HTML’da manzil yozilganicha qoladi.

## Yana qarang

- [Foydalanish](/docs/usage#rasmlar) — rasmlar qanday qo‘shiladi, tekshiriladi va joylanadi.
- [API](/docs/api) — `uploadImage`, `maxImageSizeMb` va `uploadError`.
- [Avtosaqlash](/docs/recipe-autosave) — rasmlar yuklangach hujjatni saqlash.
