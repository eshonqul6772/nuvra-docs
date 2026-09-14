# Tezkor tugmalar

nuvra odatiy matn muharrirlaridagi tezkor tugmalarni qo‘llaydi va Markdown uslubidagi belgilar ketma-ketligini yozish paytida o‘zgartiradi. Asboblar panelidagi izohlar har bir buyruqning tezkor tugmasini ko‘rsatadi.

## Platformaga oid eslatma

Jadvallarda Windows va Linux tugmalari ko‘rsatilgan. macOS’da `Ctrl` o‘rniga `⌘`, `Alt` o‘rniga `⌥` ishlating. Tezkor tugmalar fizik tugma bo‘yicha aniqlanadi, shuning uchun kirill va boshqa klaviatura tartiblarida ham ishlaydi.

## Tarix

| Tugmalar | Amal |
| --- | --- |
| `Ctrl+Z` | Bekor qilish |
| `Ctrl+Y` yoki `Ctrl+Shift+Z` | Qaytarish |

## Matn formati

| Tugmalar | Amal |
| --- | --- |
| `Ctrl+B` | Qalin |
| `Ctrl+I` | Kursiv |
| `Ctrl+U` | Tagiga chizilgan |
| `Ctrl+Shift+S` | Ustidan chizilgan |
| `Ctrl+E` | Satr ichidagi kod |
| `Ctrl+,` | Pastki indeks |
| `Ctrl+.` | Yuqori indeks |
| `Ctrl+Shift+H` | Belgilash rangi |

Hech narsa belgilanmagan bo‘lsa, format keyin yoziladigan matnga qo‘llanadi.

## Paragraflar va sarlavhalar

| Tugmalar | Amal |
| --- | --- |
| `Ctrl+Alt+0` | Oddiy matn |
| `Ctrl+Alt+1` … `Ctrl+Alt+6` | 1–6-darajali sarlavha |
| `Ctrl+Shift+B` | Iqtibos |
| `Ctrl+Alt+C` | Kod bloki |
| `Ctrl+Shift+L` | Chapga tekislash |
| `Ctrl+Shift+E` | Markazga tekislash |
| `Ctrl+Shift+R` | O‘ngga tekislash |
| `Ctrl+Shift+J` | Ikki tomonga tekislash |
| `Enter` | Yangi paragraf |
| `Shift+Enter` | Paragraf ichida yangi qator |
| `Ctrl+Enter` | Sahifa uzilishi |
| `Tab` / `Shift+Tab` | Paragraf boshida chekinishni oshiradi yoki kamaytiradi. Qator ichida `Tab` tabulyatsiya belgisini qo‘yadi. |

## Ro‘yxatlar

| Tugmalar | Amal |
| --- | --- |
| `Ctrl+Shift+8` | Belgili ro‘yxat |
| `Ctrl+Shift+7` | Raqamli ro‘yxat |
| `Ctrl+Shift+9` | Vazifalar ro‘yxati |
| `Tab` / `Shift+Tab` | Ro‘yxat bandini ichkariga yoki tashqariga surish |

## Jadvallar

| Tugmalar | Amal |
| --- | --- |
| `Tab` | Keyingi katakka o‘tish; oxirgi katakda yangi qator qo‘shiladi |
| `Shift+Tab` | Oldingi katakka o‘tish |
| `Delete` / `Backspace` | Belgilangan kataklarni tozalash |
| `Escape` | Kataklar belgilanishini bekor qilish |

To‘rtburchak shaklidagi kataklarni belgilash uchun sichqoncha bilan kataklar ustidan torting.

## Rasmlar va havolalar

| Tugmalar | Amal |
| --- | --- |
| `Delete` / `Backspace` | Belgilangan rasmni o‘chirish |
| `Escape` | Rasm belgilanishini olib tashlash |
| `Ctrl+bosish` | Havolani yangi oynada ochish |

## Muharrir

| Tugmalar | Amal |
| --- | --- |
| `Ctrl+F` | Qidirish |
| `Ctrl+H` | Qidirish va almashtirish |
| `Enter` / `Shift+Enter` | Qidiruv maydonida: keyingi yoki oldingi moslik |
| `Enter` | Almashtirish maydonida: joriy moslikni almashtirish |
| `Ctrl+K` | Havola qo‘shish yoki tahrirlash |
| `Ctrl+Alt+M` | Izohlar yoqilgan bo‘lsa, belgilangan matnga izoh qo‘shish |
| `Ctrl+Enter` | Izoh, javob yoki snoska formasida: saqlash |
| `Escape` | Izoh, javob yoki snoska formasida: saqlamasdan chiqish |
| `Ctrl+P` | Chop etish |
| `Ctrl+` sichqoncha g‘ildiragi | Masshtabni kattalashtirish yoki kichraytirish |
| `O‘ng tugma` | Bosilgan joyga mos kontekst menyusini ochish |
| `Escape` | Ochiq menyu yoki popoverni, qidiruv panelini yopish, format bo‘yoqchasini bekor qilish yoki to‘liq ekrandan chiqish |

## / menyusi

Buyruqlar menyusini ochish uchun qator boshida yoki probeldan keyin `/` yozing, so‘ng harflar bilan ro‘yxatni filtrlang.

| Tugmalar | Amal |
| --- | --- |
| `↑` / `↓` | Buyruqlar bo‘ylab yurish |
| `Enter` yoki `Tab` | Tanlangan buyruqni bajarish |
| `Escape` | Menyuni yopish |

## Markdown uslubidagi qoidalar

Quyidagi ketma-ketliklar yozilganda avtomatik o‘zgartiriladi. Kod ichida qoidalar ishlamaydi.

### Paragraf boshida

| Yozing | Natija |
| --- | --- |
| `#` dan `######` gacha va probel | 1–6-darajali sarlavha |
| `-`, `+` yoki `*` va probel | Belgili ro‘yxat |
| `1.` va probel | Raqamli ro‘yxat; boshqa raqam yozilsa ro‘yxat o‘sha raqamdan boshlanadi |
| `[ ]` yoki `[x]` va probel | Vazifalar ro‘yxati bandi, `x` bilan belgilangan |
| `>` va probel | Iqtibos |
| `` ``` `` | Kod bloki |
| `---` | Gorizontal chiziq |
| `___` yoki `***` va probel | Gorizontal chiziq |

### Satr ichidagi format

| Yozing | Natija |
| --- | --- |
| `**matn**` yoki `__matn__` | Qalin |
| `*matn*` yoki `_matn_` | Kursiv |
| `~~matn~~` | Ustidan chizilgan |
| `==matn==` | Belgilash rangi |
| `` `matn` `` | Satr ichidagi kod |

Yopuvchi belgilardan keyin yoziladigan matn endi formatlanmaydi.

### Havolalar

`http://`, `https://` yoki `www.` bilan boshlanadigan veb-manzildan keyin probel yozilsa, u havolaga aylanadi. `www.` bilan boshlanadigan manzillarga `https://` qo‘shiladi.

### Tipografiya

| Yozing | Natija |
| --- | --- |
| `--` | — |
| `...` | … |
| `->` | → |
| `<-` | ← |
| `>>` | » |
| `<<` | « |
| `(c)` | © |
| `(r)` | ® |
| `(tm)` | ™ |
| `(sm)` | ℠ |
| `+/-` | ± |
| `!=` | ≠ |
| `3x4` yoki `3 * 4` | 3×4 yoki 3 × 4 |
| `"` va `'` | Tipografik qo‘shtirnoqlar “ ” va ‘ ’ |
