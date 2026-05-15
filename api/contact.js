const rateLimitStore = new Map();

function checkRateLimit(key, limit, windowMs) {
  const now = Date.now();
  let entry = rateLimitStore.get(key);
  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
  }
  entry.count++;
  rateLimitStore.set(key, entry);
  return entry.count <= limit;
}

function getIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

function setCors(req, res) {
  const allowed = process.env.CORS_ORIGIN || '';
  const origin = req.headers['origin'] || '';
  const use = origin === allowed ? origin : allowed;
  res.setHeader('Access-Control-Allow-Origin', use);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function cap(str, max) {
  return String(str || '').trim().slice(0, max);
}

function notificationHtml({ fullName, businessName, email, phone, businessType, projectDetails, pkg, howHeard, ip, timestamp }) {
  const row = (label, value) => `
    <tr>
      <td style="padding:8px 12px;font-weight:600;color:#444;background:#f9f9f9;width:160px;border-bottom:1px solid #e5e5e5;">${label}</td>
      <td style="padding:8px 12px;color:#111;border-bottom:1px solid #e5e5e5;">${value || '—'}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border:1px solid #e0e0e0;">
    <div style="background:#050D1F;padding:24px 28px;">
      <h1 style="margin:0;color:#0EA5FF;font-size:1.1rem;letter-spacing:0.1em;text-transform:uppercase;">New Project Inquiry</h1>
    </div>
    <div style="padding:28px;">
      <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
        ${row('Full Name', fullName)}
        ${row('Business Name', businessName)}
        ${row('Email', `<a href="mailto:${email}" style="color:#0EA5FF;">${email}</a>`)}
        ${row('Phone', phone)}
        ${row('Business Type', businessType)}
        ${row('Package Interest', pkg)}
        ${row('How They Found Us', howHeard)}
        ${row('Submitted', timestamp)}
        ${row('Submitter IP', ip)}
      </table>
      <div style="margin-top:24px;padding:16px;background:#f9f9f9;border-left:3px solid #0EA5FF;">
        <p style="margin:0 0 6px;font-weight:600;color:#444;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.08em;">Project Details</p>
        <p style="margin:0;color:#111;font-size:0.9rem;line-height:1.6;white-space:pre-wrap;">${projectDetails}</p>
      </div>
      <p style="margin:20px 0 0;font-size:0.8rem;color:#999;">Reply directly to this email to respond to ${fullName}.</p>
    </div>
  </div>
</body>
</html>`;
}

function confirmationHtml({ fullName, pkg, projectDetails }) {
  const firstName = fullName.split(' ')[0];
  const packageLabel = {
    basic: 'Basic — Starter Presence ($199 setup + $19.99/mo)',
    pro: 'Pro — Growth Engine ($499 setup + $49.99/mo)',
    premium: 'Premium — Total Domination ($999 setup + $99.99/mo)',
    remodel: 'Website Remodel (custom quote)',
    unsure: 'Not sure yet',
  }[pkg] || pkg;

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border:1px solid #e0e0e0;">
    <div style="background:#050D1F;padding:28px;">
      <h1 style="margin:0;color:#0EA5FF;font-size:1.2rem;letter-spacing:0.08em;text-transform:uppercase;">Raffinato Designs</h1>
      <p style="margin:6px 0 0;color:#8ab4cc;font-size:0.85rem;">Premium Web Design for Ambitious Businesses</p>
    </div>
    <div style="padding:32px 28px;">
      <h2 style="margin:0 0 16px;color:#050D1F;font-size:1.3rem;">Hey ${firstName}, we got your project details.</h2>
      <p style="margin:0 0 20px;color:#444;font-size:0.95rem;line-height:1.7;">
        Thanks for reaching out — you're in the right place. Our team will review your submission and be in touch within <strong>24 hours</strong> to talk next steps.
      </p>
      <div style="background:#f7fbff;border:1px solid #d0eaff;padding:20px 24px;margin-bottom:24px;">
        <p style="margin:0 0 12px;font-size:0.78rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#0EA5FF;">What You Submitted</p>
        <table style="width:100%;border-collapse:collapse;font-size:0.88rem;">
          <tr>
            <td style="padding:5px 0;color:#666;width:130px;">Package</td>
            <td style="padding:5px 0;color:#050D1F;font-weight:600;">${packageLabel}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#666;vertical-align:top;">Your summary</td>
            <td style="padding:5px 0;color:#050D1F;line-height:1.6;">${projectDetails}</td>
          </tr>
        </table>
      </div>
      <p style="margin:0 0 8px;color:#444;font-size:0.95rem;line-height:1.7;">
        In the meantime, if anything changes or you want to add more detail, just reply to this email or reach us at:
      </p>
      <p style="margin:0 0 28px;">
        <a href="mailto:designs@raffinatodesigns.com" style="color:#0EA5FF;font-weight:600;font-size:0.95rem;">designs@raffinatodesigns.com</a>
      </p>
      <p style="margin:0;color:#444;font-size:0.95rem;line-height:1.7;">Talk soon,<br>
        <strong style="color:#050D1F;">The Raffinato Designs Team</strong>
      </p>
    </div>
    <div style="background:#050D1F;padding:16px 28px;text-align:center;">
      <p style="margin:0;color:#4a6a80;font-size:0.75rem;letter-spacing:0.06em;">© 2025 Raffinato Designs LLC — raffinatodesigns.com</p>
    </div>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getIp(req);
  if (!checkRateLimit(`${ip}:contact`, 3, 600_000)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const body = req.body;
  if (!body) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  // Honeypot — silently succeed so bots don't learn
  if (body._gotcha) {
    return res.status(200).json({ success: true });
  }

  const fullName       = cap(body.fullName, 100);
  const businessName   = cap(body.businessName, 100);
  const email          = cap(body.email, 100);
  const phone          = cap(body.phone, 100);
  const businessType   = cap(body.businessType, 100);
  const projectDetails = cap(body.projectDetails, 500);
  const pkg            = cap(body.package, 50) || 'unsure';
  const howHeard       = cap(body.howHeard, 100);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const VALID_PACKAGES = ['basic', 'pro', 'premium', 'remodel', 'unsure'];

  if (!fullName)       return res.status(400).json({ error: 'fullName is required' });
  if (!businessName)   return res.status(400).json({ error: 'businessName is required' });
  if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ error: 'Valid email is required' });
  if (!phone)          return res.status(400).json({ error: 'phone is required' });
  if (!businessType)   return res.status(400).json({ error: 'businessType is required' });
  if (!projectDetails) return res.status(400).json({ error: 'projectDetails is required' });
  if (!VALID_PACKAGES.includes(pkg)) return res.status(400).json({ error: 'Invalid package value' });

  const timestamp = new Date().toUTCString();

  const resendHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
  };

  const [notifResult, confirmResult] = await Promise.allSettled([
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: resendHeaders,
      body: JSON.stringify({
        from: 'Raffinato Designs <noreply@raffinatodesigns.com>',
        to: ['designs@raffinatodesigns.com'],
        reply_to: email,
        subject: `New project inquiry — ${fullName} (${businessName})`,
        html: notificationHtml({ fullName, businessName, email, phone, businessType, projectDetails, pkg, howHeard, ip, timestamp }),
      }),
    }).then(async r => ({ ok: r.ok, status: r.status, body: await r.json().catch(() => ({})) })),

    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: resendHeaders,
      body: JSON.stringify({
        from: 'Raffinato Designs <designs@raffinatodesigns.com>',
        to: [email],
        reply_to: 'designs@raffinatodesigns.com',
        subject: 'We got your project details — Raffinato Designs',
        html: confirmationHtml({ fullName, pkg, projectDetails }),
      }),
    }).then(async r => ({ ok: r.ok, status: r.status, body: await r.json().catch(() => ({})) })),
  ]);

  const notifOk   = notifResult.status === 'fulfilled' && notifResult.value.ok;
  const confirmOk = confirmResult.status === 'fulfilled' && confirmResult.value.ok;

  if (!notifOk) {
    const detail = notifResult.status === 'fulfilled' ? notifResult.value.body : notifResult.reason;
    console.log('[contact] notification email failed:', JSON.stringify(detail));
    return res.status(502).json({ error: 'Email delivery failed' });
  }

  if (!confirmOk) {
    const detail = confirmResult.status === 'fulfilled' ? confirmResult.value.body : confirmResult.reason;
    console.log('[contact] confirmation email failed:', JSON.stringify(detail));
  }

  return res.status(200).json({ success: true });
}
