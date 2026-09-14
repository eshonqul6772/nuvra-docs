# Formalar va tekshiruv

`Editor` — oddiy formaga bemalol joylashadigan formatlangan matn maydoni. Uning qiymati HTML satr, shuning uchun tekshiruv boshqa maydonlardagidek, faqat ikki narsani bilish kerak: bo‘sh hujjat `''` bo‘ladi, belgilar chegarasi esa HTML’ni emas, matnni sanaydi.

## Oddiy Vue bilan forma

Misolda xatolar reaktiv obyektda saqlanadi, maydon fokusni yo‘qotganda o‘sha maydon, yuborishda esa hammasi tekshiriladi.

```vue
<script setup lang="ts">
import { reactive, watch } from 'vue';
import { Editor } from 'nuvra';

const MAX_LENGTH = 2000;

const form = reactive({ title: '', description: '' });
const errors = reactive<{ title?: string; description?: string }>({});

const validateTitle = () => {
  errors.title = form.title.trim() === '' ? 'Sarlavhani kiriting' : undefined;
};

const validateDescription = () => {
  // bo‘sh hujjat doim ''
  errors.description = form.description === '' ? 'Rol tavsifini yozing' : undefined;
};

// xato ko‘rsatilgach, qiymat tuzatilishi bilan uni olib tashlaymiz
watch(() => form.description, () => errors.description && validateDescription());

const submit = async () => {
  validateTitle();
  validateDescription();
  if (errors.title || errors.description) return;
  await fetch('/api/vacancies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  });
};
</script>

<template>
  <form novalidate @submit.prevent="submit">
    <label>
      Sarlavha
      <input v-model="form.title" @blur="validateTitle" />
    </label>
    <p v-if="errors.title" class="field-error">{{ errors.title }}</p>

    <div class="field-label">Tavsif</div>
    <Editor
      v-model="form.description"
      placeholder="Rol tavsifini yozing"
      :max-length="MAX_LENGTH"
      @blur="validateDescription"
    />
    <p v-if="errors.description" class="field-error">{{ errors.description }}</p>

    <button type="submit">E’lon qilish</button>
  </form>
</template>
```

- **Majburiy maydon.** Tegilmagan yoki tozalangan maydon uchun `form.description === ''` yetarli. Faqat probellar yoki bir nechta bo‘sh paragrafdan iborat hujjat `''` emas; bu siz uchun muhim bo‘lsa, matnni serverda ham tekshiring.
- **Fokus yo‘qolganda qiymat yangi bo‘ladi.** Foydalanuvchi yozayotganda `v-model` qisqa pauzadan (taxminan 200 ms) keyin yangilanadi. Muharrir `blur` ni chiqarishdan oldin kutilayotgan o‘zgarishlarni yozadi, yuborish tugmasi bosilganda esa fokus odatda avval muharrirdan chiqadi, shuning uchun yuborish funksiyasi eng oxirgi qiymatni ko‘radi. Forma fokus muharrirda turgan holda yuborilsa (masalan, o‘zingizning tezkor tugmangiz bilan), oxirgi lahzada yozilgan belgilar qiymatga hali tushmagan bo‘lishi mumkin.
- **Belgilar chegarasi.** `:max-length` chegaradan oshib ketadigan yozish, qo‘yish va qo‘shish amallarini to‘xtatadi, holat panelida esa hisoblagich ko‘rinadi. Brauzerda “juda uzun” degan xabar kerak emas.

## Serverda tekshirish

Brauzer oxirgi himoya chizig‘i emas: tekshiruvlarni serverda takrorlang.

- `maxLength` hujjat matnidagi belgilarni sanaydi. HTML satr teglar va atributlar hisobiga doim uzunroq, shuning uchun `description.length` ni chegara bilan solishtirmang. HTML kutubxonangiz yordamida teglarni olib tashlang (va entity’larni ochib chiqing), qolgan matnni sanang va kichik zaxira qoldiring, chunki muharrir paragraflar orasidagi qator uzilishlarini sanamaydi.
- Teglar olib tashlangach matni bo‘sh qolgan tavsifni kiritilmagan deb hisoblang. Faqat rasmdan iborat qiymat ham to‘g‘ri bo‘ladigan holat bundan mustasno.
- HTML’ni saqlashdan yoki boshqa joyda ko‘rsatishdan oldin tozalang.

## Element Plus bilan

nuvra hech qanday UI kutubxonasiga bog‘liq emas, `Editor` istalgan forma kutubxonasi bilan ishlaydi. Masalan, Element Plus’da uni `prop` berilgan `el-form-item` ichiga joylang va qoidani odatdagidek yozing:

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { Editor } from 'nuvra';

const formRef = ref<FormInstance>();
const form = reactive({ description: '' });

const rules: FormRules = {
  description: [{ required: true, message: 'Rol tavsifini yozing', trigger: 'blur' }]
};

const submit = async () => {
  const valid = await formRef.value?.validate().catch(() => false);
  if (valid) await fetch('/api/vacancies', { method: 'POST', body: JSON.stringify(form) });
};
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
    <el-form-item label="Tavsif" prop="description">
      <Editor v-model="form.description" @blur="formRef?.validateField('description')" />
    </el-form-item>
    <el-button type="primary" @click="submit">E’lon qilish</el-button>
  </el-form>
</template>
```

- `required: true` `''` uchun xato beradi, shuning uchun bo‘sh hujjat maxsus validatorsiz ushlanadi.
- Element Plus `blur` va `change` qoidalarini o‘zining kiritish komponentlari bu hodisalar haqida xabar berganda ishga tushiradi; `Editor` ular qatoriga kirmaydi, shuning uchun forma elementi uning fokusini o‘zi sezmaydi. Yuborishda `formRef.validate()` ishonchli yo‘l. Fokus yo‘qolganda ham tekshirish uchun yuqoridagidek `Editor` ning `@blur` hodisasidan `validateField` ni chaqiring.

## Yana qarang

- [Boshlash](/docs/getting-started) — `Editor` forma maydoni sifatida.
- [Foydalanish](/docs/usage) — hujjat qiymati, belgilar chegarasi va placeholder.
- [Rasmlarni yuklash](/docs/recipe-image-upload) — maydondagi rasmlarni serveringizda saqlash.
