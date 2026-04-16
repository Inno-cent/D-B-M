/// <reference types="node" />

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { product, quantity, company, email, phone, country, destination, shipDate, notes } =
      req.body

    const date = new Date().toISOString()

    // ==========================
    // ENV VARIABLES CHECK
    // ==========================
    const { WASENDER_API_KEY, ADMIN_PHONE, SHEETDB_URL } = process.env

    if (!WASENDER_API_KEY || !ADMIN_PHONE || !SHEETDB_URL) {
      console.error('❌ Missing env variables')
      return res.status(500).json({ error: 'Missing environment variables' })
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
        to: ADMIN_PHONE,
        text: `🔥 NEW QUOTE

📦 Product: ${product}
🔢 Quantity: ${quantity}

👤 Name: ${company}
📧 Email: ${email}
📞 Phone: ${phone || '—'}

🏢 Company: ${company}

🌍 Country: ${country}
🚚 Destination: ${destination || '—'}
📅 Ship Date: ${shipDate || '—'}

📝 Notes: ${notes || '—'}
`,
      }),
    })

    const waText = await waRes.text()
    console.log('📲 WHATSAPP RESPONSE:', waRes.status, waText)

    if (!waRes.ok) {
      throw new Error(`WhatsApp failed: ${waText}`)
    }

    // ==========================
    // 2. GOOGLE SHEETS (SheetDB)
    // ==========================
    const sheetRes = await fetch(SHEETDB_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Date: date,
        Name: company,
        Email: email,
        Phone: phone,
        Company: company,
        Product: product,
        Quantity: quantity,
        Country: country,
        Destination: destination,
        'Ship Date': shipDate,
        Notes: notes,
        Status: 'New',
      }),
    })

    const sheetText = await sheetRes.text()
    console.log('📄 SHEET RESPONSE:', sheetRes.status, sheetText)

    if (!sheetRes.ok) {
      throw new Error(`SheetDB failed: ${sheetText}`)
    }

    // ==========================
    // SUCCESS
    // ==========================
    return res.status(200).json({
      success: true,
      message: 'Quote sent successfully',
    })
  } catch (err: any) {
    console.error('🔥 ERROR:', err.message)

    return res.status(500).json({
      error: err.message || 'Internal Server Error',
    })
  }
}
