export interface Profile {
  id: string
  full_name: string | null
  company_name: string | null
  country: string | null
  phone: string | null
  role: 'user' | 'admin'
  created_at: string
  updated_at?: string
}

export interface QuoteRequest {
  id: string
  user_id: string | null
  ref: string
  full_name: string | null
  company_name: string
  email: string
  phone: string | null
  product: string
  quantity: string
  buyer_country: string
  delivery_destination: string | null
  ship_date: string | null
  notes: string | null
  status: QuoteStatus
  admin_notes: string | null
  eta: string | null
  created_at: string
  updated_at: string
}

export interface OrderTracking {
  id: string
  quote_id: string
  status: string
  label: string
  description: string | null
  location: string | null
  created_at: string
}

export type QuoteStatus =
  | 'pending'
  | 'reviewing'
  | 'sourcing'
  | 'in_store'
  | 'transit'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled'

// ── Pricing ──────────────────────────────────────────────────────

export interface ProductPrice {
  id: string
  product_slug: string
  product_name: string
  price_ngn: number
  unit: string
  min_qty: number
  is_available: boolean
  updated_by: string | null
  last_updated: string
}

export interface PriceHistory {
  id: string
  product_slug: string
  old_price_ngn: number | null
  new_price_ngn: number
  changed_by: string | null
  changed_at: string
}

// ── Delivery ─────────────────────────────────────────────────────

export interface DeliveryZone {
  id: string
  zone_name: string
  states: string[]
  fee_ngn: number | null
  days_estimate: string | null
  is_available: boolean
  is_international: boolean
  created_at: string
}

// ── Orders ───────────────────────────────────────────────────────

export type PaymentMethod = 'card' | 'bank_transfer' | 'ussd'
export type PaymentStatus = 'pending' | 'paid' | 'failed'
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'

export interface Order {
  id: string
  ref: string
  user_id: string | null
  full_name: string
  phone: string
  delivery_address: string
  state: string
  delivery_zone: string | null
  delivery_fee_ngn: number
  subtotal_ngn: number
  total_ngn: number
  payment_method: PaymentMethod | null
  payment_status: PaymentStatus
  paystack_ref: string | null
  paystack_data: Record<string, unknown> | null
  order_status: OrderStatus
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_slug: string
  product_name: string
  quantity: number
  unit: string
  price_ngn: number
  subtotal_ngn: number
}
