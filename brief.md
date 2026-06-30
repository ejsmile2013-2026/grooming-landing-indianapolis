# BRIEF — Pet Grooming Landing Page Template
**Главный документ проекта**
**Дата:** 2026-05-29
**Автор:** Цифровой мастер — создаю сайты, приложения и ИИ-агентов для локального бизнеса Bay Area

---

## 1. О ПРОЕКТЕ

### Что это
«Золотой шаблон» — мобильный лендинг с интегрированной квиз-воронкой для груминг-салонов. Выглядит как индивидуальная разработка, настраивается под нового клиента за 15–20 минут.

### Продаём не сайт — продаём систему
> «Автоматизированная система генерации заявок, которая работает 24/7, пока вы стрижёте собак»

### Монетизация
- **Разработка:** $500–800 (одноразово)
- **Поддержка:** $50–100/мес (хостинг + обновления)
- **Демонстрация:** Видео-скринкаст с iPhone → владелец видит свой будущий сайт

---

## 2. ЦЕЛЬ САЙТА

**Главная цель:** Конвертировать незнакомого посетителя в квалифицированную заявку через квиз — без звонков, без PDF-форм, без «отправьте нам email».

**Измеримый результат для клиента:**
- Заявка приходит на email в течение секунды после Submit
- Все данные сохраняются в Google Sheet
- Мастер звонит уже «тёплому» клиенту с готовой информацией о питомце

---

## 3. ЦЕЛЕВАЯ АУДИТОРИЯ

**Конечный пользователь лендинга (клиент грумера):**
- Владельцы домашних животных, Walnut Creek / Concord / Clayton / Lafayette
- Возраст 28–55, семьи с детьми и питомцами
- Пользуются iPhone, принимают решения через мобильный браузер
- Ценят время, доверие и прозрачность цен
- Боятся неизвестности: «сколько возьмут за моего пуделя?»

**Покупатель шаблона (клиент мастера):**
- Владелец груминг-салона в Bay Area
- Устал от ручной записи по телефону
- Не разбирается в технологиях, хочет «просто чтобы работало»
- Приоритет #1: **Bark Avenue** (Walnut Creek) — старый сайт, нет мобильной записи

---

## 4. СТРАТЕГИЯ ИЗ ИССЛЕДОВАНИЯ РЫНКА

**Наше преимущество над конкурентами:**

| Конкурент | Их слабость | Наш аргумент |
|-----------|------------|--------------|
| Фрилансеры | Делают «визитки», нет конверсии | Мы продаём заявки, а не красоту |
| Локальные студии | Дорого, медленно | Личный контакт, быстро, специализация |
| Wix / Squarespace | Клиент тратит своё время | Мы делаем всё под ключ |

**Ключевые инсайты для груминга:**
- Мастера тратят 5+ часов в неделю на звонки и запись
- Клиенты боятся неопределённости цены
- «Ручная» запись = потеря заявок, когда мастер занят

---

## 5. СТРУКТУРА СТРАНИЦЫ (index.html)

### БЛОК 1 — HERO (Первый экран)

**Заголовок:**
> Does Your Dog Actually Look Forward to Bath Day?

**Подзаголовок:**
> Professional grooming in Walnut Creek — stress-free for your pet, zero hassle for you. Take our 60-second quiz and get a custom plan with upfront pricing.

**CTA-кнопка:**
> Find My Pet's Grooming Plan →
*(плавный скролл к квизу)*

**Фон:** Профессиональное фото — грумер + счастливая собака. Тёплое освещение.

---

### БЛОК 2 — TRUST BAR (Полоса доверия)

Четыре иконки в одну строку:
```
⭐ 5-Star Rated on Yelp & Google
📍 Walnut Creek, CA
✓ Same-Week Appointments
🐾 500+ Happy Pets Groomed
```

---

### БЛОК 3 — BENEFITS (3 карточки)

