<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="max-w-4xl mx-auto px-6 md:px-10 py-10">
      <h1 class="text-2xl font-bold text-earth-900 mb-6">Your Orders</h1>

      <div v-if="ordersStore.loading" class="text-earth-500 text-sm">
        Loading your orders…
      </div>

      <div
        v-else-if="!ordersStore.orders?.length"
        class="text-center py-20 border-2 border-earth-200 rounded-2xl bg-white"
      >
        <p class="text-4xl mb-3">📦</p>
        <p class="text-earth-600 mb-4">You haven't placed any orders yet.</p>
        <RouterLink to="/products" class="btn-primary">Start Shopping →</RouterLink>
      </div>

      <div v-else class="space-y-3">
        <RouterLink
          v-for="order in ordersStore.orders"
          :key="order.ref"
          :to="`/orders/${order.ref}`"
          class="flex items-center justify-between p-4 bg-white border-2 border-earth-200 rounded-xl hover:border-forest-300 transition-colors"
        >
          <div>
            <p class="font-semibold text-earth-900 text-sm">Order #{{ order.ref }}</p>
            <p class="text-xs text-earth-500">{{ order.created_at }}</p>
          </div>
          <span
            :class="[
              'text-xs font-semibold px-3 py-1 rounded-full',
              order.payment_status === 'paid'
                ? 'bg-forest-50 text-forest-700'
                : order.payment_status === 'failed'
                ? 'bg-red-50 text-red-700'
                : 'bg-harvest/10 text-harvest',
            ]"
          >
            {{ order.payment_status }}
          </span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useOrdersStore } from "../stores/orders";
import { useAuthStore } from "../stores/auth";

// Fixed against the real orders.ts (I'd only guessed at its shape before):
// the store exposes `orders`, not `myOrders`, and fetchMyOrders requires
// the user's id as an argument.
const ordersStore = useOrdersStore();
const auth = useAuthStore();

onMounted(() => {
  if (auth.user) ordersStore.fetchMyOrders(auth.user.id);
});
</script>
