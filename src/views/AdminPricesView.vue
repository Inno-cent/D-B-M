<template>
  <div class="bg-cream text-earth-900 min-h-screen pt-24 pb-16">
    <div class="max-w-4xl mx-auto px-6 md:px-10">
      <div class="mb-10">
        <span class="section-label">Admin</span>
        <h1 class="text-4xl font-bold tracking-tight mb-2 text-earth-900">
          Manage Prices
        </h1>
        <p class="text-earth-600">
          Update today's prices for local produce. Every change is logged with a timestamp
          and your account, for dispute resolution.
        </p>
      </div>

      <!-- Loading state -->
      <div
        v-if="pricesStore.loading && pricesStore.prices.length === 0"
        class="text-earth-400 py-12 text-center"
      >
        Loading prices…
      </div>

      <!-- Error state -->
      <div
        v-else-if="pricesStore.error"
        class="text-red-600 bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6"
      >
        {{ pricesStore.error }}
      </div>

      <!-- Price rows -->
      <div v-else class="flex flex-col gap-4">
        <div
          v-for="row in editableRows"
          :key="row.product_slug"
          class="border-2 border-earth-200 rounded-2xl bg-white p-5"
        >
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <!-- Product name + unit -->
            <div class="flex-1 min-w-[140px]">
              <p class="font-bold text-earth-900">{{ row.product_name }}</p>
              <p class="text-xs text-earth-400">
                per {{ row.unit }} · min {{ row.min_qty }}
              </p>
            </div>

            <!-- Price input -->
            <div class="flex items-center gap-2">
              <span class="text-earth-400 font-semibold">₦</span>
              <input
                v-model.number="row.draftPrice"
                type="number"
                min="0"
                step="1"
                class="w-32 px-3 py-2 border-2 border-earth-200 rounded-xl text-sm bg-white text-earth-900 outline-none focus:border-forest-400 transition-all duration-200"
              />
            </div>

            <!-- Availability toggle -->
            <label class="flex items-center gap-2 text-sm text-earth-600 cursor-pointer">
              <input
                v-model="row.draftAvailable"
                type="checkbox"
                class="w-4 h-4 accent-forest-600"
              />
              Available
            </label>

            <!-- Save -->
            <button
              @click="handleSave(row)"
              :disabled="row.saving || !hasChanges(row)"
              class="btn-primary px-5 py-2 text-sm whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {{ row.saving ? "Saving…" : "Save" }}
            </button>

            <!-- History toggle -->
            <button
              @click="toggleHistory(row.product_slug)"
              class="text-xs font-semibold text-forest-600 underline whitespace-nowrap"
            >
              {{ openHistorySlug === row.product_slug ? "Hide history" : "View history" }}
            </button>
          </div>

          <!-- Saved confirmation -->
          <p v-if="row.justSaved" class="text-xs text-forest-600 font-semibold mt-3">
            ✓ Saved — last updated just now
          </p>
          <p v-else class="text-xs text-earth-400 mt-3">
            Last updated {{ formatRelativeTime(row.last_updated) }}
          </p>

          <!-- History panel -->
          <div
            v-if="openHistorySlug === row.product_slug"
            class="mt-4 pt-4 border-t-2 border-earth-100"
          >
            <p v-if="historyLoading" class="text-xs text-earth-400">Loading history…</p>
            <p
              v-else-if="historyBySlug[row.product_slug]?.length === 0"
              class="text-xs text-earth-400"
            >
              No price changes logged yet.
            </p>
            <ul v-else class="flex flex-col gap-2">
              <li
                v-for="h in historyBySlug[row.product_slug]"
                :key="h.id"
                class="text-xs text-earth-500 flex justify-between"
              >
                <span>
                  {{
                    h.old_price_ngn !== null
                      ? pricesStore.formatNgn(h.old_price_ngn)
                      : "New listing"
                  }}
                  →
                  <span class="font-semibold text-earth-700">{{
                    pricesStore.formatNgn(h.new_price_ngn)
                  }}</span>
                </span>
                <span>{{ formatRelativeTime(h.changed_at) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { usePricesStore } from "../stores/prices";
import type { ProductPrice, PriceHistory } from "../types/database";

const pricesStore = usePricesStore();

interface EditableRow extends ProductPrice {
  draftPrice: number;
  draftAvailable: boolean;
  saving: boolean;
  justSaved: boolean;
}

const editableRows = ref<EditableRow[]>([]);

const syncRowsFromStore = () => {
  editableRows.value = pricesStore.prices.map((p) => ({
    ...p,
    draftPrice: p.price_ngn,
    draftAvailable: p.is_available,
    saving: false,
    justSaved: false,
  }));
};

onMounted(async () => {
  await pricesStore.fetchPrices();
  syncRowsFromStore();
});

const hasChanges = (row: EditableRow) =>
  row.draftPrice !== row.price_ngn || row.draftAvailable !== row.is_available;

const handleSave = async (row: EditableRow) => {
  row.saving = true;
  try {
    if (row.draftPrice !== row.price_ngn) {
      const updated = await pricesStore.updatePrice(row.product_slug, row.draftPrice);
      row.price_ngn = updated.price_ngn;
      row.last_updated = updated.last_updated;
    }
    if (row.draftAvailable !== row.is_available) {
      const updated = await pricesStore.setAvailability(
        row.product_slug,
        row.draftAvailable
      );
      row.is_available = updated.is_available;
      row.last_updated = updated.last_updated;
    }
    row.justSaved = true;
    setTimeout(() => {
      row.justSaved = false;
    }, 3000);

    // Refresh history if it's currently open for this row
    if (openHistorySlug.value === row.product_slug) {
      await loadHistory(row.product_slug);
    }
  } catch (e) {
    pricesStore.error = e instanceof Error ? e.message : "Failed to save";
  } finally {
    row.saving = false;
  }
};

// ── History ──────────────────────────────────────────────────────
const openHistorySlug = ref<string | null>(null);
const historyLoading = ref(false);
const historyBySlug = reactive<Record<string, PriceHistory[]>>({});

const loadHistory = async (slug: string) => {
  historyLoading.value = true;
  try {
    historyBySlug[slug] = await pricesStore.fetchHistory(slug);
  } finally {
    historyLoading.value = false;
  }
};

const toggleHistory = async (slug: string) => {
  if (openHistorySlug.value === slug) {
    openHistorySlug.value = null;
    return;
  }
  openHistorySlug.value = slug;
  if (!historyBySlug[slug]) await loadHistory(slug);
};

const formatRelativeTime = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
};
</script>
