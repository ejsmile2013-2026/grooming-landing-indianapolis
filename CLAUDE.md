# CLAUDE.md — Правила и контекст проекта Grooming

> Этот файл читается автоматически при каждом открытии проекта.
> Следуй этим правилам ВСЕГДА, без исключений.

---

## 1. КТО Я И ЧЕМ ЗАНИМАЮСЬ

Я — цифровой специалист (Нязик), живу в **Concord, California, Bay Area**.
Создаю сайты, приложения и ИИ-агентов для локального малого бизнеса.

**Этот проект:** «Золотой шаблон» — мобильный лендинг с квиз-воронкой для груминг-салонов Bay Area.
Продаётся владельцам груминг-салонов за **$500–800** (разовая разработка) + **$50–100/мес** (поддержка).

---

## 2. ФАЙЛЫ ПРОЕКТА

```
Grooming/
├── CLAUDE.md          ← этот файл, правила для Claude
├── brief.md           ← главный бриф проекта (подробно)
├── research.md        ← исследование рынка Bay Area
├── index.html         ← главная страница лендинга (ОСНОВНОЙ ФАЙЛ)
├── thank-you.html     ← страница результата после квиза
└── docs/
    └── superpowers/specs/
        └── 2026-05-29-pet-grooming-landing-design.md  ← дизайн-спецификация
```

**Главный файл для работы:** `index.html` — ~1435 строк, всё в одном файле.
**Оба HTML-файла должны быть в одной папке** — thank-you.html ссылается на index.html, квиз редиректит на thank-you.html.

---

## 3. АРХИТЕКТУРА — КЛЮЧЕВЫЕ ПРАВИЛА

### CONFIG-объект — единственное место для кастомизации
```javascript
const CONFIG = {
  businessName:  "Happy Paws Grooming",
  tagline:       "Walnut Creek's Trusted Pet Grooming Studio",
  phone:         "(925) 555-0123",
  phoneRaw:      "+19255550123",
  email:         "info@happypaws.com",
  address:       "123 Main St, Walnut Creek, CA 94596",
  hours:         "Mon–Sat  9am–6pm",
  primaryColor:  "#0ea5e9",
  petsGroomed:   "500+",
  webhookUrl:    "https://hook.make.com/YOUR_WEBHOOK_ID",
  instagramUrl:  "...",
  yelpUrl:       "...",
  googleMapsUrl: "..."
};
```

**Правило #1:** Под каждого нового клиента меняем ТОЛЬКО CONFIG (15–20 минут работы). Остальной код не трогаем.

**Правило #2:** Цвета — только через CSS-переменную `--primary`, которая задаётся из `CONFIG.primaryColor`.

**Правило #3:** Стек — чистый HTML/CSS/JS, никаких фреймворков, npm, библиотек без крайней необходимости. Сайт должен открываться двойным кликом на файл, без сборки.

---

## 4. СТРУКТУРА index.html

Страница состоит из 11 блоков в порядке:

1. **Фиксированный nav** — логотип + desktop CTA + hamburger (мобильный)
2. **Mobile menu overlay** — slide-down с backdrop
3. **Hero** — анимированный градиент, 3 floating blobs, parallax, 2 CTA кнопки
4. **Trust bar** — 4 иконки в строку (rating, location, appointments, pets count)
5. **Stats** — 4 анимированных счётчика (500+, 5★, 6 лет, 98%)
6. **Benefits** — 3 карточки (Certified, Stress-Free, No Surprise Bills)
7. **Quiz** — 6 шагов (5 вопросов + форма контактов + прогресс-бар)
8. **Testimonials** — 3 карточки с отзывами
9. **Contact form** — имя + email + сообщение, SVG-анимация успеха
10. **Footer** — градиент, pulse-кнопка звонка
11. **Back-to-top button** — фиксированный, появляется после 420px скролла

**Scroll-progress bar** фиксирован в самом верху (height: 3px).

---

## 5. КВИЗ — ЛОГИКА И ДАННЫЕ

### 6 шагов квиза:
| Шаг | Вопрос | Варианты |
|-----|--------|----------|
| 1 | Тип питомца | Dog / Cat / Other |
| 2 | Размер | Small (<20 lbs) / Medium (20–50) / Large (50+) |
| 3 | Тип шерсти | Short / Medium / Long/Fluffy / Double coat |
| 4 | Услуга | Bath & Brush / Full Groom / Nail Trim / Full Package |
| 5 | Последний груминг | Never / <3 months / 3–6 months / 6+ months |
| 6 | Контакты | Имя питомца + Имя владельца + Телефон |

### При Submit:
1. POST на `CONFIG.webhookUrl` (Make.com)
2. Редирект на `thank-you.html?petType=...&petName=...&size=...&coat=...&service=...&ownerName=...`

