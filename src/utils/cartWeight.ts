// NEW FILE — src/utils/cartWeight.ts
//
// Travo prices parcels by weight band, but cart items carry no weight.
// Variant slugs encode the pack size ("maize--20kg", "palm-oil--5l"), so we
// read the weight from there, then from `unit`. Litres count as 1 kg each.
// Anything we can't parse falls back to DEFAULT_ITEM_KG per unit — adjust
// that (or add a real `weight_kg` column to product_prices) if it's off.

import type { CartItem } from '../stores/cart'

const DEFAULT_ITEM_KG = 1

const parseWeightKg = (text: string): number | null => {
  const m = text.toLowerCase().match(/(\d+(?:\.\d+)?)\s*(kg|g|l|ml|ltr|litre|litres)\b/)
  if (!m) return null
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
