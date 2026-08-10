// TEMPORARY diagnostic script — loads .env values, invokes api/send-telegram.js
// handler locally with a mock req/res, and reports the outcome WITHOUT printing secrets.
import fs from 'node:fs'

const env = {}
for (const line of fs.readFileSync('.env', 'utf8').split('\n')) {
  const m = line.match(/^\s*(?:export\s+)?([A-Za-z0-9_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
}

process.env.TELEGRAM_BOT_TOKEN = env.VITE_TELEGRAM_BOT_TOKEN || ''
process.env.TELEGRAM_CHAT_ID = env.VITE_TELEGRAM_CHAT_ID || ''

console.log('token present locally:', process.env.TELEGRAM_BOT_TOKEN.length > 0)
console.log('chat id present locally:', process.env.TELEGRAM_CHAT_ID.length > 0)
console.log('chat id == bot id (bot sending to itself?):', process.env.TELEGRAM_CHAT_ID === process.env.TELEGRAM_BOT_TOKEN.split(':')[0])

const { default: handler } = await import('../api/send-telegram.js')

const req = {
  method: 'POST',
  body: {
    name: 'Diagnostic test',
    email: 'test@example.com',
    subject: 'Vercel fix check',
    message: 'This is an automatic test message to verify the Telegram relay works.',
  },
}

const res = {
  statusCode: 200,
  headers: {},
  setHeader(k, v) {
    this.headers[k] = v
  },
  status(c) {
    this.statusCode = c
    return this
  },
  json(obj) {
    this.body = obj
  },
  end() {},
}

await handler(req, res)
console.log('RESULT status:', res.statusCode, '| ok:', res.body?.ok, '| code:', res.body?.code)
console.log('RESULT message:', res.body?.error || 'success — check your Telegram!')
