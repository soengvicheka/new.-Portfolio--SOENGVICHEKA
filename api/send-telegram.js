// ---------------------------------------------------------------------------
// Vercel serverless function — relays contact-form messages to Telegram so the
// bot token never reaches the browser.
//
// Setup (Vercel → Settings → Environment Variables, then REDEPLOY):
//   TELEGRAM_BOT_TOKEN = <your bot token from @BotFather>
//   TELEGRAM_CHAT_ID   = <your personal chat ID, or a group ID the bot is in>
//
// The chat ID must NOT be the bot ID — a bot cannot message itself.
// ---------------------------------------------------------------------------

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED', error: 'Method not allowed.' })
  }

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || ''

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(503).json({
      ok: false,
      code: 'NOT_CONFIGURED',
      error:
        'Telegram is not configured on this deployment. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Vercel → Settings → Environment Variables, then redeploy.',
    })
  }

  let body = {}
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
  } catch {
    return res.status(400).json({ ok: false, code: 'BAD_REQUEST', error: 'Invalid JSON body.' })
  }

  const { name = '', email = '', subject = '', message = '' } = body
  if (![name, email, subject, message].every((v) => String(v).trim())) {
    return res.status(400).json({ ok: false, code: 'BAD_REQUEST', error: 'Missing required fields.' })
  }

  const text = `New contact form message from ${String(name).trim()} (${String(email).trim()})\nSubject: ${String(subject).trim()}\n\n${String(message).trim()}`

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    })
    const data = await response.json().catch(() => ({ ok: false }))

    if (!data.ok) {
      const description = String(data.description || 'Telegram send failed.').toLowerCase()
      if (description.includes('unauthorized')) {
        return res.status(502).json({
          ok: false,
          code: 'INVALID_TOKEN',
          error: 'Telegram rejected the bot token (401 Unauthorized). Check TELEGRAM_BOT_TOKEN.',
        })
      }
      if (description.includes("can't send messages to the bot") || description.includes("bot can't send")) {
        return res.status(502).json({
          ok: false,
          code: 'BOT_SELF_SEND',
          error: 'Telegram bot cannot send to itself. Use a real chat ID or group ID where the bot is a member.',
        })
      }
      return res.status(502).json({ ok: false, code: 'TELEGRAM_ERROR', error: data.description || 'Telegram send failed.' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    return res.status(502).json({ ok: false, code: 'UPSTREAM_ERROR', error: err.message || 'Unable to reach Telegram.' })
  }
}
