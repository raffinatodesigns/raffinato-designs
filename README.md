# Raffinato Designs

Pure HTML/CSS/JS website for Raffinato Designs. Deployed via Vercel (static pages + serverless functions).

---

## Vercel Serverless Functions — Endpoints

Functions live in `/api/`. Vercel auto-routes them to their matching path.

| File | Route | Purpose |
|---|---|---|
| `api/chat.js` | `POST /api/chat` | Proxies chat messages to the Anthropic API (AI widget) |
| `api/contact.js` | `POST /api/contact` | Validates and submits the contact form, sends emails via Resend |

---

## Deploy

### 1. Push to GitHub

Pushes to `main` auto-deploy via the Vercel + GitHub integration. No build step required.

### 2. Add environment variables in Vercel

Go to **Vercel dashboard → raffinato-designs project → Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `RESEND_API_KEY` | Your Resend API key (resend.com → API Keys) |
| `CORS_ORIGIN` | `https://raffinatodesigns.com` |

Set all three for **Production**, **Preview**, and **Development** environments.

### 3. Verify your sending domain in Resend

Before contact form emails will deliver, verify `raffinatodesigns.com` as a sending domain:

1. Go to [resend.com](https://resend.com) → **Domains** → **Add Domain**
2. Enter `raffinatodesigns.com` and follow the DNS verification steps
3. Once verified, the `from` addresses (`noreply@raffinatodesigns.com` and `designs@raffinatodesigns.com`) will work

> **Temporary workaround:** If you need to test before the domain is verified, swap both `from` addresses in `api/contact.js` to Resend's sandbox domain (e.g. `onboarding@resend.dev`).

---

## Static Site

All `.html` files are served as static pages by Vercel. No framework, no build step.

---

## Deprecated — Cloudflare Worker (no longer used)

`worker.js` and `wrangler.toml` are kept for reference but are no longer used. The Worker has been replaced by the Vercel serverless functions above. The `wrangler deploy` instructions below are no longer applicable.

<details>
<summary>Old Cloudflare Worker deploy instructions (archived)</summary>

The worker (`worker.js`) previously served two routes:
- `POST /api/chat` — AI chat proxy
- `POST /api/contact` — contact form handler

Deploy required:
```bash
npm install -g wrangler
wrangler login
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put RESEND_API_KEY
wrangler deploy
```

</details>
