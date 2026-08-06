import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Vercel parses JSON bodies by default, but signature verification needs
// the exact raw bytes Paystack signed — parsing first would change
// whitespace/key order and break the HMAC comparison. So we disable the
// built-in parser and read the raw body ourselves.
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.webhook.local') })
export const config = {
  api: {
    bodyParser: false,
  },
}

const readRawBody = (req: VercelRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

// Service-role client — bypasses RLS. This must NEVER be used in
// frontend code; it only exists here because this file runs
// server-side on Vercel, never in the browser.
console.log('DEBUG — SUPABASE_URL is:', process.env.SUPABASE_URL)
console.log(
  'DEBUG keys:',
  Object.keys(process.env).filter((k) => k.includes('SUPABASE')),
)
console.log('DEBUG SUPABASE_URL value:', JSON.stringify(process.env.SUPABASE_URL))

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL as string,
  (process.env.SUPABASE_SERVICE_KEY ?? process.env.LOCAL_SUPABASE_SERVICE_KEY) as string,
)

interface PaystackChargeSuccessData {
  reference: string
  amount: number
  status: string
  metadata?: {
    order_id?: string
    order_ref?: string
  }
}

interface PaystackWebhookPayload {
  event: string
  data: PaystackChargeSuccessData
}

const notifyAdminWhatsApp = async (message: string) => {
  const apiKey = process.env.WASENDER_API_KEY
  const adminNumber = process.env.ADMIN_PHONE
  if (!apiKey || !adminNumber) return // optional — skip silently if not configured

  try {
    await fetch('https://wasenderapi.com/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        to: adminNumber,
        text: message,
      }),
    })
  } catch (err) {
    console.error('Wasender notification failed:', err)
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    console.error('PAYSTACK_SECRET_KEY is not set')
    return res.status(500).json({ error: 'Server misconfigured' })
  }

  const rawBody = await readRawBody(req)
  
   // important detail
  // Verify this request genuinely came from Paystack. Paystack signs the
  // raw request body with your secret key using HMAC-SHA512 and sends the
  // result in the x-paystack-signature header. If it doesn't match, this
  // is not a real Paystack request — reject it.
  const expectedSignature = crypto.createHmac('sha512', secret).update(rawBody).digest('hex')

  const receivedSignature = req.headers['x-paystack-signature']

  if (receivedSignature !== expectedSignature) {
    console.error('Paystack webhook signature mismatch — request rejected')
    return res.status(401).json({ error: 'Invalid signature' })
  }

  let payload: PaystackWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' })
  }

  // Only act on successful charges — ignore all other event types
  // (Paystack sends many: transfer events, subscription events, etc.)
  if (payload.event !== 'charge.success') {
    return res.status(200).json({ received: true, ignored: payload.event })
  }

  const { data } = payload
  const orderId = data.metadata?.order_id
  const orderRef = data.metadata?.order_ref ?? data.reference

  if (!orderId && !orderRef) {
    console.error('Webhook payload missing both order_id and order_ref/reference')
    return res.status(400).json({ error: 'Missing order identifier' })
  }

  // Prefer matching by order_id (direct primary key, unambiguous).
  // Fall back to ref if metadata was somehow missing it.
  const query = supabaseAdmin.from('orders').update({
    payment_status: 'paid',
    order_status: 'confirmed',
    paystack_ref: data.reference,
    paystack_data: data,
  })

  const { data: updated, error } = orderId
    ? await query.eq('id', orderId).select().single()
    : await query.eq('ref', orderRef).select().single()

  if (error) {
    console.error('Failed to update order from webhook:', error)
    return res.status(500).json({ error: 'Failed to update order' })
  }

  await notifyAdminWhatsApp(
    `✅ Payment received for order ${updated.ref} — ₦${(data.amount / 100).toLocaleString()}`,
  )

  return res.status(200).json({ received: true, order: updated.ref })
}
