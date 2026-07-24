<template>
  <div
    class="group flex flex-col bg-white rounded-2xl overflow-hidden border-2 border-earth-100 hover:border-forest-300 hover:shadow-lg transition-all duration-300"
  >
    <!-- Image + name link to detail page -->
    <RouterLink :to="`/products/${product.slug}`" class="block">
      <div class="relative h-40 overflow-hidden bg-parchment">
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          @error="handleImgError"
        />
        <span
          :class="[
            'absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-semibold border',
            product.type === 'export'
              ? 'bg-forest-600/90 text-white border-forest-500 backdrop-blur-sm'
              : 'bg-earth-800/80 text-white border-earth-700 backdrop-blur-sm',
          ]"
        >
          {{ product.type === "export" ? "✈ Export" : "🏪 Local" }}
        </span>
      </div>
    </RouterLink>

    <div class="flex flex-col flex-1 p-4">
      <RouterLink :to="`/products/${product.slug}`">
        <h3
          class="font-bold text-sm text-earth-900 mb-1 group-hover:text-forest-700 transition-colors duration-200 line-clamp-1"
        >
          {{ product.name }}
        </h3>
      </RouterLink>
      <p class="text-xs text-earth-500 leading-relaxed mb-3 line-clamp-2 flex-1">
        {{ product.detail }}
      </p>

      <!-- Local: live price + quick add-to-cart -->
      <template v-if="product.type === 'local'">
        <span
          v-if="pricesStore.loading && !price"
          class="text-xs text-earth-400 mb-2 block"
        >
          Loading price…
        </span>
        <template v-else-if="price">
          <p class="text-sm font-bold text-forest-700 mb-2">
            {{ pricesStore.formatNgn(price.price_ngn) }}
            <span class="text-xs font-normal text-earth-400">/ {{ price.unit }}</span>
          </p>
          <!-- Compact single button, not the full AddToCartButton widget —
               that component is a stepper + button combo (~280px+) built
               for the spacious product detail page and overflows a grid
               card. Adjust quantity from the cart page instead. -->
          <button
            type="button"
            class="btn-primary w-full justify-center !py-2 !text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="!price.is_available"
            @click="handleQuickAdd"
          >
            {{ justAdded ? "Added ✓" : "Add to Cart" }}
          </button>
        </template>
        <span v-else class="text-xs text-earth-400 mb-2 block">Price unavailable</span>
      </template>

      <!-- Export: no direct purchase, view details / quote path -->
      <RouterLink
        v-else
        :to="`/products/${product.slug}`"
        class="btn-outline w-full justify-center !py-2 !text-xs"
      >
        View Details →
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Product } from "../../data/products";
import { usePricesStore } from "../../stores/prices";
import { useCartStore } from "../../stores/cart";

const props = defineProps<{ product: Product }>();

const pricesStore = usePricesStore();
const cart = useCartStore();
const justAdded = ref(false);

// Only fetch prices once per app load — if another component already
// triggered fetchPrices(), this is a no-op cache hit via priceMap.
onMounted(() => {
  if (props.product.type === "local" && pricesStore.prices.length === 0) {
    pricesStore.fetchPrices();
  }
});

const price = computed(() => pricesStore.priceMap[props.product.slug] ?? null);

function handleQuickAdd() {
  if (!price.value) return;
  cart.addItem({
    product_slug: props.product.slug,
    product_name: props.product.name,
    image: props.product.image,
    unit: price.value.unit,
    min_qty: price.value.min_qty,
    price_ngn: price.value.price_ngn,
  });
  justAdded.value = true;
  setTimeout(() => {
    justAdded.value = false;
  }, 1800);
}

const handleImgError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src =
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80&fit=crop";
};
</script>
