<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="page-hero">
      <div class="max-w-3xl mx-auto">
        <span class="section-label">Order Status</span>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-earth-900">
          {{ order ? order.ref : "Loading…" }}
        </h1>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-6 md:px-10 py-12">
      <!-- Loading initial order -->
      <div v-if="loading && !order" class="text-center py-20">
        <p class="text-earth-500">Loading your order…</p>
      </div>

      <!-- Order not found -->
      <div v-else-if="!loading && !order" class="text-center py-20">
        <p class="text-6xl mb-5">❓</p>
        <h3 class="text-xl font-bold text-earth-900 mb-3">Order not found</h3>
        <p class="text-earth-500 mb-8">
          We couldn't find an order with that reference. If you just paid, check your
          dashboard in a moment.
        </p>
        <RouterLink to="/dashboard" class="btn-primary px-8 py-4"
          >Go to Dashboard →</RouterLink
        >
      </div>

      <!-- Order found -->
      <div v-else class="space-y-6">
        <!-- Status banner -->
        <div
          class="border-2 rounded-2xl p-6 flex items-start gap-4"
          :class="statusBannerClass"
        >
          <span class="text-3xl leading-none">{{ statusIcon }}</span>
          <div>
            <p class="font-bold" :class="statusTextClass">{{ statusHeading }}</p>
            <p class="text-sm mt-1" :class="statusTextClass">{{ statusSubtext }}</p>
          </div>
        </div>

        <!-- Order items -->
        <div class="border-2 border-earth-200 rounded-2xl p-6 bg-white">
          <h3 class="font-bold text-earth-900 mb-5">Order Items</h3>
          <div v-if="itemsLoading" class="text-earth-400 text-sm">Loading items…</div>
          <div v-else class="space-y-3 text-sm">
            <div
              v-for="item in items"
              :key="item.id"
              class="flex justify-between text-earth-600"
            >
              <span
                >{{ item.product_name }} × {{ item.quantity }} {{ item.unit
                }}{{ item.quantity > 1 ? "s" : "" }}</span
              >
              <span class="font-semibold text-earth-900">{{
                formatNgn(item.subtotal_ngn)
              }}</span>
            </div>
          </div>
          <div class="border-t-2 border-earth-100 mt-5 pt-5 space-y-2 text-sm">
            <div class="flex justify-between text-earth-600">
              <span>Subtotal</span>
              <span class="font-semibold text-earth-900">{{
                formatNgn(order!.subtotal_ngn)
              }}</span>
            </div>
            <div class="flex justify-between text-earth-600">
              <span>Delivery ({{ order!.delivery_zone ?? order!.state }})</span>
              <span class="font-semibold text-earth-900">{{
                formatNgn(order!.delivery_fee_ngn)
              }}</span>
            </div>
            <div class="flex justify-between pt-2 border-t border-earth-100">
              <span class="font-bold text-earth-900">Total</span>
              <span class="font-bold text-earth-900 text-lg">{{
                formatNgn(order!.total_ngn)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Delivery details -->
        <div class="border-2 border-earth-200 rounded-2xl p-6 bg-white">
          <h3 class="font-bold text-earth-900 mb-4">Delivery Details</h3>
          <dl class="text-sm space-y-2">
            <div class="flex justify-between">
              <dt class="text-earth-500">Name</dt>
              <dd class="text-earth-900 font-medium">{{ order!.full_name }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-earth-500">Phone</dt>
              <dd class="text-earth-900 font-medium">{{ order!.phone }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-earth-500">Address</dt>
              <dd class="text-earth-900 font-medium text-right max-w-xs">
                {{ order!.delivery_address }}
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-earth-500">State</dt>
              <dd class="text-earth-900 font-medium">{{ order!.state }}</dd>
            </div>
          </dl>
        </div>

        <div class="flex gap-3">
          <RouterLink to="/dashboard" class="btn-secondary flex-1 justify-center py-3"
            >View Dashboard</RouterLink
          >
          <RouterLink to="/products" class="btn-primary flex-1 justify-center py-3"
            >Continue Shopping</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useOrdersStore } from "../stores/orders";
import type { Order, OrderItem } from "../types/database";

const route = useRoute();
const ordersStore = useOrdersStore();

const order = ref<Order | null>(null);
const items = ref<OrderItem[]>([]);
const loading = ref(true);
const itemsLoading = ref(true);

// Poll while payment_status is still 'pending' — the webhook is the only
// thing allowed to flip it to 'paid'/'failed', and it can take a few
// seconds to arrive after Paystack's popup closes.
//
// Window extended for local dev: observed a real webhook call taking
// 6.97s round-trip through ngrok + a cold-starting `vercel dev` function,
// and Paystack retries on slow responses, which can double that. The old
// ~1 minute window was cutting it close. Production (real Vercel, no
// ngrok hop, no cold start after warmup) shouldn't need this much slack —
// safe to dial back down once verified there, per the pending-verification
// item in the project doc.
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 60; // ~3 minutes of polling before giving up
let pollTimer: ReturnType<typeof setInterval> | null = null;
let pollAttempts = 0;
const pollTimedOut = ref(false);

const loadOrder = async () => {
  const refParam = route.params.ref as string;
  const result = await ordersStore.fetchOrderByRef(refParam);
  order.value = result;
  loading.value = false;

  if (result && items.value.length === 0) {
    itemsLoading.value = true;
    items.value = await ordersStore.fetchOrderItems(result.id);
    itemsLoading.value = false;
  }
};

const poll = async () => {
  if (!order.value) return;
  if (order.value.payment_status !== "pending") {
    stopPolling();
    return;
  }
  pollAttempts++;
  if (pollAttempts >= MAX_POLL_ATTEMPTS) {
    pollTimedOut.value = true;
    stopPolling();
    return;
  }
  const refreshed = await ordersStore.fetchOrderByRef(order.value.ref);
  if (refreshed) order.value = refreshed;
};

const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
};

onMounted(async () => {
  await loadOrder();
  if (order.value && order.value.payment_status === "pending") {
    pollTimer = setInterval(poll, POLL_INTERVAL_MS);
  }
});

onUnmounted(() => {
  stopPolling();
});

const formatNgn = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const statusHeading = computed(() => {
  if (!order.value) return "";
  if (order.value.payment_status === "paid") return "Payment confirmed";
  if (order.value.payment_status === "failed") return "Payment failed";
  if (pollTimedOut.value) return "Still confirming your payment";
  return "Confirming your payment…";
});

const statusSubtext = computed(() => {
  if (!order.value) return "";
  if (order.value.payment_status === "paid") {
    return `Your order is confirmed and being prepared. Reference: ${order.value.ref}.`;
  }
  if (order.value.payment_status === "failed") {
    return "Your payment did not go through. You can retry from your dashboard.";
  }
  if (pollTimedOut.value) {
    return "This is taking longer than expected. Check your dashboard shortly, or contact support with your order reference if it doesn't update.";
  }
  return "We're waiting for confirmation from Paystack. This usually takes a few seconds — no need to refresh.";
});

const statusIcon = computed(() => {
  if (!order.value) return "";
  if (order.value.payment_status === "paid") return "✅";
  if (order.value.payment_status === "failed") return "⚠️";
  return "⏳";
});

const statusBannerClass = computed(() => {
  if (!order.value) return "";
  if (order.value.payment_status === "paid") return "border-forest-300 bg-forest-50";
  if (order.value.payment_status === "failed") return "border-red-300 bg-red-50";
  return "border-amber-300 bg-amber-50";
});

const statusTextClass = computed(() => {
  if (!order.value) return "";
  if (order.value.payment_status === "paid") return "text-forest-800";
  if (order.value.payment_status === "failed") return "text-red-800";
  return "text-amber-800";
});
</script>
