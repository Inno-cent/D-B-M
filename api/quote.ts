/// <reference types="node" />
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const {
      product, quantity, company, email, phone,
      country, destination, shipDate, notes,
      user_id,
    } = req.body

    const date = new Date().toISOString()

    const {
      WASENDER_API_KEY,
      ADMIN_PHONE,
      SHEETDB_URL,
      SUPABASE_URL,
      SUPABASE_SERVICE_KEY,
    } = process.env

    if (!WASENDER_API_KEY || !ADMIN_PHONE || !SHEETDB_URL) {
      console.error('❌ Missing env variables')
      return res.status(500).json({ error: 'Missing environment variables' })
    }

    // ==========================
    // 0. SUPABASE (if keys exist)
    // ==========================
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        await supabase.from('quote_requests').insert({
          user_id:              user_id              || null,
          company_name:         company,
          email,
          phone:                phone                || null,
          product,
          quantity,
          buyer_country:        country,
          delivery_destination: destination          || null,
          ship_date:            shipDate             || null,
          notes:                notes                || null,
          status:               'pending',
        })
        console.log('✅ Supabase insert successful')
      } catch (supaErr: any) {
        console.warn('⚠️ Supabase insert failed (non-critical):', supaErr.message)
      }
    }

    // ==========================
    // 1. WHATSAPP (WasenderAPI)
    // ==========================
    const waRes = await fetch('https://wasenderapi.com/api/send-message', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WASENDER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to:   ADMIN_PHONE,
        text: `🔥 NEW QUOTE

📦 Product: ${product}
🔢 Quantity: ${quantity}

👤 Company: ${company}
📧 Email: ${email}
📞 Phone: ${phone || '—'}

🌍 Country: ${country}
🚚 Destination: ${destination || '—'}
📅 Ship Date: ${shipDate || '—'}

📝 Notes: ${notes || '—'}
`,
      }),
    })

    const waText = await waRes.text()
    console.log('📲 WHATSAPP:', waRes.status, waText)

    if (!waRes.ok) {
      throw new Error(`WhatsApp failed: ${waText}`)
    }

    // ==========================
    // 2. GOOGLE SHEETS (SheetDB)
    // ==========================
    const sheetRes = await fetch(SHEETDB_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          Date:        date,
          Name:        company,
          Email:       email,
          Phone:       phone        || '',
          Company:     company,
          Product:     product,
          Quantity:    quantity,
          Country:     country,
          Destination: destination  || '',
          'Ship Date': shipDate     || '',
          Notes:       notes        || '',
          Status:      'New',
        }
      }),
    })

    const sheetText = await sheetRes.text()
    console.log('📄 SHEET:', sheetRes.status, sheetText)

    if (!sheetRes.ok) {
      throw new Error(`SheetDB failed: ${sheetText}`)
    }

    return res.status(200).json({ success: true, message: 'Quote sent successfully' })

  } catch (err: any) {
    console.error('🔥 ERROR:', err.message)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}