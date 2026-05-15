# Raffinato Designs

Pure HTML/CSS/JS website for Raffinato Designs. Deployed via Vercel (static pages) + a Cloudflare Worker that handles the AI chat proxy and contact form submissions.

---

## Cloudflare Worker — Endpoints

The worker (`worker.js`) serves two routes:

| Route | Purpose |
|---|---|
| `POST /api/chat` | Proxies chat messages to the Anthropic API (AI widget) |
| `POST /api/contact` | Validates and submits the contact form, sends emails via Resend |

---

## Deploy

### 1. Install Wrangler
```bash
npm install -g wrangler
wrangler login
```

### 2. Set your account ID

Open `wrangler.toml` and replace `YOUR_CLOUDFLARE_ACCOUNT_ID` with your actual Cloudflare account ID (found at dash.cloudflare.com → right sidebar).

### 3. Add secrets
```bash
wrangler secret put ANTHROPIC_API_KEY
# paste your Anthropic key when prompted

wrangler secret put RESEND_API_KEY
# paste your Resend API key when prompted (get it from resend.com → API Keys)
```

### 4. Verify your sending domain in Resend

Before contact form emails will deliver, you must verify `raffinatodesigns.com` as a sending domain:

1. Go to [resend.com](https://resend.com) → **Domains** → **Add Domain**
2. Enter `raffinatodesigns.com` and follow the DNS verification steps
3. Once verified, the `from` addresses in the worker (`noreply@raffinatodesigns.com` and `designs@raffinatodesigns.com`) will work

> **Temporary workaround:** If you need to test before the domain is verified, swap both `from` addresses in `worker.js` to Resend's sandbox domain (e.g. `onboarding@resend.dev`).

### 5. Set the CORS origin

Already defaulted in `wrangler.toml` to `https://raffinatodesigns.com`. Change if needed.

### 6. Deploy
```bash
wrangler deploy
```

### 7. Wire up routes

In `wrangler.toml`, uncomment the `routes` block — both endpoints live under the same worker:
```toml
routes = [
  { pattern = "raffinatodesigns.com/api/*", zone_name = "raffinatodesigns.com" }
]
```
Then redeploy: `wrangler deploy`

---

## Static Site — Vercel

Pushes to `main` auto-deploy via the Vercel + GitHub integration. No build step required.
