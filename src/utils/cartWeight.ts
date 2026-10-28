

import type { CartItem } from '../stores/cart'

const DEFAULT_ITEM_KG = 1

const parseWeightKg = (text: string): number | null => {
  const m = text.toLowerCase().match(/(\d+(?:\.\d+)?)\s*(kg|g|l|ml|ltr|litre|litres)\b/)

  if (!m || !m[1] || !m[2]) return null

  const n = parseFloat(m[1])

  switch (m[2]) {
    case 'kg':
    case 'l':
    case 'ltr':
    case 'litre':
    case 'litres':
      return n

    case 'g':
    case 'ml':
      return n / 1000

    default:
      return null
  }
}

export const itemWeightKg = (item: CartItem): number => {
  const packSize = item.product_slug.includes('--') ? item.product_slug.split('--').pop()! : ''
  return parseWeightKg(packSize) ?? parseWeightKg(item.unit) ?? DEFAULT_ITEM_KG
}

export const estimateCartWeightKg = (items: CartItem[]): number => {
  const total = items.reduce((sum, i) => sum + itemWeightKg(i) * i.quantity, 0)
  // Round up to 0.1 kg, never below 0.1 so Travo always gets a valid weight.
  return Math.max(0.1, Math.ceil(total * 10) / 10)
}
