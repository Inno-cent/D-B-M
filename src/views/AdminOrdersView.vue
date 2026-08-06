<template>
  <div class="bg-cream text-earth-900 min-h-screen pt-24 pb-16">
    <div class="max-w-5xl mx-auto px-6 md:px-10">
      <div class="mb-10">
        <span class="section-label">Admin</span>
        <h1 class="text-4xl font-bold tracking-tight mb-2 text-earth-900">Orders</h1>
        <p class="text-earth-600">
          Every order across all customers. Click one to see full items and delivery
          details.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3 mb-6">
        <input
          v-model="search"
          type="text"
          placeholder="Search by ref, name, or phone..."
          class="flex-1 min-w-[220px] px-3 py-2.5 border-2 border-earth-200 rounded-xl text-sm bg-white text-earth-900 outline-none focus:border-forest-400 transition-all"
        />
        <div class="flex gap-1.5">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            @click="statusFilter = tab.value"
            :class="[
              'px-4 py-2 rounded-lg text-xs font-semibold transition-all',
              statusFilter === tab.value
                ? 'bg-forest-700 text-white'
                : 'bg-white border-2 border-earth-200 text-earth-600 hover:border-forest-300',
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div
        v-if="ordersStore.adminLoading && ordersStore.adminOrders.length === 0"
        class="text-earth-400 py-12 text-center"
      >
        Loading orders…
      </div>

      <div
        v-else-if="ordersStore.adminError"
        class="text-red-600 bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6"
      >
        {{ ordersStore.adminError }}
        <p class="text-xs mt-2 font-normal">
          If orders exist but nothing shows here, this is almost certainly a missing RLS
          SELECT policy on the <code>orders</code> table for admins — see the migration
          note I gave you.
        </p>
      </div>

      <div
        v-else-if="filteredOrders.length === 0"
        class="text-center py-20 border-2 border-earth-200 rounded-2xl bg-white"
      >
        <p class="text-4xl mb-3">📦</p>
        <p class="text-earth-600">No orders match this filter.</p>
      </div>

      <div v-else class="flex flex-col gap-3">
        <RouterLink
          v-for="order in filteredOrders"
          :key="order.ref"
          :to="`/orders/${order.ref}`"
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-white border-2 border-earth-200 rounded-xl hover:border-forest-300 transition-colors"
        >
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-earth-900 text-sm">
              {{ order.ref }}
              <span class="text-earth-400 font-normal">· {{ order.full_name }}</span>
            </p>
            <p class="text-xs text-earth-500">
              {{ order.phone }} · {{ order.state }} · {{ formatDate(order.created_at) }}
            </p>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <span class="font-semibold text-earth-900 text-sm">
              {{ formatNgn(order.total_ngn) }}
            </span>
            <span
              :class="[
                'text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap',
                order.payment_status === 'paid'
                  ? 'bg-forest-50 text-forest-700'
                  : order.payment_status === 'failed'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-harvest/10 text-harvest',
              ]"
            >
              {{ order.payment_status }}
            </span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useOrdersStore } from "../stores/orders";

const ordersStore = useOrdersStore();

onMounted(() => {
  ordersStore.fetchAllOrders();
});

const search = ref("");
const statusFilter = ref<"all" | "pending" | "paid" | "failed">("all");

const statusTabs: { label: string; value: "all" | "pending" | "paid" | "failed" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Failed", value: "failed" },
];

const filteredOrders = computed(() => {
  let list = ordersStore.adminOrders;
  if (statusFilter.value !== "all") {
    list = list.filter((o) => o.payment_status === statusFilter.value);
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter(
      (o) =>
        o.ref.toLowerCase().includes(q) ||
        o.full_name.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q)
    );
  }
  return list;
});

const formatNgn = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
</script>
