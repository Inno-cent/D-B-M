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
      // 1 — Save to Supabase
      const { data, error: dbError } = await supabase
        .from('quote_requests')
        .insert({
          user_id:              payload.user_id              || null,
          company_name:         payload.company_name,
          email:                payload.email,
          phone:                payload.phone                || null,
          product:              payload.product,
          quantity:             payload.quantity,
          buyer_country:        payload.buyer_country,
          delivery_destination: payload.delivery_destination || null,
          ship_date:            payload.ship_date            || null,
          notes:                payload.notes                || null,
          status:               'pending',
        })
        .select()
        .single()

      if (dbError) throw dbError

      // Add to local list
      if (data) quotes.value.unshift(data as QuoteRequest)

      // 2 — Send to your API handler (WhatsApp + Google Sheets)
      sendToHandler({
        product:     payload.product,
        quantity:    payload.quantity,
        company:     payload.company_name,
        email:       payload.email,
        phone:       payload.phone        || '',
        country:     payload.buyer_country,
        destination: payload.delivery_destination || '',
        shipDate:    payload.ship_date            || '',
        notes:       payload.notes                || '',
      }).catch(e => console.warn('Handler notification failed:', e))

      return data

    } catch (e: any) {
      error.value = e.message || 'Failed to submit quote'
      throw e
    } finally {
      loading.value = false
    }
  }

  // ── Send to your API handler (WhatsApp + Sheets) ──────────────
  const sendToHandler = async (data: {
    product:     string
    quantity:    string
    company:     string
    email:       string
    phone:       string
    country:     string
    destination: string
    shipDate:    string
    notes:       string
  }) => {
    // This calls your api/quote.ts handler
    // In dev: Vite proxy or direct call
    // In prod: your deployed serverless function URL
    const apiUrl = import.meta.env.VITE_QUOTE_API_URL || '/api/quote'

    await fetch(apiUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    })
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
      quotes.value = (data as QuoteRequest[]) || []
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // ── Fetch tracking for a specific quote ───────────────────────
  const fetchTracking = async (quoteId: string) => {
    trackingLoading.value = true
    try {
      const { data, error: err } = await supabase
        .from('order_tracking')
        .select('*')
        .eq('quote_id', quoteId)
        .order('created_at', { ascending: true })

      if (err) throw err
      trackingMap.value[quoteId] = (data as OrderTracking[]) || []
    } catch (e: any) {
      console.error('Tracking fetch failed:', e)
    } finally {
      trackingLoading.value = false
    }
  }

  // ── Get tracking for a quote (with fetch if not loaded) ───────
  const getTracking = async (quoteId: string): Promise<OrderTracking[]> => {
    if (!trackingMap.value[quoteId]) {
      await fetchTracking(quoteId)
    }
    return trackingMap.value[quoteId] || []
  }

  return {
    quotes, trackingMap, loading, trackingLoading, error,
    submitQuote, fetchMyQuotes, fetchTracking, getTracking,
  }
})