| Карточка | Заголовок | Текст |
|----------|-----------|-------|
| 🏅 | Certified & Experienced | Our groomers are trained for all breeds and coat types, from Goldendoodles to Huskies. |
| 😌 | Calm, Stress-Free Environment | Small-batch grooming. Your pet gets individual attention, not a crowded kennel. |
| 💲 | No Surprise Bills | You'll know the price before you book. Always. |

---

### БЛОК 4 — QUIZ (Главный конверсионный блок)

**Заголовок:**
> Find the Perfect Grooming Plan for Your Pet

**Подзаголовок:**
> Answer 5 quick questions — we'll recommend the right service and show you an estimated price.

**Прогресс-бар:** "Step 1 of 5" — обязательно, критично для мобильных

**Шаги квиза:**

| Шаг | Вопрос | Варианты |
|-----|--------|----------|
| 1 | What type of pet do you have? | 🐕 Dog · 🐈 Cat · 🐾 Other |
| 2 | How big is your pet? | Small (<20 lbs) · Medium (20–50 lbs) · Large (50+ lbs) |
| 3 | What's your pet's coat type? | Short · Medium · Long/Fluffy · Double coat |
| 4 | What services are you looking for? | Bath & Brush · Full Groom · Nail Trim · Full Package |
| 5 | When was your pet's last professional groom? | Never · <3 months · 3–6 months · 6+ months |
| 6 | **Форма контактов** | Имя питомца · Ваше имя · Телефон |

**Кнопка Submit:**
> See My Grooming Plan →

**При нажатии:**
1. POST данных в Make.com webhook
2. Редирект на `thank-you.html?petType=dog&petName=Buddy&size=medium&coat=long&service=full&ownerName=Sarah`

---

### БЛОК 5 — TESTIMONIALS (Социальное доказательство)

2–3 карточки с отзывами:
```
[Фото питомца]
★★★★★
"[Текст отзыва]"
— [Имя владельца], owner of [Кличка], [Порода]
```
*Плейсхолдеры — заменяются при настройке под клиента*

---

### БЛОК 6 — FOOTER

```
[Логотип / Название]
📞 (925) 555-0123          ← кнопка tel: (один клик = звонок)
📍 123 Main St, Walnut Creek, CA
🕐 Mon–Sat 9am–6pm

[Instagram] [Yelp] [Google Maps]

© 2026 [Business Name]. All rights reserved.
```

---

## 6. СТРАНИЦА РЕЗУЛЬТАТА (thank-you.html)

**Заголовок (динамический):**
> 🐾 Your Grooming Plan is Ready, [petName]!

**Тело (динамическое):**
> Based on your [size] [coat type] dog, we recommend:
> **[Service Name]**
> Estimated price: **$[min]–$[max]**
>
> Our groomer will call you within 1 hour to confirm your appointment.

**Кнопка:**
> 📞 Call Us Now  ← tel: ссылка (один клик)

### Логика цен (авторасчёт в JS)

| Размер | Короткая/средняя шерсть | Длинная/двойная шерсть |
|--------|------------------------|----------------------|
| Small (<20 lbs) | $45–65 | $65–85 |
| Medium (20–50 lbs) | $65–85 | $85–110 |
| Large (50+ lbs) | $85–110 | $110–145 |

**Full Package:** +$15–20 к базовому диапазону.
**Cat / Other:** Без цены → *"We'd love to meet your pet! Our groomer will call you within 1 hour to discuss the best service."*

---

## 7. ДИЗАЙН И СТИЛЬ

### Визуальное направление
**Clean & Friendly** — голубой + белый, доверие, семейная аудитория Bay Area

### Цвета
| Роль | Цвет | HEX |
|------|------|-----|
| Primary (кнопки, акценты) | Sky Blue | `#0ea5e9` |
| Background | White / Light Blue | `#ffffff` / `#f0f9ff` |
| Text | Dark Navy | `#0c4a6e` |
| Secondary text | Muted Blue | `#0369a1` |
| Success / CTA | Green | `#22c55e` |

*Все цвета меняются через `CONFIG.primaryColor`*

