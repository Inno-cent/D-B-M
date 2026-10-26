// NEW FILE — src/services/travoService.ts
// Browser-side wrapper for /api/travo-quote (which holds the Travo secret).

export interface TravoQuote {
  quote_id: string
  request_id: string | null
  amount_kobo: number
  fee_ngn: number
  weight_kg: number
  approximate_location: boolean
}

export class TravoQuoteError extends Error {
  code?: string
  constructor(message: string, code?: string) {
    super(message)
    this.code = code
  }
}

export const getTravoQuote = async (params: {
  address: string
  state: string
  weightKg: number
}): Promise<TravoQuote> => {
  const res = await fetch('/api/travo-quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: params.address,
      state: params.state,
      weight_kg: params.weightKg,
    }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new TravoQuoteError(data.error || 'Failed to get delivery quote', data.code)
  }
  return data as TravoQuote
}
