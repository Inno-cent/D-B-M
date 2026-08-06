<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="page-hero">
      <div class="max-w-5xl mx-auto">
        <span class="section-label">Final Step</span>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-earth-900">
          Checkout
        </h1>
        <p class="text-earth-600 text-lg">
          Confirm delivery details and complete payment.
        </p>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-6 md:px-10 py-12">
      <!-- Empty cart guard -->
      <div v-if="cart.isEmpty" class="text-center py-20">
        <p class="text-6xl mb-5">🛒</p>
        <h3 class="text-xl font-bold text-earth-900 mb-3">Your cart is empty</h3>
        <p class="text-earth-500 mb-8">Add something before checking out.</p>
        <RouterLink to="/products" class="btn-primary px-8 py-4"
          >Browse Products →</RouterLink
        >
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-10">
        <!-- Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Price mismatch banner — shown if reconfirmPrices found changes -->
          <div
            v-if="priceMismatches.length > 0"
            class="border-2 border-amber-300 bg-amber-50 rounded-2xl p-5"
          >
            <p class="font-bold text-amber-800 mb-2">⚠ Some prices have changed</p>
            <ul class="text-sm text-amber-700 space-y-1 mb-3">
              <li v-for="m in priceMismatches" :key="m.product_slug">
                {{ m.product_name }}: {{ cart.formatNgn(m.cart_price) }} →
                <strong>{{ cart.formatNgn(m.live_price) }}</strong>
              </li>
            </ul>
            <button
              @click="applyLivePrices"
              class="text-sm font-semibold text-amber-800 underline"
            >
              Update cart to current prices and continue
            </button>
          </div>

          <!-- Delivery details -->
          <div class="border-2 border-earth-200 rounded-2xl p-6 bg-white">
            <h3 class="font-bold text-earth-900 mb-5">Delivery Details</h3>
            <div class="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  class="block text-xs font-semibold mb-1.5 text-earth-600 uppercase tracking-wider"
                  >Full Name</label
                >
                <input
                  v-model="form.fullName"
                  class="input-field"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  class="block text-xs font-semibold mb-1.5 text-earth-600 uppercase tracking-wider"
                  >Phone</label
                >
                <input v-model="form.phone" class="input-field" placeholder="+234..." />
              </div>
            </div>
            <div class="mb-4">
              <label
                class="block text-xs font-semibold mb-1.5 text-earth-600 uppercase tracking-wider"
                >Delivery Address</label
              >
              <textarea
                v-model="form.address"
                rows="3"
                class="input-field resize-none"
                placeholder="Full delivery address"
              />
            </div>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-xs font-semibold mb-1.5 text-earth-600 uppercase tracking-wider"
                  >State</label
                >
                <select v-model="form.state" class="input-field">
                  <option value="" disabled>Select state...</option>
                  <option v-for="s in delivery.allStates" :key="s" :value="s">
                    {{ s }}
                  </option>
                </select>
              </div>
              <div>
                <label
                  class="block text-xs font-semibold mb-1.5 text-earth-600 uppercase tracking-wider"
                  >Delivery Zone Fee</label
                >
                <div
                  class="input-field flex items-center"
                  :class="
                    resolvedZone ? 'text-earth-900 font-semibold' : 'text-earth-400'
                  "
                >
                  <span v-if="!form.state">Select state first</span>
                  <span v-else-if="!resolvedZone"
                    >No delivery zone found for this state</span
                  >
                  <span v-else-if="resolvedZone.fee_ngn === null"
                    >Quoted separately — contact us</span
                  >
                  <span v-else
                    >{{ delivery.formatNgn(resolvedZone.fee_ngn) }} ·
                    {{ resolvedZone.days_estimate }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Payment method -->
          <div class="border-2 border-earth-200 rounded-2xl p-6 bg-white">
            <h3 class="font-bold text-earth-900 mb-5">Payment Method</h3>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="method in paymentMethods"
                :key="method.value"
                @click="form.paymentMethod = method.value"
                type="button"
                :class="[
                  'p-4 border-2 rounded-xl text-center transition-colors duration-200',
                  form.paymentMethod === method.value
                    ? 'border-forest-400 bg-forest-50'
                    : 'border-earth-200 hover:border-forest-300',
                ]"
              >
                <p
                  :class="[
                    'text-sm font-semibold',
                    form.paymentMethod === method.value
                      ? 'text-forest-700'
                      : 'text-earth-700',
                  ]"
                >
                  {{ method.label }}
                </p>
              </button>
            </div>
          </div>

          <!-- Validation message -->
          <p v-if="formError" class="text-sm text-red-600 font-medium">{{ formError }}</p>
        </div>

        <!-- Summary -->
        <div>
          <div class="border-2 border-earth-200 rounded-2xl p-6 bg-white sticky top-24">
            <h3 class="font-bold text-earth-900 mb-5">Order Summary</h3>
            <div class="space-y-3 text-sm mb-5 pb-5 border-b-2 border-earth-100">
              <div
                v-for="item in cart.items"
                :key="item.product_slug"
                class="flex justify-between text-earth-600"
              >
                <span
                  >{{ item.product_name }} × {{ item.quantity }} {{ item.unit
                  }}{{ item.quantity > 1 ? "s" : "" }}</span
                >
                <span class="font-semibold text-earth-900">{{
                  cart.formatNgn(item.price_ngn * item.quantity)
                }}</span>
              </div>
            </div>
            <div class="space-y-3 text-sm mb-5">
              <div class="flex justify-between text-earth-600">
                <span>Subtotal</span>
                <span class="font-semibold text-earth-900">{{
                  cart.formatNgn(cart.subtotalNgn)
                }}</span>
              </div>
              <div class="flex justify-between text-earth-600">
                <span>Delivery</span>
                <span class="font-semibold text-earth-900">
                  {{
                    resolvedZone?.fee_ngn != null
                      ? delivery.formatNgn(resolvedZone.fee_ngn)
                      : "—"
                  }}
                </span>
              </div>
            </div>
            <div class="border-t-2 border-earth-100 pt-4 mb-6">
              <div class="flex justify-between">
                <span class="font-bold text-earth-900">Total</span>
                <span class="font-bold text-earth-900 text-lg">{{
                  cart.formatNgn(totalNgn)
                }}</span>
              </div>
            </div>
            <button
              @click="handlePay"
              :disabled="submitting"
              class="btn-primary w-full justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ submitting ? "Processing…" : `Pay ${cart.formatNgn(totalNgn)} →` }}
            </button>
            <p class="text-xs text-earth-400 text-center mt-3">Secured by Paystack</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useDeliveryStore } from '../stores/delivery'
