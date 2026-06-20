import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'
import { usePricesStore } from './prices'
import type { Order, OrderItem, PaymentMethod } from '../types/database'
import type { CartItem } from './cart'

export interface PriceMismatch {
  product_slug: string
  product_name: string
  cart_price:   number
  live_price:   number
}

export const useOrdersStore = defineStore('orders', () => {
  const orders  = ref<Order[]>([])
  const loading = ref(false)
  const error   = ref<string | null>(null)

  // ── Live price re-check — rule #7: cart prices are never trusted
  //    as final. Call this before charging, every time. ───────────
  // Returns mismatches (empty array = everything matches, safe to proceed).
  const reconfirmPrices = async (items: CartItem[]): Promise<PriceMismatch[]> => {
    const prices = usePricesStore()
    const mismatches: PriceMismatch[] = []

    for (const item of items) {
      const live = await prices.fetchPriceBySlug(item.product_slug)
      if (!live) continue // unavailable entirely — handled separately by caller
      if (live.price_ngn !== item.price_ngn) {
        mismatches.push({
          product_slug: item.product_slug,
          product_name: item.product_name,
          cart_price:   item.price_ngn,
          live_price:   live.price_ngn,
        })
      }
    }

    return mismatches
  }

  // ── Create an order + its order_items in one go ─────────────────
  // Caller is responsible for having already run reconfirmPrices()
  // and resolved any mismatches with the user before calling this.
  const createOrder = async (params: {
    items:            CartItem[]
    fullName:         string
    phone:            string
    deliveryAddress:  string
    state:            string
    deliveryZone:     string | null
    deliveryFeeNgn:   number
    paymentMethod:    PaymentMethod
  }): Promise<Order> => {
    const auth = useAuthStore()
    if (!auth.user) throw new Error('You must be logged in to place an order')

    const subtotalNgn = params.items.reduce((sum, i) => sum + i.price_ngn * i.quantity, 0)
    const totalNgn = subtotalNgn + params.deliveryFeeNgn

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id:           auth.user.id,
        full_name:         params.fullName,
        phone:             params.phone,
        delivery_address:  params.deliveryAddress,
        state:             params.state,
        delivery_zone:     params.deliveryZone,
        delivery_fee_ngn:  params.deliveryFeeNgn,
        subtotal_ngn:      subtotalNgn,
        total_ngn:         totalNgn,
        payment_method:    params.paymentMethod,
        payment_status:    'pending',
        order_status:      'pending',
      })
      .select()
      .single()

    if (orderErr) throw orderErr
    const createdOrder = order as Order

    const orderItemsPayload = params.items.map(i => ({
      order_id:     createdOrder.id,
      product_slug: i.product_slug,
      product_name: i.product_name,
      quantity:     i.quantity,
      unit:         i.unit,
      price_ngn:    i.price_ngn,
      subtotal_ngn: i.price_ngn * i.quantity,
    }))

    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(orderItemsPayload)

    if (itemsErr) {
      // Order row exists but items failed — surface this clearly rather
      // than leaving a silent orphaned order. Caller should show this
      // error and avoid telling the user the order succeeded.
      throw new Error(
        `Order ${createdOrder.ref} was created but items failed to save: ${itemsErr.message}`
      )
    }

    orders.value.unshift(createdOrder)
    return createdOrder
  }

  // ── Mark payment status after Paystack confirms (or webhook does) ──
  const confirmPayment = async (orderId: string, paystackRef: string, paystackData: unknown) => {
    const { data, error: err } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        order_status:   'confirmed',
        paystack_ref:   paystackRef,
        paystack_data:  paystackData,
      })
      .eq('id', orderId)
      .select()
      .single()

    if (err) throw err

    const updated = data as Order
    const idx = orders.value.findIndex(o => o.id === orderId)
    if (idx !== -1) orders.value[idx] = updated
    return updated
  }

  const fetchMyOrders = async (userId: string) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (err) throw err
      orders.value = (data ?? []) as Order[]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load orders'
    } finally {
      loading.value = false
    }
  }

  const fetchOrderItems = async (orderId: string): Promise<OrderItem[]> => {
    const { data, error: err } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
    if (err) {
      error.value = err.message
      return []
    }
    return (data ?? []) as OrderItem[]
  }

  const fetchOrderByRef = async (ref: string): Promise<Order | null> => {
    const { data, error: err } = await supabase
      .from('orders')
      .select('*')
      .eq('ref', ref)
      .single()
    if (err) {
      error.value = err.message
      return null
    }
    return data as Order
  }

  return {
    orders, loading, error,
    reconfirmPrices, createOrder, confirmPayment,
    fetchMyOrders, fetchOrderItems, fetchOrderByRef,
  }
})