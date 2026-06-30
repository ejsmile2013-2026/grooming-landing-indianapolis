# Pet Grooming Landing Page — Design Spec
**Date:** 2026-05-29
**Market:** Walnut Creek / Concord, Bay Area CA
**Product:** Reusable template sold to pet grooming salons for $500–$800

---

## 1. Overview

A mobile-first landing page with an integrated quiz funnel for pet grooming salons. Built as a universal template that looks like custom development — resell to multiple clients by editing one CONFIG block.

**Two deliverable files:**
- `index.html` — main landing page with quiz
- `thank-you.html` — personalized grooming plan page

---

## 2. Architecture

### Single-file CONFIG approach
At the top of `index.html`, a JavaScript CONFIG object holds all client-specific data. To customize for a new client, edit only this block:

```js
const CONFIG = {
  businessName: "Happy Paws Grooming",
  phone: "(925) 555-0123",
  address: "123 Main St, Walnut Creek, CA",
  hours: "Mon–Sat 9am–6pm",
  primaryColor: "#0ea5e9",
  email: "info@happypaws.com",
  webhookUrl: "https://hook.make.com/YOUR_WEBHOOK_ID",
  instagramUrl: "https://instagram.com/...",
  yelpUrl: "https://yelp.com/biz/...",
  googleMapsUrl: "https://maps.google.com/..."
}
```

The rest of the file reads from CONFIG — colors, name, phone, links all update automatically.

### Tech stack
- Pure HTML / CSS / JS — no frameworks, no npm, no build step
- Form submission via `fetch()` POST to Make.com webhook
- Thank-you page receives quiz data via URL query params

### Lead routing (Make.com scenario)
Quiz submit → POST to Make.com webhook → scenario fans out to:
1. Email notification to groomer (with all quiz answers)
2. New row appended to Google Sheet (lead log)

---

## 3. Page Structure — index.html

### Block 1: HERO
- **Headline:** "Does Your Dog Actually Look Forward to Bath Day?"
- **Subheadline:** "Professional grooming in Walnut Creek — stress-free for your pet, zero hassle for you. Take our 60-second quiz and get a custom plan with upfront pricing."
- Background photo: groomer + dog (warm, professional)
- CTA button: **"Find My Pet's Grooming Plan →"** (scrolls to quiz)

### Block 2: TRUST BAR
Four trust signals in a horizontal strip:
- ⭐ 5-Star Rated on Yelp & Google
- 📍 Walnut Creek, CA
- ✓ Same-Week Appointments
- 🐾 500+ Happy Pets Groomed

### Block 3: BENEFITS (3 cards)
1. **Certified & Experienced** — Trained for all breeds and coat types, from Goldendoodles to Huskies.
2. **Calm, Stress-Free Environment** — Small-batch grooming. Individual attention, not a crowded kennel.
3. **No Surprise Bills** — You'll know the price before you book. Always.

### Block 4: QUIZ
**Header:** "Find the Perfect Grooming Plan for Your Pet"
**Subheader:** "Answer 5 quick questions — we'll recommend the right service and show you an estimated price."

Progress bar shows steps 1–5, then contact form.

| Step | Question | Answer options |
|------|----------|----------------|
| 1 | What type of pet do you have? | 🐕 Dog · 🐈 Cat · 🐾 Other |
| 2 | How big is your pet? | Small (<20 lbs) · Medium (20–50 lbs) · Large (50+ lbs) |
| 3 | What's your pet's coat type? | Short · Medium · Long/Fluffy · Double coat |
| 4 | What services are you looking for? | Bath & Brush · Full Groom (haircut) · Nail Trim · Full Package |
| 5 | When was your pet's last professional groom? | Never · <3 months · 3–6 months · 6+ months |
| 6 | Contact form | Pet's name · Your name · Phone number |

On submit: POST to Make.com webhook, then redirect to `thank-you.html` with URL params:
`?petType=dog&petName=Buddy&size=medium&coat=long&service=full&ownerName=Sarah`

### Block 5: TESTIMONIALS (2–3)
Placeholder cards: photo + pet name + breed + review text. Easy to swap per client.

### Block 6: FOOTER
Phone (tel: link) · Address · Business hours · Instagram · Yelp · Google Maps

---

## 4. Thank-You Page — thank-you.html

Reads URL query params set by the quiz on redirect:
`?petName=Buddy&size=medium&coat=long&service=full&ownerName=Sarah`

### Dynamic content displayed:
```
🐾 Your Grooming Plan is Ready, [petName]!

Based on your [size] [coat] dog, we recommend:
[Service Name]
Estimated price: $[min]–$[max]

Our groomer will call you within 1 hour to confirm your appointment.

[Call Us Now] button → tel:CONFIG.phone
```

### Pricing logic (encoded in JS)

| Size | Short/Medium coat | Long/Double coat |
|------|------------------|-----------------|
| Small (<20 lbs) | $45–65 | $65–85 |
| Medium (20–50 lbs) | $65–85 | $85–110 |
| Large (50+ lbs) | $85–110 | $110–145 |

**Cat / Other pet type fallback:** If `petType` is not "dog", skip the size+coat pricing matrix and show a generic message:
> "We'd love to meet your pet! Our groomer will call you within 1 hour to discuss the best service and give you an exact quote."
Price range is not shown for non-dog pets.

Service name mapping:
- Bath & Brush → "Bath & Brush Package"
- Full Groom → "Full Grooming Package"
- Nail Trim → "Nail Trim Add-On"
- Full Package → "Premium Full-Service Package" (adds $15–20 to base range)

---

## 5. Visual Design

**Style:** Clean & Friendly (Option B)
- Primary color: `#0ea5e9` (sky blue) — configurable via CONFIG
- Background: white / light blue-gray (`#f0f9ff`)
- Typography: system font stack (fast load), large sizes for mobile
- Buttons: rounded pill shape, large tap targets (min 48px height)
- Mobile-first breakpoints: 375px base, 768px tablet, 1024px desktop

---

## 6. Make.com Webhook Payload

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

Make.com scenario structure:
1. Webhook trigger (receives above payload)
2. Branch: Send email to `CONFIG.email` with formatted lead details
3. Branch: Append row to Google Sheet (one column per field)

---

## 7. Resale & Customization Guide (for seller)

Per new client, change in CONFIG:
1. `businessName`
2. `phone`
3. `address` + `hours`
4. `primaryColor` (match client's brand)
5. `webhookUrl` (create new Make.com scenario per client)
6. Social/review links

Swap out:
- Hero background photo (use Unsplash or client's own photo)
- Testimonial placeholder text and photos
- Trust bar count ("500+ Happy Pets" → adjust per client)

Time to customize per client: ~15–20 minutes.

---

## 8. Out of Scope

- CMS or admin panel
- Online booking calendar integration
- Payment processing
- Multi-language support
- Blog or additional pages