### Типографика
- **Шрифт:** System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI'`) — нет загрузки, максимальная скорость
- **Заголовки:** 28–36px, font-weight 800
- **Текст:** 16px min (обязательно для мобильных)
- **Кнопки:** 18px, font-weight 700

### Мобильная адаптивность
- Base: 375px (iPhone SE)
- Tablet: 768px
- Desktop: 1024px
- Кнопки: минимум 48px высота (tap target)
- Форма: крупные поля, type="tel" для телефона

### Анимации
- Плавный скролл к квизу при клике на Hero CTA
- Fade-in при переходе между шагами квиза
- Прогресс-бар заполняется при каждом шаге
- Кнопка Submit — pulse-анимация пока идёт отправка

---

## 8. ТЕХНИЧЕСКАЯ АРХИТЕКТУРА

### Файлы
```
index.html        ← главная страница (один файл)
thank-you.html    ← страница результата
```

### CONFIG-объект (вверху index.html)
```javascript
const CONFIG = {
  businessName: "Happy Paws Grooming",
  phone: "(925) 555-0123",
  email: "info@happypaws.com",
  address: "123 Main St, Walnut Creek, CA",
  hours: "Mon–Sat 9am–6pm",
  primaryColor: "#0ea5e9",
  webhookUrl: "https://hook.make.com/YOUR_WEBHOOK_ID",
  instagramUrl: "https://instagram.com/...",
  yelpUrl: "https://yelp.com/biz/...",
  googleMapsUrl: "https://maps.google.com/..."
}
```

### Интеграция Make.com (webhook payload)
```json
{
  "petType": "dog",
  "petSize": "medium",
  "coatType": "long",
  "services": "full",
  "lastGroom": "3-6 months",
  "petName": "Buddy",
  "ownerName": "Sarah",
  "phone": "(925) 555-0198",
  "submittedAt": "2026-05-29T14:32:00Z",
  "source": "landing-page-quiz"
}
```

**Make.com сценарий:**
1. Webhook trigger → получает payload
2. Ветка A → Email на `CONFIG.email` с деталями заявки
3. Ветка B → Новая строка в Google Sheet

### Стек
- Чистый HTML / CSS / JS — без фреймворков, без npm
- Хостинг: Vercel или Netlify (управление у мастера, не у клиента)
- Нет CMS, нет базы данных — только статика

---

## 9. КАСТОМИЗАЦИЯ ПОД НОВОГО КЛИЕНТА

**Что менять (15–20 минут работы):**
1. `CONFIG` — имя, телефон, адрес, цвет, webhook
2. Hero-фото — с Unsplash или фото клиента
3. Отзывы — 2–3 реальных отзыва из Yelp/Google
4. Trust bar — реальное кол-во питомцев / лет работы
5. Логотип — заменить в header и footer

**Что НЕ менять:** структура, квиз, JS-логика, стили — всё уже готово.

---

## 10. ЧТО НЕ ВХОДИТ В ШАБЛОН (out of scope)

- Онлайн-бронирование с календарём
- Приём платежей
- CMS / панель администратора
- Мультиязычность
- Блог или дополнительные страницы

---

## 11. ПРИОРИТЕТНЫЕ КЛИЕНТЫ ДЛЯ ДЕМО

| # | Компания | Почему первый | Потенциальный чек |
|---|----------|--------------|------------------|
| 1 | **Bark Avenue** (Walnut Creek) | Старый сайт, 0 мобильной записи — идеальный контраст | $600–800 |
| 2 | **LuxePaws Co.** (Walnut Creek) | Премиум-сегмент, готовы платить за качество | $700–800 |
| 3 | **Luxury Mobile Grooming** (Concord) | Нет лендинга вообще — продать легче всего | $500–600 |

**Скрипт первого контакта:**
> *«Я открыл ваш сайт на iPhone — посмотрите на этот скриншот. Ваши клиенты видят именно это. Я могу показать вам, как это выглядит после моей работы — за 3 минуты.»*
