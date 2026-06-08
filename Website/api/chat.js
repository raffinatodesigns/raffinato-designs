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

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getIp(req);
  if (!checkRateLimit(`${ip}:chat`, 10, 60_000)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
  }

  const body = req.body;
  if (!body || !Array.isArray(body.messages)) {
    return res.status(400).json({ error: '`messages` must be an array' });
  }

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: body.system || '',
      messages: body.messages,
    }),
  });

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return res.status(upstream.status).json({
      error: err.error?.message || `Upstream error ${upstream.status}`,
    });
  }

  const data = await upstream.json();
  return res.status(200).json(data);
}
