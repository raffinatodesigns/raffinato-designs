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
  const origin = req.headers['origin'] || '';
  const allowed = [
    'https://www.raffinatodesigns.com',
    'https://raffinatodesigns.com',
    process.env.CORS_ORIGIN,
  ].filter(Boolean);
  const use = allowed.includes(origin) ? origin : allowed[0];
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
      <td style="padding:8px 12px;color:#111;border-bottom:1px solid #e5e5e5;">${value || 'N/A'}</td>
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

function confirmationHtml({ fullName }) {
  const firstName = fullName.split(' ')[0];

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Georgia,'Cormorant Garamond',serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.08);overflow:hidden;">

    <!-- Header -->
    <div style="background:#050D1F;padding:40px 20px;text-align:center;">
      <img src="https://www.raffinatodesigns.com/logo2.png" alt="Raffinato Designs" style="max-width:200px;height:auto;display:block;margin:0 auto;">
    </div>

    <!-- Body -->
    <div style="background:#ffffff;padding:40px 40px 30px;">
      <p style="margin:0 0 20px;font-family:Georgia,'Cormorant Garamond',serif;font-size:16px;line-height:1.7;color:#1a1a1a;">Dear ${firstName},</p>
      <p style="margin:0 0 20px;font-family:Georgia,'Cormorant Garamond',serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
        Thank you for reaching out to Raffinato Designs. We have received your consultation request and our team will review it carefully.
      </p>
      <p style="margin:0 0 20px;font-family:Georgia,'Cormorant Garamond',serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
        You can expect to hear back from us within <strong style="font-weight:700;">24 hours</strong>. In the meantime, if you have any additional details to share, feel free to reply to this email.
      </p>
      <p style="margin:0 0 20px;font-family:Georgia,'Cormorant Garamond',serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
        We look forward to bringing your vision to reality.
      </p>
      <p style="margin:0;font-family:Georgia,'Cormorant Garamond',serif;font-size:16px;line-height:1.7;color:#1a1a1a;">
        Warm regards,<br>
        <strong style="font-weight:700;color:#0EA5FF;">The Raffinato Designs Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #e5e5e5;padding:24px 40px;background:#fafafa;text-align:center;">
      <p style="margin:0 0 8px;font-family:Georgia,'Cormorant Garamond',serif;font-size:13px;color:#666;">
        <a href="https://www.instagram.com/raffinato_designs" style="color:#0EA5FF;text-decoration:none;font-size:13px;">@raffinato_designs on Instagram</a>
      </p>
      <p style="margin:0;font-family:Georgia,'Cormorant Garamond',serif;font-size:13px;color:#666;">
        Raffinato Designs LLC &middot; Tennessee, USA &middot;
        <a href="mailto:designs@raffinatodesigns.com" style="color:#0EA5FF;text-decoration:none;">designs@raffinatodesigns.com</a>
      </p>
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
        subject: `New project inquiry from ${fullName} (${businessName})`,
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
        subject: 'Thank You for Reaching Out to Raffinato Designs',
        html: confirmationHtml({ fullName }),
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
