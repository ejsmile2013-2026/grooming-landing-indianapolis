// Vercel Serverless Function — receives form submissions from proposal-us.html
// Sends Telegram notification to owner + (optionally) forwards to Google Sheet webhook
// Env vars required:
//   TG_BOT_TOKEN      — Telegram bot token
//   TG_CHAT_ID        — Telegram chat ID (where notifications go)
//   SHEETS_WEBHOOK_URL — (optional) Google Apps Script /exec URL for Sheet logging

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });

  const data = req.body && typeof req.body === 'object' ? req.body : {};

  const safe = (v) => (v == null || v === '' ? '—' : String(v));
  const lines = [
    '🐾 *New lead — Indianapolis grooming proposal*',
    '',
    `*Source:*       ${safe(data.source)}`,
    `*Name:*         ${safe(data.ownerName)}`,
    `*Email:*        ${safe(data.email)}`,
    `*Phone:*        ${safe(data.phone)}`,
    `*Locations:*    ${safe(data.locations)}`,
    `*Goal:*         ${safe(data.goal)}`,
    `*Inquiries:*    ${safe(data.inquiries)}`,
    `*Message:*      ${safe(data.message)}`,
    `*Language:*     ${safe(data.lang)}`,
    `*Submitted:*    ${new Date().toISOString()}`,
    '',
    'https://grooming-landing-indianapolis.vercel.app/proposal-us.html',
  ];
  const text = lines.join('\n');

  const results = { telegram: null, sheets: null };

  // 1) Telegram notification
  try {
    const token = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;
    if (!token || !chatId) throw new Error('TG_BOT_TOKEN or TG_CHAT_ID not configured');

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });
    const tgJson = await tgRes.json();
    results.telegram = tgJson.ok ? 'sent' : `failed: ${tgJson.description || 'unknown'}`;
  } catch (err) {
    results.telegram = `error: ${err.message}`;
  }

  // 2) Google Sheets (only if SHEETS_WEBHOOK_URL is set)
  try {
    const sheetUrl = process.env.SHEETS_WEBHOOK_URL;
    if (sheetUrl) {
      const sRes = await fetch(sheetUrl, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      results.sheets = sRes.ok ? 'sent' : `failed: HTTP ${sRes.status}`;
    } else {
      results.sheets = 'skipped (SHEETS_WEBHOOK_URL not set yet)';
    }
  } catch (err) {
    results.sheets = `error: ${err.message}`;
  }

  return res.status(200).json({ ok: true, results });
}
