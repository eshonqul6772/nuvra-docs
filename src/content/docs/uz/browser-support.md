# Brauzerlarni qo‘llab-quvvatlash

nuvra zamonaviy, avtomatik yangilanadigan brauzerlar uchun mo‘ljallangan: Chrome, Edge, Safari va Firefox. U bir nechta zamonaviy veb imkoniyatlardan foydalanadi va biror imkoniyat yo‘q bo‘lsa ham ishlashda davom etadi.

## Popover API

Menyular, popoverlar hamda havola, rasm va jadvallar uchun suzuvchi panellar [Popover API](https://developer.mozilla.org/docs/Web/API/Popover_API) dan foydalanadi. U ularni brauzerning yuqori qatlamida (top layer) ko‘rsatadi, shuning uchun ular hech qanday z-index sozlamasiz dialoglar, modal oynalar va to‘liq ekrandagi muharrir ustida chiqadi.

| Brauzer | Versiya |
| --- | --- |
| Chrome va Edge | 114+ |
| Safari | 17+ |
| Firefox | 125+ |

Popover API bo‘lmagan brauzerlarda bu panellar yuqori z-index qiymatli fixed elementlar sifatida ko‘rsatiladi. Ular ishlayveradi, lekin ilovangizdagi z-index qiymati kattaroq modal oyna ularni yopib qo‘yishi mumkin.

## CSS Custom Highlight API

Qidirish va almashtirish topilgan mosliklarni [CSS Custom Highlight API](https://developer.mozilla.org/docs/Web/API/CSS_Custom_Highlight_API) orqali bo‘yaydi — bu hujjatni o‘zgartirmasdan matnni ajratib ko‘rsatadi. API mavjud bo‘lmasa, qidiruv mosliklarni sanaydi, ular orasida o‘tadi va almashtiradi, faqat mosliklar rang bilan ajratilmaydi.

## Container queries

Qidiruv paneli va holat paneli muharrir tor bo‘lganda (masalan, yon panelda yoki telefonda) ixcham ko‘rinishga o‘tish uchun CSS container queries’dan foydalanadi. Container queries’ni qo‘llamaydigan brauzerlarda odatiy ko‘rinish saqlanadi.

## Bufer va sudrab tashlash

Nusxalash, kesish, qo‘yish va sudrab tashlash standart bufer va drag hodisalaridan foydalanadi. Buferga kirish uchun ruxsat so‘ralmaydi, qo‘yilgan kontent esa qo‘shilishidan oldin tozalanadi.

## Chop etish va eksport

Chop etishda hujjat yashirin freymda chiziladi va brauzerning o‘z chop etish oynasi ochiladi, u yerda PDF ham saqlash mumkin. HTML va Word eksporti faylni brauzerning o‘zida yaratib yuklab beradi, server ishtirok etmaydi.

## Eski brauzerlar

Internet Explorer va boshqa eski brauzerlar qo‘llab-quvvatlanmaydi.
