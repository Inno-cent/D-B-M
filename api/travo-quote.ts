// NEW FILE — api/travo-quote.ts
//
// Server-side proxy to Travo's quote API. The Travo secret key lives ONLY
// here (env var TRAVO_API_KEY) and is never sent to the browser.
//
// Browser -> POST /api/travo-quote { address, state, weight_kg }
//         <- { quote_id, request_id, amount_kobo, fee_ngn, items, ... }
//
// Env vars needed (Vercel -> Project Settings -> Environment Variables):
//   TRAVO_API_KEY         secret key issued by Travo
//   TRAVO_PICKUP_STREET   e.g. "12 Warehouse Rd, Ikeja, Lagos"
//   TRAVO_PICKUP_LAT      e.g. 6.6018
//   TRAVO_PICKUP_LNG      e.g. 3.3515
//   GOOGLE_MAPS_API_KEY   (recommended) server-side Geocoding API key.
//                         Without it we fall back to OpenStreetMap Nominatim,
//                         which is less accurate for Nigerian street addresses.

import type { VercelRequest, VercelResponse } from '@vercel/node'
import https from 'node:https'

const TRAVO_HOST = 'app.travo.ng'
const TRAVO_PATH = '/v1/service-quotes'
const SERVICE_TYPE = 'ship-a-parcel-or-package-send-parcel'

// [max weight in kg, Travo service id] — Send Parcel bands.
// NOTE: the developer page lists no band between "Up to 1 kg" and
// "2.01 to 2.5 kg". If Travo has a "1.01 to 2 kg" ID, add it here as
// [2, '<id>']; until then 1–2 kg parcels use the 2.5 kg band.
const PARCEL_BANDS: Array<[number, string]> = [
  [1, '32b07dd9-33ba-43d7-b27f-59b76bbc409c'],
  [2.5, 'a82479f9-8d14-4dcb-b5c1-71c9e456d570'],
  [3, '59400ffd-11d2-4768-a9ae-a3d86c9d00ac'],
  [3.5, 'be985ea0-ce91-476e-b6dc-b6c698103131'],
  [4, '34be13dd-2ea2-4246-9bd2-66c98ac33ef7'],
  [4.5, '3c7858ee-f2d7-48c1-95fc-40f3bd382d2c'],
  [5, 'fe4fb778-5eca-40bd-a997-7d4b762e99d2'],
  [5.5, 'f5cd8a17-6723-445f-b77d-db5f3713957d'],
  [6, 'dd0cd7c2-4bb4-4628-9468-bdffb1f8177b'],
  [7, '25d8118e-ebff-4742-8da7-8f9f7abcb142'],
  [8, '45659774-7a31-4994-8ad3-31d8fb2bf8b5'],
  [9, '1860243e-1bdc-4a8f-a50c-84317b4b42e8'],
  [10, 'b61fbb31-2361-4dc3-9b16-cc6735a78cc1'],
  [11, '13e28f94-bf3a-4a14-ab8c-c713d2efed0e'],
  [12, 'ec09a906-f224-4552-9fc7-c00abf2b5a9e'],
  [13, '17269244-6d9c-428d-93b0-1484d1ab33a5'],
  [14, '4414b293-de9b-4911-8e9d-70b674bf270d'],
  [15, '55bbb20d-d50b-44ea-8d45-ff60e33c2cc4'],
  [16, '3d09d256-7520-4cd4-84d5-58007794538b'],
  [17, '4849084b-84ac-491b-84bd-0cba6515dbe3'],
  [18, 'c65b2f67-4987-49e5-9afe-5b65a139a3d8'],
  [19, '3aacbb5b-5be1-4c71-88eb-aae58d21a902'],
  [20, '753f0e94-7c25-4358-bb05-91c598495632'],
  [30, 'df243b05-708c-4088-88c3-af26f39e7c00'],
  [40, 'd89ad206-a7f6-4f34-891d-c88c027ec6bd'],
  [50, '9a3f5e8b-91e4-4b04-ab9a-e35b2f977020'],
]

const serviceForWeight = (kg: number): string | null =>
  PARCEL_BANDS.find(([max]) => kg <= max)?.[1] ?? null

type Coords = [number, number] // [lng, lat] — Travo wants longitude first

// ── Geocoding ──────────────────────────────────────────────────
const geocodeGoogle = async (q: string, key: string): Promise<Coords | null> => {
  const url =
    'https://maps.googleapis.com/maps/api/geocode/json?components=country:NG' +
    `&address=${encodeURIComponent(q)}&key=${key}`
  const r = await fetch(url)
  const j = (await r.json()) as {
    results?: Array<{ geometry: { location: { lat: number; lng: number } } }>
  }
  const loc = j.results?.[0]?.geometry.location
  return loc ? [loc.lng, loc.lat] : null
}

const geocodeNominatim = async (q: string): Promise<Coords | null> => {
  const url =
    'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ng' +
    `&q=${encodeURIComponent(q)}`
  const r = await fetch(url, { headers: { 'User-Agent': 'orenag-checkout/1.0' } })
  const j = (await r.json()) as Array<{ lat: string; lon: string }>
  return j[0] ? [parseFloat(j[0].lon), parseFloat(j[0].lat)] : null
}

