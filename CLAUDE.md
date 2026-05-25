# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Business Overview
Raffinato Designs is a premium web design business serving US small businesses. We build done-for-you, conversion-focused websites. Clients need zero technical knowledge.

- **Tagline:** Bringing Your Vision to Reality
- **Location:** Tennessee, USA
- **Contact:** designs@raffinatodesigns.com
- **Domain:** raffinatodesigns.com

## Packages
Setup fee + monthly (monthly covers hosting and upkeep). All prices USD.
- **Basic "Starter Presence":** $199 setup + $19.99/mo
- **Pro "Growth Engine" (most popular):** $499 setup + $49.99/mo
- **Premium "Total Domination":** $999 setup + $99.99/mo
- **Website Remodel:** Custom quote

## Deployment
No build step. Push to GitHub, Vercel auto-deploys within ~30 seconds.

```
git add .
git commit -m "describe the change"
git push
```

Test on the live site after deploy. Hosted on **Vercel**, DNS at **GoDaddy**. NOT using Cloudflare — do not reintroduce it.

## Tech Stack
- Static HTML/CSS/JS, no framework, no bundler
- Three main pages: `index.html`, `work.html`, `contact.html`
- API backend: Vercel Serverless Functions in `/api/`
  - `/api/chat.js` — Anthropic proxy for the AI chat widget. Uses `ANTHROPIC_API_KEY`. Model: `claude-sonnet-4-20250514`. Rate limited: 10 req/min per IP.
  - `/api/contact.js` — Contact form handler via Resend. Uses `RESEND_API_KEY`. Rate limited: 3 req per 10 min per IP. Has honeypot field (`_gotcha`).
- Env vars set in Vercel dashboard: `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `CORS_ORIGIN`

## Shared Elements (No Components — Copy-Paste Architecture)
The three pages (`index.html`, `work.html`, `contact.html`) each contain the full nav, footer, and AI chat widget as inline HTML/CSS/JS. There are no shared component files. When changing any shared element, you must update all three files by hand.

The **AI chat widget** system prompt is hardcoded inside each page's `<script>` block (look for `const SYSTEM = ...`). It covers packages, pricing, process, and response rules. Update it consistently across all three pages when package details change.

## Brand / Design Tokens (Raffinato site only)
The main site uses these tokens — case studies have their own independent palettes.
- **Colors:** navy `#050D1F`, electric blue `#0EA5FF`, chalk `#F0F4F8`, chrome `#C8D4E0`
- **CSS variables:** `--navy`, `--electric`, `--chalk`, `--chrome`, `--glow`, `--dark-border`
- **Fonts:** Bebas Neue (display headings), Cormorant Garamond (italic serif accents), Jost (UI text)
- **Custom cursor:** Two-element cursor (`#cursor-dot`, `#cursor-ring`) with LERP animation. Disabled on touch devices via `@media (hover: none), (pointer: coarse)` — keep it that way.
- **Page transitions:** Outbound internal links fade the body to opacity 0 before navigating.

## Conventions
- Always use CSS variables, never raw hex values.
- Never expose API keys client-side. All sensitive calls go through `/api/`.
- Form inputs have custom autofill styling to match the dark theme — preserve it on the contact form.
- Package "Get Started" CTAs deep-link to the contact form with the matching package radio pre-selected via URL param.
- **No em dashes or en dashes in copy** — they read as AI-generated. Use commas, periods, or restructure. Hyphens in compound words (done-for-you, 24/7) are fine. `&ndash;` in hours tables is acceptable.

## Voice
Confident, direct, results-focused. Premium but accessible. Keep copy tight.

## Work Portfolio (`work.html`)

### How the grid works
Cards are hardcoded `<div class="card">` elements in the `#portfolio-grid`. Each card has:
- `data-category` — filters: `restaurant`, `retail`, `professional`, `fitness`
- `data-name` — display name
- `data-desc` — lightbox description
- `data-url` — path to the case study (e.g. `/work/solano-bakery/`). When set, clicking opens the case study in a new tab instead of the lightbox.

Card CSS background images are set per `nth-child` index in the stylesheet. When adding a new card, add a new `.card:nth-child(N) .card-preview` rule with an appropriate Unsplash photo.

### Adding a new case study
1. Create `work/{slug}/index.html` — a fully self-contained HTML file with its own palette, fonts, and sections (see existing case studies for structure).
2. Add a `<div class="card" ...>` entry in `work.html`'s `#portfolio-grid` with the appropriate `data-category` and `data-url`.
3. Add a matching `nth-child` CSS rule for the card's preview background image.
4. Update `sitemap.xml` to include the new case study URL.

### Case study design conventions
Each case study is completely standalone — its own Google Fonts, CSS variables, palette, and JS. They do NOT use the Raffinato brand palette. Design conventions:

- Fully self-contained HTML/CSS/JS (no external stylesheets or scripts beyond Google Fonts)
- All images from Unsplash with `auto=format&fit=crop&w=...&q=80` parameters
- Fixed nav with scroll-triggered background (`scrolled` class via `IntersectionObserver` or `scroll` event)
- Scroll-reveal animations via `IntersectionObserver` (`.rv` + `.visible` pattern with staggered `.d1`–`.d6` delay classes)
- Staggered card reveals for grid sections
- Mobile hamburger menu with full-screen overlay
- `prefers-reduced-motion` media query disabling animations
- Footer credit: `Website concept by <a href="https://www.raffinatodesigns.com">Raffinato Designs</a>`
- No em dashes or en dashes in prose copy

## SEO
- `sitemap.xml` and `robots.txt` are in the project root. Sitemap lists all pages including case studies.
- `robots.txt` disallows `/api/`.
- Site is registered in Google Search Console.
