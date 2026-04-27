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
      // ── STEP 1: Save to Supabase ───────────────────────────
      // This is the ONLY step that determines success or failure
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
        console.error('❌ Supabase error:', dbError)
        throw new Error(dbError.message)
      }

      // ✅ Supabase saved — we are done from the user's perspective
      if (data) quotes.value.unshift(data as QuoteRequest)

      // ── STEP 2: Fire notifications — completely detached ───
      // These run after we return. If they fail, the quote is already saved.
      setTimeout(() => {
        sendNotifications(payload).catch(e =>
          console.warn('⚠️ Notification failed (non-critical):', e?.message)
        )
      }, 0)

      return data

    } catch (e: any) {
      error.value = e.message || 'Failed to submit quote'
      throw e
    } finally {
      // loading turns off as soon as Supabase responds
      // Notifications run separately after this
      loading.value = false
    }
  }

  // ── Send notifications via Supabase Edge Function ─────────────
  // This is completely fire-and-forget — it does not block the UI
  const sendNotifications = async (payload: {
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
    // Try Supabase Edge Function first
    try {
      const { error: fnError } = await supabase.functions.invoke(
        'send-quote-notification',
        {
          body: {
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
          }
        }
      )
      if (fnError) {
        console.warn('Edge function warning:', fnError.message)
      } else {
        console.log('✅ Notification sent via Edge Function')
      }
    } catch (e: any) {
      console.warn('Edge function failed:', e?.message)
    }
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