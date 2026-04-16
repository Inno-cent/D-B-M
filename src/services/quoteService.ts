export const sendQuote = async (data: {
  company: string
  email: string
  phone: string
  product: string
  quantity: string
  country: string
  destination: string
  shipDate: string
  notes: string
}) => {
  const res = await fetch('/api/quote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to send quote')
  }

  return res.json()
}