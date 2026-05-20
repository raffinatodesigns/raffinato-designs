# Raffinato Designs — Project Context

## Business Overview
Raffinato Designs is a premium web design business serving US small businesses. We build done-for-you, conversion-focused websites. Clients need zero technical knowledge — we handle design, build, hosting, security, and launch. They share their vision; we deliver a finished site.

- **Tagline:** Bringing Your Vision to Reality
- **Location:** Tennessee, USA
- **Contact email:** designs@raffinatodesigns.com
- **Instagram:** https://www.instagram.com/raffinato_designs
- **Facebook:** https://www.facebook.com/profile.php?id=61569265648588
- **Domain:** raffinatodesigns.com

## Packages
Setup fee + monthly (monthly covers hosting and upkeep). All prices USD.
- **Basic — "Starter Presence":** $199 setup + $19.99/mo. Custom design, mobile responsive, fast hosting, contact form, SSL.
- **Pro — "Growth Engine" (most popular):** $499 setup + $49.99/mo. Everything in Basic, plus SEO, analytics dashboard, booking/CRM integration, priority support.
- **Premium — "Total Domination":** $999 setup + $99.99/mo. Everything in Pro, plus e-commerce, custom functionality, advanced SEO + content, 24/7 support.
- **Website Remodel:** Custom quote. Full redesign, content migration, speed optimization, SEO audit + fixes.

## Tech Stack
- Static HTML/CSS/JS site, no framework.
- Three pages: index.html, work.html, contact.html
- Hosted on **Vercel**, auto-deploys on push to the main branch via GitHub.
- Domain registered at **GoDaddy**, DNS pointed to Vercel.
- NOT using Cloudflare (was removed — do not reintroduce).

## API Backend (Vercel Serverless Functions, in /api/)
- **/api/chat.js** — Anthropic chat proxy for the site's AI chat widget. Uses env var ANTHROPIC_API_KEY. Model: claude-sonnet-4-20250514. Has per-IP rate limiting (10/min).
- **/api/contact.js** — Contact form handler. Uses env var RESEND_API_KEY. Sends two emails via Resend: a notification to designs@raffinatodesigns.com and a branded confirmation to the user. Per-IP rate limiting (3 per 10 min). Honeypot spam field (_gotcha).
- Env vars are set in the Vercel dashboard (Settings > Environment Variables): ANTHROPIC_API_KEY, RESEND_API_KEY, CORS_ORIGIN (https://raffinatodesigns.com).
- Resend sending domain raffinatodesigns.com is verified (DKIM/SPF).

## Brand / Design Tokens
- **Colors:** navy `#050D1F`, electric blue `#0EA5FF`, chalk/off-white `#f5f5f5`. CSS variables: --navy, --electric, --chalk.
- **Fonts:** Bebas Neue (display headings), Cormorant Garamond (serif body / emails), Jost (UI text).
- **Voice:** Confident, direct, results-focused. Premium but accessible.
- **No em dashes or en dashes** in copy — they read as AI-generated. Use commas, periods, or restructure. Hyphens in compound words (done-for-you, mobile-responsive, 24/7) are fine.

## Conventions
- The three pages share a nav, footer, and chat widget. When changing a shared element, apply the change consistently across all three files.
- Always use CSS variables (--navy, --electric, --chalk), never raw hex.
- Never expose API keys client-side. All sensitive calls go through /api/.
- Custom cursor is disabled on touch devices (mobile) — keep it that way.
- Form inputs have custom autofill styling so browser autofill matches the dark theme — preserve it.
- Package CTAs ("Get Started") deep-link to the contact form with the matching package radio pre-selected via URL param.

## Deployment Workflow
After making changes:
```
git add .
git commit -m "describe the change"
git push
```
Vercel auto-deploys within ~30 seconds. Test on the live site after deploy.

## SEO Notes
- sitemap.xml and robots.txt live in the project (root or /public). Sitemap lists all 3 pages.
- robots.txt disallows /api/.
- Site is registered in Google Search Console. Working on getting pages indexed (new domain, building backlinks).
