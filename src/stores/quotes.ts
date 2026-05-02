import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import type { QuoteRequest, OrderTracking } from '../types/database'

export const useQuoteStore = defineStore('quotes', () => {
  const quotes = ref<QuoteRequest[]>([])
  const trackingMap = ref<Record<string, OrderTracking[]>>({})
  const loading = ref(false)
  const trackingLoading = ref(false)
  const error = ref<string | null>(null)

  // ── Submit quote ──────────────────────────────────────────────
  const submitQuote = async (payload: {
    user_id?: string | null
    full_name: string
    company_name: string
    email: string
    phone?: string
    product: string
    quantity: string
    buyer_country: string
    delivery_destination?: string
    ship_date?: string
    notes?: string
  }): Promise<QuoteRequest> => {
    console.log('🚀 submitQuote started')
    loading.value = true
    error.value = null

    try {
      console.log('📡 Inserting into Supabase...')

      const { data, error: dbError } = await supabase
        .from('quote_requests')
        .insert({
          user_id: payload.user_id ?? null,
          full_name: payload.full_name,
          company_name: payload.company_name,
          email: payload.email,
          phone: payload.phone ?? null,
          product: payload.product,
          quantity: payload.quantity,
          buyer_country: payload.buyer_country,
          delivery_destination: payload.delivery_destination ?? null,
          ship_date: payload.ship_date ?? null,
          notes: payload.notes ?? null,
          status: 'pending',
        })
        .select()
        .single()

      if (dbError) {
        console.error('❌ Supabase error:', dbError.code, dbError.message)
        throw new Error(dbError.message)
      }

      console.log('✅ Supabase success. Ref:', (data as any)?.ref)

      if (data) quotes.value.unshift(data as QuoteRequest)

      // Fire notifications after loading is cleared
      const notifPayload = {
        full_name: payload.full_name,
        company: payload.company_name,
        email: payload.email,
        phone: payload.phone ?? '',
        product: payload.product,
        quantity: payload.quantity,
        country: payload.buyer_country,
        destination: payload.delivery_destination ?? '',
        shipDate: payload.ship_date ?? '',
        notes: payload.notes ?? '',
      }

      setTimeout(() => {
        sendNotifications(notifPayload)
      }, 0)

      return data as QuoteRequest
    } catch (e: any) {
      console.error('❌ submitQuote error:', e.message)
      error.value = e.message || 'Failed to submit quote'
      throw e
    } finally {
      console.log('🏁 finally — loading = false')
      loading.value = false
    }
  }

  // ── Send notifications — fire and forget ──────────────────────
  const sendNotifications = async (data: {
    full_name: string
    company: string
    email: string
    phone: string
    product: string
    quantity: string
    country: string
    destination: string
    shipDate: string
    notes: string
  }): Promise<void> => {
    console.log('📬 Starting background notifications...')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
      console.warn('⏱ Notification timed out — quote already saved ✅')
    }, 30000)

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const json = await response.json().catch(() => ({}))
      console.log('📬 Notification result:', response.status, json)
    } catch (e: any) {
      clearTimeout(timeoutId)
      if (e.name === 'AbortError') {
        console.warn('📬 Notification timed out — non-critical, quote saved ✅')
      } else {
        console.warn('📬 Notification failed:', e.message, '— non-critical, quote saved ✅')
      }
    }
  }

  // ── Fetch user quotes ─────────────────────────────────────────
  const fetchMyQuotes = async (userId: string): Promise<void> => {
    loading.value = true
    error.value = null
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

  // ── Fetch tracking ────────────────────────────────────────────
  const fetchTracking = async (quoteId: string): Promise<void> => {
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
    quotes,
    trackingMap,
    loading,
   
  }
})