const geocode = async (
  address: string,
  state: string,
): Promise<{ coords: Coords; approximate: boolean } | null> => {
  const key = process.env.GOOGLE_MAPS_API_KEY
  const run = (q: string) => (key ? geocodeGoogle(q, key) : geocodeNominatim(q))

  const exact = await run(`${address}, ${state}, Nigeria`)
  if (exact) return { coords: exact, approximate: false }
  // Couldn't find the street — fall back to the state so checkout still works.
  const rough = await run(`${state}, Nigeria`)
  return rough ? { coords: rough, approximate: true } : null
}

// ── Travo call ─────────────────────────────────────────────────
// Travo's quote endpoint is a GET *with a JSON body*. Node's built-in
// fetch() refuses bodies on GET, so we use https.request directly.
const travoGet = (body: unknown, apiKey: string) =>
  new Promise<{ status: number; json: any }>((resolve, reject) => {
    const payload = JSON.stringify(body)
    const req = https.request(
      {
        host: TRAVO_HOST,
        path: TRAVO_PATH,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        timeout: 15000,
      },
      (res) => {
        let raw = ''
        res.on('data', (c) => (raw += c))
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode ?? 500, json: raw ? JSON.parse(raw) : {} })
          } catch {
            resolve({ status: res.statusCode ?? 500, json: { error: raw.slice(0, 200) } })
          }
        })
      },
    )
    req.on('timeout', () => req.destroy(new Error('Travo request timed out')))
    req.on('error', reject)
    req.write(payload)
    req.end()
  })

// ── Handler ────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' })

  // Local dev safety net: some dev servers don't pass .env.local to API
  // functions. Node 20.12+ can load it itself (never overrides variables that
  // are already set, so it is a no-op on Vercel).
  if (!process.env.TRAVO_API_KEY) {
    for (const file of ['.env.local', '.env']) {
      try {
        ;(process as any).loadEnvFile(file)
      } catch {
        /* file missing or unsupported Node — ignore */
      }
    }
  }

  const apiKey = process.env.TRAVO_API_KEY
  const pickupStreet = process.env.TRAVO_PICKUP_STREET
  const pickupLat = parseFloat(process.env.TRAVO_PICKUP_LAT ?? '')
  const pickupLng = parseFloat(process.env.TRAVO_PICKUP_LNG ?? '')
  const missing = [
    !apiKey && 'TRAVO_API_KEY',
    !pickupStreet && 'TRAVO_PICKUP_STREET',
    Number.isNaN(pickupLat) && 'TRAVO_PICKUP_LAT (missing or not a number)',
    Number.isNaN(pickupLng) && 'TRAVO_PICKUP_LNG (missing or not a number)',
  ].filter(Boolean)
  if (missing.length) {
    // Names only, never values. Shown in the server terminal for debugging.
    console.error('travo-quote: env problem ->', missing.join(', '))
    return res.status(500).json({ error: 'Delivery quotes are not configured.' })
  }

  // Vercel's body parser throws on malformed JSON when req.body is read.
  let body: { address?: string; state?: string; weight_kg?: number }
  try {
    body = (req.body ?? {}) as typeof body
  } catch {
    return res.status(400).json({ error: 'Request body must be valid JSON.' })
  }
  const { address, state, weight_kg } = body
  if (!address?.trim() || address.length > 300 || !state?.trim() || state.length > 60) {
    return res.status(422).json({ error: 'Address and state are required.' })
  }
  const kg = Number(weight_kg)
  if (!Number.isFinite(kg) || kg <= 0) {
    return res.status(422).json({ error: 'Invalid parcel weight.' })
  }
  const service = serviceForWeight(kg)
  if (!service) {
    return res
      .status(422)
      .json({
        code: 'TOO_HEAVY',
        error:
          'This order is over 50 kg and needs a custom delivery quote. Please contact us to place it.',
      })
  }

  try {
    const dest = await geocode(address.trim(), state.trim())
    if (!dest) {
      return res.status(422).json({ error: 'We could not locate that address. Please check it.' })
    }

    const travo = await travoGet(
      {
        pickup: {
          street1: pickupStreet,
          location: { type: 'Point', coordinates: [pickupLng, pickupLat] },
        },
        dropoff: {
          street1: address.trim(),
          location: { type: 'Point', coordinates: dest.coords },
        },
        entities: [{ type: 'parcel' }],
        service,
        service_type: SERVICE_TYPE,
        single: true,
      },
      apiKey!,
    )

    if (travo.status >= 400 || typeof travo.json.amount !== 'number') {
      console.error('Travo quote failed', travo.status, JSON.stringify(travo.json))
      return res.status(502).json({ error: 'Could not get a delivery quote right now.' })
    }

    const q = travo.json
    return res.status(200).json({
      quote_id: q.id,
      request_id: q.request_id ?? null,
      amount_kobo: q.amount,
      fee_ngn: Math.ceil(q.amount / 100), // whole naira, rounded up
      items: q.items ?? [],
      weight_kg: kg,
      approximate_location: dest.approximate,
    })
  } catch (e) {
    console.error('travo-quote error', e)
    return res.status(502).json({ error: 'Could not get a delivery quote right now.' })
  }
}
