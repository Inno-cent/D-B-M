import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import type { QuoteRequest, OrderTracking } from '../types/database'

export const useQuoteStore = defineStore('quotes', () => {
  const quotes          = ref<QuoteRequest[]>([])
  const trackingMap     = ref<Record<string, OrderTracking[]>>({})
  const loading         = ref(false)
  const trackingLoading = ref(false)
  const error           = ref<string | null>(null)

  // ── Submit quote ──────────────────────────────────────────────
  const submitQuote = async (payload: {
    user_id?:              string | null
    full_name:             string
    company_name:          string
    email:                 string
    phone?:                string
    product:               string
    quantity:              string
    buyer_country:         string
    delivery_destination?: string
    ship_date?:            string
    notes?:                string
  }) => {
    loading.value = true
    error.value   = null

    try {
      // ── 1. Save to Supabase (source of truth) ──────────────
      const { data, error: dbError } = await supabase
        .from('quote_requests')
        .insert({
          user_id:              payload.user_id              ?? null,
          full_name:            payload.full_name,
          company_name:         payload.company_name,
          email:                payload.email,
          phone:                payload.phone                ?? null,
          product:              payload.product,
          quantity:             payload.quantity,
          buyer_country:        payload.buyer_country,
          delivery_destination: payload.delivery_destination ?? null,
          ship_date:            payload.ship_date            ?? null,
          notes:                payload.notes                ?? null,
          status:               'pending',
        })
        .select()
        .single()

      if (dbError) {
        console.error('❌ Supabase insert error:', dbError.message)
        throw new Error(dbError.message)
      }

      // ✅ Quote saved — update local list and return
      if (data) quotes.value.unshift(data as QuoteRequest)

      // ── 2. Notify via API (fire and forget after success) ──
      // This runs in the background — does NOT block or affect loading
      notifyViaApi({
        full_name:   payload.full_name,
        company:     payload.company_name,
        email:       payload.email,
        phone:       payload.phone                ?? '',
        product:     payload.product,
        quantity:    payload.quantity,
        country:     payload.buyer_country,
        destination: payload.delivery_destination ?? '',
        shipDate:    payload.ship_date            ?? '',
        notes:       payload.notes                ?? '',
      })

      return data

    } catch (e: any) {
      error.value = e.message || 'Failed to submit quote'
      throw e
    } finally {
      // loading turns off ONLY after Supabase responds
      // API notifications run completely independently
      loading.value = false
    }
  }

  // ── Fire API notification — completely detached ───────────────
  const notifyViaApi = (data: {
    full_name:   string
    company:     string
    email:       string
    phone:       string
    product:     string
    quantity:    string
    country:     string
    destination: string
    shipDate:    string
    notes:       string
  }) => {
    // Determine API URL
    // In dev: Vite proxy routes /api to Vercel dev server
    // In prod: same origin /api/quote
    const url = '/api/quote'

    // Use a 15 second timeout — completely non-blocking
    const controller = new AbortController()
    const timeout    = setTimeout(() => {
      controller.abort()
      console.warn('⏱ Notification request timed out — quote already saved to Supabase')
    }, 15000)

    fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
      signal:  controller.signal,
    })
      .then(async (res) => {
        clearTimeout(timeout)
        const json = await res.json().catch(() => ({}))
        console.log('📬 Notification result:', json)
      })
      .catch((e) => {
        clearTimeout(timeout)
        if (e.name !== 'AbortError') {
          console.warn('📬 Notification failed (non-critical):', e.message)
        }
      })
    // No await — returns immediately
  }

  // ── Fetch user's quotes ───────────────────────────────────────
  const fetchMyQuotes = async (userId: string) => {
    loading.value = true
    error.value   = null
    try {
      const { data, error: err } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (err) throw err
      quotes.value = (data as QuoteRequest[]) ?? []
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // ── Fetch tracking for a quote ────────────────────────────────
  const fetchTracking = async (quoteId: string) => {
    trackingLoading.value = true
    try {
      const { data, error: err } = await supabase
        .from('order_tracking')
        .select('*')
        .eq('quote_id', quoteId)
        .order('created_at', { ascending: true })

      if (err) throw err
      trackingMap.value[quoteId] = (data as OrderTracking[]) ?? []
    } catch (e: any) {
      console.error('Tracking fetch failed:', e.message)
    } finally {
      trackingLoading.value = false
    }
  }

  const getTracking = async (quoteId: string): Promise<OrderTracking[]> => {
    if (!trackingMap.value[quoteId]) {
      await fetchTracking(quoteId)
    }
    return trackingMap.value[quoteId] ?? []
  }

  return {
    quotes, trackingMap, loading, trackingLoading, error,
    submitQuote, fetchMyQuotes, fetchTracking, getTracking,
  }
})