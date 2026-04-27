/// <reference types="node" />

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const {
      full_name,
      product, quantity, company, email, phone,
      country, destination, shipDate, notes,
    } = req.body

    const date = new Date().toISOString()

    const { WASENDER_API_KEY, ADMIN_PHONE, SHEETDB_URL } = process.env

    if (!WASENDER_API_KEY || !ADMIN_PHONE || !SHEETDB_URL) {
      console.error('❌ Missing env variables')
      return res.status(500).json({ error: 'Missing environment variables' })
    }

    // ==========================
    // 1. WHATSAPP
    // ==========================
    const waRes = await fetch('https://wasenderapi.com/api/send-message', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WASENDER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to:   ADMIN_PHONE,
        text: `🔥 NEW QUOTE REQUEST

👤 Name: ${full_name || '—'}
🏢 Company: ${company}
📧 Email: ${email}
📞 Phone: ${phone || '—'}

📦 Product: ${product}
🔢 Quantity: ${quantity}
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
    // 2. GOOGLE SHEETS
    // ==========================
    const sheetRes = await fetch(SHEETDB_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          Date:        date,
          'Full Name': full_name   || '',
          Name:        company,
          Email:       email,
          Phone:       phone       || '',
          Company:     company,
          Product:     product,
          Quantity:    quantity,
          Country:     country,
          Destination: destination || '',
          'Ship Date': shipDate    || '',
          Notes:       notes       || '',
          Status:      'New',
        }
      }),
    })

    const sheetText = await sheetRes.text()
    console.log('📄 SHEET:', sheetRes.status, sheetText)

    if (!sheetRes.ok) {
      throw new Error(`SheetDB failed: ${sheetText}`)
    }

    return res.status(200).json({ success: true })

  } catch (err: any) {
    console.error('🔥 ERROR:', err.message)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}