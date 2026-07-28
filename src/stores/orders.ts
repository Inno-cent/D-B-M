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
  cart_price: number
  live_price: number
}

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Admin-only: all orders across every customer, kept in a separate array
  // from `orders` (which is "my orders" for the logged-in customer) so the
  // two views can never clobber each other's state.
  const adminOrders = ref<Order[]>([])
  const adminLoading = ref(false)
  const adminError = ref<string | null>(null)

  const reconfirmPrices = async (items: CartItem[]): Promise<PriceMismatch[]> => {
    const prices = usePricesStore()
    const mismatches: PriceMismatch[] = []
    for (const item of items) {
      const live = await prices.fetchPriceBySlug(item.product_slug)
      if (!live) continue
      if (live.price_ngn !== item.price_ngn) {
        mismatches.push({
          product_slug: item.product_slug,
          product_name: item.product_name,
          cart_price: item.price_ngn,
          live_price: live.price_ngn,
        })
      }
    }
    return mismatches
  }

  const createOrder = async (params: {
    items: CartItem[]
    fullName: string
    phone: string
    deliveryAddress: string
    state: string
    deliveryZone: string | null
    deliveryFeeNgn: number
    paymentMethod: PaymentMethod
  }): Promise<Order> => {
    const auth = useAuthStore()
    if (!auth.user) throw new Error('You must be logged in to place an order')

    const subtotalNgn = params.items.reduce((sum, i) => sum + i.price_ngn * i.quantity, 0)
    const totalNgn = subtotalNgn + params.deliveryFeeNgn

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: auth.user.id,
        full_name: params.fullName,
        phone: params.phone,
        delivery_address: params.deliveryAddress,
        state: params.state,
        delivery_zone: params.deliveryZone,
        delivery_fee_ngn: params.deliveryFeeNgn,
        subtotal_ngn: subtotalNgn,
        total_ngn: totalNgn,
        payment_method: params.paymentMethod,
        payment_status: 'pending',
        order_status: 'pending',
      })
      .select()
      .single()

    if (orderErr) throw orderErr
    const createdOrder = order as Order

    const orderItemsPayload = params.items.map((i) => ({
      order_id: createdOrder.id,
      product_slug: i.product_slug,
      product_name: i.product_name,
      quantity: i.quantity,
      unit: i.unit,
      price_ngn: i.price_ngn,
      subtotal_ngn: i.price_ngn * i.quantity,
    }))

    const { error: itemsErr } = await supabase.from('order_items').insert(orderItemsPayload)

    if (itemsErr) {
      throw new Error(
        `Order ${createdOrder.ref} was created but items failed to save: ${itemsErr.message}`,
      )
    }

    orders.value.unshift(createdOrder)
    return createdOrder
  }

  const confirmPayment = async (orderId: string, paystackRef: string, paystackData: unknown) => {
    const { data, error: err } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        order_status: 'confirmed',
        paystack_ref: paystackRef,
        paystack_data: paystackData,
      })
      .eq('id', orderId)
      .select()
      .single()
    if (err) throw err
    const updated = data as Order
    const idx = orders.value.findIndex((o) => o.id === orderId)
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

  // Admin-only — every order across every customer. Relies on an RLS
  // SELECT policy on `orders` that allows admins to read rows they don't
  // own; the existing policies described in the project doc only cover
  // UPDATE (admin-only) and each customer reading their own rows. If this
  // comes back empty despite orders existing, that policy is almost
  // certainly missing — see the migration note alongside AdminOrdersView.
  const fetchAllOrders = async () => {
    adminLoading.value = true
    adminError.value = null
    try {
      const { data, error: err } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (err) throw err
      adminOrders.value = (data ?? []) as Order[]
    } catch (e) {
      adminError.value = e instanceof Error ? e.message : 'Failed to load orders'
    } finally {
      adminLoading.value = false
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
    const { data, error: err } = await supabase.from('orders').select('*').eq('ref', ref).single()
    if (err) {
      error.value = err.message
      return null
    }
    return data as Order
  }

  return {
    orders,
    loading,
    error,
    adminOrders,
    adminLoading,
    adminError,
    reconfirmPrices,
    createOrder,
    confirmPayment,
    fetchMyOrders,
    fetchAllOrders,
    fetchOrderItems,
    fetchOrderByRef,
  }
})