import { useOrdersStore, type PriceMismatch } from '../stores/orders'
import { useAuthStore } from '../stores/auth'
import { usePaystack } from '../composables/usePaystack'
import type { PaymentMethod } from '../types/database'

const router = useRouter()
const cart     = useCartStore()
const delivery = useDeliveryStore()
const ordersStore = useOrdersStore()
const auth     = useAuthStore()
const { openPaystackPopup, isConfigured } = usePaystack()

onMounted(() => {
  if (delivery.zones.length === 0) delivery.fetchZones()
})

const form = ref({
  fullName:      auth.profile?.full_name ?? '',
  phone:         auth.profile?.phone ?? '',
  address:       '',
  state:         '',
  paymentMethod: 'card' as PaymentMethod,
})

const paymentMethods: { label: string; value: PaymentMethod }[] = [
  { label: 'Card',          value: 'card' },
  { label: 'Bank Transfer', value: 'bank_transfer' },
  { label: 'USSD',          value: 'ussd' },
]

const resolvedZone = computed(() =>
  form.value.state ? delivery.zoneForState(form.value.state) : null
)

const deliveryFeeNgn = computed(() => resolvedZone.value?.fee_ngn ?? 0)
const totalNgn = computed(() => cart.subtotalNgn + deliveryFeeNgn.value)

// ── Price re-check ───────────────────────────────────────────────
const priceMismatches = ref<PriceMismatch[]>([])

const applyLivePrices = () => {
  for (const m of priceMismatches.value) {
    const item = cart.items.find(i => i.product_slug === m.product_slug)
    if (item) item.price_ngn = m.live_price
  }
  priceMismatches.value = []
}

const formError = ref('')
const submitting = ref(false)

const validate = (): string | null => {
  if (!form.value.fullName.trim())  return 'Full name is required.'
  if (!form.value.phone.trim())     return 'Phone number is required.'
  if (!form.value.address.trim())   return 'Delivery address is required.'
  if (!form.value.state)            return 'Please select a delivery state.'
  if (!resolvedZone.value)          return 'No delivery zone is configured for this state yet.'
  if (resolvedZone.value.fee_ngn === null) {
    return 'This zone is quoted separately — please contact us to complete this order.'
  }
  return null
}

const handlePay = async () => {
  formError.value = ''

  const validationError = validate()
  if (validationError) {
    formError.value = validationError
    return
  }

  submitting.value = true
  try {
    // Rule: cart prices are never trusted as final — re-check live
    // before charging, every time.
    const mismatches = await ordersStore.reconfirmPrices(cart.items)
    if (mismatches.length > 0) {
      priceMismatches.value = mismatches
      formError.value = 'Prices have changed since you added items to your cart. Please review below.'
      submitting.value = false
      return
    }

    const order = await ordersStore.createOrder({
      items:           cart.items,
      fullName:        form.value.fullName,
      phone:           form.value.phone,
      deliveryAddress: form.value.address,
      state:           form.value.state,
      deliveryZone:    resolvedZone.value!.zone_name,
      deliveryFeeNgn:  resolvedZone.value!.fee_ngn!,
      paymentMethod:   form.value.paymentMethod,
    })

    if (!isConfigured) {
      formError.value = 'Payment is not configured. Contact support.'
      submitting.value = false
      return
    }

    // NOTE: assumes auth.user has an `.email` field (raw Supabase user object).
    // If your auth store only exposes `auth.profile`, swap this for
    // auth.profile?.email instead.
    await openPaystackPopup(
      {
        email:     auth.user!.email!,
        amountNgn: order.total_ngn,
        ref:       order.ref,
        metadata:  { order_id: order.id, order_ref: order.ref },
      },
      () => {
        // onSuccess — Paystack's popup confirmed the charge went through.
        // We deliberately do NOT write payment_status from the browser.
        // Only the server-side webhook (api/paystack-webhook.ts) is trusted
        // to do that, because it verifies Paystack's signature using a
        // secret key the browser never has access to. The order
        // confirmation page polls until the webhook has done its job.
        cart.clearCart()
        submitting.value = false
        router.push(`/orders/${order.ref}`)
      },
      () => {
        // onCancel — user closed the Paystack popup without paying.
        formError.value =
          `Payment was cancelled. Your order ${order.ref} is saved as pending — ` +
          'you can retry from your dashboard.'
        submitting.value = false
      }
    )
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Something went wrong placing your order.'
    submitting.value = false
  }
}
</script>
