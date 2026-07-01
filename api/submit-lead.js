// Vercel Serverless Function — receives form submissions from proposal-us.html
// Sends Telegram notification to owner + (optionally) forwards to Google Sheet webhook
// Env vars required:
//   TG_BOT_TOKEN      — Telegram bot token
//   TG_CHAT_ID        — Telegram chat ID (where notifications go)
//   SHEETS_WEBHOOK_URL — (optional) Google Apps Script /exec URL for Sheet logging

const REGION  = 'Indianapolis / Indiana';
const PROJECT = 'grooming-indianapolis';
const VIEW_LABEL = 'Indianapolis Grooming Proposal';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });

  const data = req.body && typeof req.body === 'object' ? req.body : {};
  const safe = (v) => (v == null || v === '' ? '—' : String(v));
  let text;

  if (data.event === 'proposal_view') {
    // Stamp region/project server-side so they're guaranteed correct downstream.
    data.region  = REGION;
    data.project = PROJECT;

    text = [
      `👀 *Proposal opened — ${VIEW_LABEL}*`,
      '',
      `*Event:*    proposal opened`,
      `*Source:*   ${VIEW_LABEL}`,
      `*Lead:*     ${safe(data.lead)}`,
      `*Page:*     ${safe(data.page)}`,
      `*Region:*   ${REGION}`,
      `*Project:*  ${PROJECT}`,
      `*When:*     ${new Date().toISOString()}`,
    ].join('\n');
  } else {
    // Lead temperature: same scoring as Google Apps Script side, so Telegram + Sheet agree.
    const classifyTemp = (d) => {
      let score = 0;
      if (d.phone && String(d.phone).trim()) score++;
      if (d.locations === '2-3' || d.locations === '4+') score++;
      if (d.goal && String(d.goal).trim()) score++;
      if (d.inquiries === '30-100' || d.inquiries === '100+') score++;
      if (score >= 3) return '🔴 hot';
      if (score === 2) return '🟡 warm';
      return '⚪ cold';
    };
    const temp = classifyTemp(data);

    const lines = [
      `🐾 *New lead — Indianapolis* — ${temp}`,
      '',
      `*Temp:*         ${temp}`,
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
    text = lines.join('\n');
  }

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

  // 2) Google Sheets (only if SHEETS_WEBHOOK_URL is set).
  // Apps Script /exec sometimes 404s on the first request after deploy/idle —
  // single retry after a short pause covers that.
  try {
    const sheetUrl = process.env.SHEETS_WEBHOOK_URL;
    if (sheetUrl) {
      const body = JSON.stringify(data);
      let sRes = await fetch(sheetUrl, { method: 'POST', body, redirect: 'follow' });
      if (!sRes.ok) {
        await new Promise((r) => setTimeout(r, 800));
        sRes = await fetch(sheetUrl, { method: 'POST', body, redirect: 'follow' });
      }
      results.sheets = sRes.ok ? 'sent' : `failed: HTTP ${sRes.status}`;
    } else {
      results.sheets = 'skipped (SHEETS_WEBHOOK_URL not set yet)';
    }
  } catch (err) {
    results.sheets = `error: ${err.message}`;
  }

  return res.status(200).json({ ok: true, results });
}
