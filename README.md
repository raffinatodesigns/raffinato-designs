# Raffinato Designs

Pure HTML/CSS/JS website for Raffinato Designs. Deployed via Vercel (static pages) + a Cloudflare Worker that proxies chat requests to the Anthropic API.

---

## Cloudflare Worker — Chat Proxy

The AI chat widget on all pages calls `/api/chat`, which is handled by `worker.js` — a Cloudflare Worker that keeps the Anthropic API key off the client.

### Deploy

**1. Install Wrangler**
```bash
npm install -g wrangler
wrangler login
```

**2. Set your account ID**

Open `wrangler.toml` and replace `YOUR_CLOUDFLARE_ACCOUNT_ID` with your actual Cloudflare account ID (found at dash.cloudflare.com → right sidebar).

**3. Add secrets**
```bash
wrangler secret put ANTHROPIC_API_KEY
# paste your key when prompted
```

**4. Set the CORS origin** (already defaulted in `wrangler.toml` to `https://raffinatodesigns.com` — change if needed)

**5. Deploy**
```bash
wrangler deploy
```

**6. Wire up the route**

In `wrangler.toml`, uncomment the `routes` block and set it to your domain:
```toml
routes = [
  { pattern = "raffinatodesigns.com/api/chat", zone_name = "raffinatodesigns.com" }
]
```
Then redeploy: `wrangler deploy`

---

## Static Site — Vercel

Pushes to `main` auto-deploy via the Vercel + GitHub integration. No build step required.
