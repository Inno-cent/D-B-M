import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'
import type { ProductPrice, PriceHistory } from '../types/database'

export const usePricesStore = defineStore('prices', () => {
  const prices  = ref<ProductPrice[]>([])
  const loading = ref(false)
  const error   = ref<string | null>(null)

  // Keyed lookup so components can do priceMap.value['rice'] instead of .find()
  const priceMap = computed<Record<string, ProductPrice>>(() => {
    const map: Record<string, ProductPrice> = {}
    for (const p of prices.value) map[p.product_slug] = p
    return map
  })

  const formatNgn = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount)

  // ── Fetch all prices (used by ProductsView grid + AdminPricesView) ──
  const fetchPrices = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('product_prices')
        .select('*')
        .order('product_name', { ascending: true })
      if (err) throw err
      prices.value = (data ?? []) as ProductPrice[]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load prices'
    } finally {
      loading.value = false
    }
  }

  // ── Fetch a single live price — used at checkout re-confirmation,
  //    never trust what's cached in priceMap for the final charge ──
  const fetchPriceBySlug = async (slug: string): Promise<ProductPrice | null> => {
    const { data, error: err } = await supabase
      .from('product_prices')
      .select('*')
      .eq('product_slug', slug)
      .single()
    if (err) {
      error.value = err.message
      return null
    }
    return data as ProductPrice
  }

  // ── Admin: update a price. RLS enforces admin-only at the DB level;
  //    this check is a fast UI-side guard, not the real security boundary ──
  const updatePrice = async (slug: string, newPriceNgn: number) => {
    const auth = useAuthStore()
    if (!auth.isAdmin) throw new Error('Only admins can update prices')

    const { data, error: err } = await supabase
      .from('product_prices')
      .update({
        price_ngn:  newPriceNgn,
        updated_by: auth.user?.id ?? null,
      })
      .eq('product_slug', slug)
      .select()
      .single()

    if (err) throw err

    const updated = data as ProductPrice
    const idx = prices.value.findIndex(p => p.product_slug === slug)
    if (idx !== -1) prices.value[idx] = updated
    else prices.value.push(updated)

    return updated
  }

  // ── Admin: toggle availability without touching price ──
  const setAvailability = async (slug: string, isAvailable: boolean) => {
    const auth = useAuthStore()
    if (!auth.isAdmin) throw new Error('Only admins can update prices')

    const { data, error: err } = await supabase
      .from('product_prices')
      .update({ is_available: isAvailable, updated_by: auth.user?.id ?? null })
      .eq('product_slug', slug)
      .select()
      .single()

    if (err) throw err

    const updated = data as ProductPrice
    const idx = prices.value.findIndex(p => p.product_slug === slug)
    if (idx !== -1) prices.value[idx] = updated

    return updated
  }

  // ── History for a single product (dispute resolution / admin view) ──
  const fetchHistory = async (slug: string): Promise<PriceHistory[]> => {
    const { data, error: err } = await supabase
      .from('price_history')
      .select('*')
      .eq('product_slug', slug)
      .order('changed_at', { ascending: false })
      .limit(20)
    if (err) {
      error.value = err.message
      return []
    }
    return (data ?? []) as PriceHistory[]
  }

  return {
    prices, loading, error,
    priceMap, formatNgn,
    fetchPrices, fetchPriceBySlug,
    updatePrice, setAvailability,
    fetchHistory,
  }
})