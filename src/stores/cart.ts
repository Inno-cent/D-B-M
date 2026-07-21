import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'orenag_cart_v1'

export interface CartItem {
  product_slug: string
  product_name: string
  image: string
  unit: string
  min_qty: number
  price_ngn: number
  quantity: number
}

const loadFromStorage = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const saveToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* quota/private */
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadFromStorage())

  watch(items, (val) => saveToStorage(val), { deep: true })

  const itemCount = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))
  const subtotalNgn = computed(() =>
    items.value.reduce((sum, i) => sum + i.price_ngn * i.quantity, 0),
  )
  const isEmpty = computed(() => items.value.length === 0)

  const formatNgn = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount)

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity?: number) => {
    const qty = quantity ?? item.min_qty
    const existing = items.value.find((i) => i.product_slug === item.product_slug)
    if (existing) {
      existing.quantity += qty
      existing.price_ngn = item.price_ngn
    } else {
      items.value.push({ ...item, quantity: Math.max(qty, item.min_qty) })
    }
  }

  const updateQuantity = (slug: string, quantity: number) => {
    const existing = items.value.find((i) => i.product_slug === slug)
    if (!existing) return
    if (quantity < existing.min_qty) return false
    existing.quantity = quantity
    return true
  }

  const increment = (slug: string) => {
    const existing = items.value.find((i) => i.product_slug === slug)
    if (existing) existing.quantity += 1
  }

  const decrement = (slug: string) => {
    const existing = items.value.find((i) => i.product_slug === slug)
    if (!existing) return
    if (existing.quantity <= existing.min_qty) return
    existing.quantity -= 1
  }

  const removeItem = (slug: string) => {
    items.value = items.value.filter((i) => i.product_slug !== slug)
  }

  const clearCart = () => {
    items.value = []
  }

  return {
    items,
    itemCount,
    subtotalNgn,
    isEmpty,
    formatNgn,
    addItem,
    updateQuantity,
    increment,
    decrement,
    removeItem,
    clearCart,
  }
})
