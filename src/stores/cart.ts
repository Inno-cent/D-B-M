import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'dualmarket_cart_v1'

export interface CartItem {
  product_slug: string
  product_name: string
  image:        string
  unit:         string
  min_qty:      number
  price_ngn:    number   // snapshot at time of adding — re-confirmed live at checkout
  quantity:     number
}

// ── localStorage helpers ──────────────────────────────────────────
// Written manually rather than depending on pinia-plugin-persistedstate,
// since it's unconfirmed whether that package is installed. Swap to the
// plugin later if you want — this does the same job either way.
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
    // localStorage can fail (private browsing, quota) — cart still
    // works in-memory for the session, it just won't survive a refresh.
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadFromStorage())

  // Persist on every change
  watch(items, (val) => saveToStorage(val), { deep: true })

  const itemCount = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  const subtotalNgn = computed(() =>
    items.value.reduce((sum, i) => sum + i.price_ngn * i.quantity, 0)
  )

  const isEmpty = computed(() => items.value.length === 0)

  const formatNgn = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount)

  // ── Add item — if it already exists, increases quantity instead
  //    of duplicating the row ───────────────────────────────────
  const addItem = (item: Omit<CartItem, 'quantity'>, quantity?: number) => {
    const qty = quantity ?? item.min_qty
    const existing = items.value.find(i => i.product_slug === item.product_slug)

    if (existing) {
      existing.quantity += qty
      // Always refresh to the latest known price/snapshot when re-adding
      existing.price_ngn = item.price_ngn
    } else {
      items.value.push({ ...item, quantity: Math.max(qty, item.min_qty) })
    }
  }

  // ── Update quantity directly (used by stepper / manual input) ──
  const updateQuantity = (slug: string, quantity: number) => {
    const existing = items.value.find(i => i.product_slug === slug)
    if (!existing) return

    if (quantity < existing.min_qty) {
      // Never silently clamp without the caller knowing — return false
      // so the UI can decide how to communicate the floor.
      return false
    }
    existing.quantity = quantity
    return true
  }

  // ── Step by 1, blocked at min_qty ───────────────────────────────
  const increment = (slug: string) => {
    const existing = items.value.find(i => i.product_slug === slug)
    if (existing) existing.quantity += 1
  }

  const decrement = (slug: string) => {
    const existing = items.value.find(i => i.product_slug === slug)
    if (!existing) return
    if (existing.quantity <= existing.min_qty) return // blocked at floor
    existing.quantity -= 1
  }

  const removeItem = (slug: string) => {
    items.value = items.value.filter(i => i.product_slug !== slug)
  }

  const clearCart = () => {
    items.value = []
  }

  return {
    items, itemCount, subtotalNgn, isEmpty, formatNgn,
    addItem, updateQuantity, increment, decrement, removeItem, clearCart,
  }
})