### Матрица цен (thank-you.html):
| Размер | Short/Medium шерсть | Long/Double шерсть |
|--------|--------------------|--------------------|
| Small | $45–65 | $65–85 |
| Medium | $65–85 | $85–110 |
| Large | $85–110 | $110–145 |

Full Package: +$15–20 к базовому диапазону.
Nail Trim: всегда $20–30.
Cat/Other: без цены, только личный звонок.

---

## 6. WOW-ЭФФЕКТЫ — ЧТО РЕАЛИЗОВАНО

### CSS анимации:
- `heroGradient` — 12s анимация фона hero (300% background-size)
- `blobDrift` — плавающие blobs в hero
- `btnShimmer` — shimmer на hero CTA кнопке
- `callPulse` — пульсация кнопки звонка в footer
- `drawCircle` + `drawTick` — SVG анимация чекмарка в contact form
- `successPop` — pop-in для блока успеха
- `popIn` — анимация появления карточки на thank-you.html

### JavaScript интерактивность:
- **Scroll-progress bar** — заполняется при скролле (top: 0)
- **Параллакс** — hero content движется при скролле (0.22x скорость)
- **IntersectionObserver** — fade-in блоков (класс `.fade-in` + `.visible`)
- **Stagger анимация** — дети grid-элементов появляются с задержкой 0.13s
- **Счётчики** — `requestAnimationFrame` + `IntersectionObserver` (stats section + trust bar)
- **Mobile menu** — `toggleMenu()` / `closeMenu()`, `overflow: hidden` на body
- **Back-to-top** — появляется при `scrollY > 420`, клик → `scrollTo(0, 'smooth')`
- **Contact form** — валидация + SVG анимация успеха без реальной отправки

### iOS/Mobile совместимость:
- `font-size: 16px` на inputs (предотвращает auto-zoom)
- `-webkit-appearance: none` на кнопках
- `-webkit-tap-highlight-color: transparent`
- `passive: true` на scroll listener
- Все tap targets минимум 48px высоту

---

## 7. MAKE.COM ИНТЕГРАЦИЯ

### Webhook payload:
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

### Make.com сценарий (для клиента):
1. Webhook trigger → получает payload
2. Ветка A → Email на `CONFIG.email` с деталями заявки
3. Ветка B → Новая строка в Google Sheet

---

## 8. ПРИОРИТЕТНЫЕ КЛИЕНТЫ ДЛЯ ДЕМО

| Приоритет | Компания | Город | Почему |
|-----------|----------|-------|--------|
| #1 | **Bark Avenue** | Walnut Creek | Старый сайт, 0 мобильной записи |
| #2 | **LuxePaws Co.** | Walnut Creek | Премиум-сегмент, готовы платить |
| #3 | **Luxury Mobile Grooming** | Concord | Нет лендинга вообще |

### Скрипт первого контакта:
> *«Я открыл ваш сайт на iPhone — посмотрите на этот скриншот. Ваши клиенты видят именно это. Я могу показать вам, как это выглядит после моей работы — за 3 минуты.»*

---

## 9. ПРАВИЛА ДЛЯ CLAUDE — КАК РАБОТАТЬ С ЭТИМ ПРОЕКТОМ

### Общение
- **Всегда отвечай на русском языке** — это рабочий язык с Нязик
- Тон: партнёрский, профессиональный, без лишней воды

### При редактировании кода
- Перед любым Edit — всегда сначала Read нужного файла
- Редактируй минимально необходимое — не рефакторь то, что не просят
- После изменений в HTML — проверяй, что `index.html` и `thank-you.html` не нарушают relative links между собой
- Не добавляй npm-зависимости, build-шаги, фреймворки — только чистый HTML/CSS/JS
- Не добавляй комментарии в код без явной просьбы

### При обновлении research.md
- Добавляй новые данные в КОНЕЦ файла новым разделом
- Не перезаписывай существующие разделы — только дополняй
- Указывай источники для каждого нового раздела

### При кастомизации под нового клиента
- Менять только CONFIG в `index.html`
- Менять только CONFIG в `thank-you.html`
- Обновить Hero фото (Unsplash или фото клиента)
- Обновить отзывы (2–3 из Yelp/Google)
- НЕ трогать структуру, JS-логику, стили

### OUT OF SCOPE для этого проекта
- Онлайн-бронирование с календарём
- Приём платежей
- CMS / панель администратора
- Мультиязычность
- Блог или дополнительные страницы

---

## 10. МОНЕТИЗАЦИЯ

| Услуга | Цена |
|--------|------|
| Разработка (настройка шаблона под клиента) | $500–800 |
| Поддержка (хостинг + обновления) | $50–100/мес |
| Хостинг | Vercel или Netlify (управление у меня) |

**Философия:** Продаём не сайт — продаём **систему генерации заявок, работающую 24/7**.
