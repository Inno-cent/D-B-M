import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const {
    full_name,
    company,
    email,
    phone,
    product,
    quantity,
    country,
    destination,
    shipDate,
    notes,
  } = req.body

  if (!product || !company || !email || !quantity || !country) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const date        = new Date().toLocaleString('en-GB')
  const results: Record<string, string> = {}
  let   atLeastOne  = false

  const {
    WASENDER_API_KEY,
    ADMIN_PHONE,
    SHEETDB_URL,
  } = process.env

  // ── 1. WHATSAPP ─────────────────────────────────────────────
  if (WASENDER_API_KEY && ADMIN_PHONE) {
    try {
      const waRes = await fetch('https://wasenderapi.com/api/send-message', {
        method:  'POST',
        headers: {
          Authorization: `Bearer ${WASENDER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to:   ADMIN_PHONE,
          text: `🔥 NEW QUOTE REQUEST — DualMarket

👤 Name:       ${full_name  || '—'}
🏢 Company:    ${company}
📧 Email:      ${email}
📞 Phone:      ${phone      || '—'}

📦 Product:    ${product}
🔢 Quantity:   ${quantity}
🌍 Country:    ${country}
🚚 Destination:${destination || '—'}
📅 Ship Date:  ${shipDate    || '—'}

📝 Notes: ${notes || '—'}

🕐 ${date}`,
        }),
      })

      const waText = await waRes.text()
      console.log('📲 WhatsApp:', waRes.status, waText)

      if (waRes.ok) {
        results.whatsapp = 'success'
        atLeastOne = true
      } else {
        results.whatsapp = `failed (${waRes.status}): ${waText}`
        console.warn('WhatsApp failed:', waText)
      }
    } catch (e: any) {
      results.whatsapp = `error: ${e.message}`
      console.warn('WhatsApp error:', e.message)
    }
  } else {
    results.whatsapp = 'skipped — env vars not set'
  }

  // ── 2. GOOGLE SHEETS ────────────────────────────────────────
  if (SHEETDB_URL) {
    try {
      const sheetRes = await fetch(SHEETDB_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            Date:         date,
            'Full Name':  full_name    || '',
            Company:      company      || '',
            Email:        email        || '',
            Phone:        phone        || '',
            Product:      product      || '',
            Quantity:     quantity     || '',
            Country:      country      || '',
            Destination:  destination  || '',
            'Ship Date':  shipDate     || '',
            Notes:        notes        || '',
            Status:       'New',
          }
        }),
      })

      const sheetText = await sheetRes.text()
      console.log('📄 Sheets:', sheetRes.status, sheetText)

      if (sheetRes.ok) {
        results.sheets = 'success'
        atLeastOne = true
      } else {
        results.sheets = `failed (${sheetRes.status}): ${sheetText}`
        console.warn('Sheets failed:', sheetText)
      }
    } catch (e: any) {
      results.sheets = `error: ${e.message}`
      console.warn('Sheets error:', e.message)
    }
  } else {
    results.sheets = 'skipped — SHEETDB_URL not set'
  }

  // ── Respond ─────────────────────────────────────────────────
  // Success as long as at least one channel worked
  // Supabase handles the actual data — this is just notifications
  console.log('📊 Notification results:', results)
  return res.status(200).json({ success: true, results })
}