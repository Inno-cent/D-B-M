<template>
  <div
    class="group flex flex-col bg-white rounded-2xl overflow-hidden
           border border-earth-100 shadow-sm
           hover:shadow-xl hover:shadow-earth-200/60
           hover:-translate-y-1 transition-all duration-300"
  >
    <!-- Image (links to detail page) -->
    <RouterLink :to="`/products/${product.slug}`" class="block">
      <div
        class="relative flex items-center justify-center
               bg-white product-image-bg min-h-[200px] p-4"
      >
        <img
          :src="product.image"
          :alt="product.name"
          class="max-h-48 w-auto object-contain
                 group-hover:scale-105 transition-transform duration-500
                 drop-shadow-sm"
          loading="lazy"
          @error="handleImgError"
        />

        <span
          :class="[
            'absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full',
            'font-semibold border backdrop-blur-sm',
            product.type === 'export'
              ? 'bg-forest-600/90 text-white border-forest-500'
              : 'bg-earth-800/80 text-white border-earth-700',
          ]"
        >
          {{ product.type === "export" ? "✈ Export" : "🏪 Local" }}
        </span>
      </div>
    </RouterLink>

    <!-- Content -->
    <div class="flex flex-col flex-1 p-4 border-t border-earth-100">
      <RouterLink :to="`/products/${product.slug}`">
        <h3
          class="font-bold text-sm text-earth-900 mb-1 leading-snug
                 group-hover:text-forest-700 transition-colors duration-200 line-clamp-1"
        >
          {{ product.name }}
        </h3>
      </RouterLink>
      <p class="text-xs text-earth-400 leading-relaxed mb-3 line-clamp-2 flex-1">
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

        <!-- Variant products (Palm Oil, Rice, Garri, Milk, Sugar, Salt,
             Tomato Paste, etc.) have no product_prices row at their own
             top-level slug — pricing lives on each variant's slug
             instead ('palm-oil--1l', not 'palm-oil'). `price` below
             resolves to the cheapest available variant for display, and
             the CTA routes to the detail page instead of quick-adding —
             a grid card can't safely add a specific brand/size to the
             cart without the shopper picking one. -->
        <template v-else-if="price">
          <p class="text-sm font-bold text-forest-700 mb-2">
            <span v-if="hasVariants" class="text-xs font-normal text-earth-500"
              >From
            </span>
            {{ pricesStore.formatNgn(price.price_ngn) }}
            <span class="text-xs font-normal text-earth-400">/ {{ price.unit }}</span>
          </p>

          <RouterLink
            v-if="hasVariants"
            :to="`/products/${product.slug}`"
            class="btn-outline w-full justify-center !py-2 !text-xs"
          >
            View Options →
          </RouterLink>

          <!-- Single-SKU local products: quick add-to-cart as before.
               Compact single button, not the full AddToCartButton widget
               (that's a stepper+button combo built for the detail page
               and overflows a grid card). -->
          <button
            v-else
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

const hasVariants = computed(
  () => !!props.product.variants && props.product.variants.length > 0
);

// Variant products resolve to the cheapest available variant's price
// (falls back to the cheapest variant overall if none are marked
// available, so the card still shows a "From" price rather than going
// blank); single-SKU products look up their own slug directly.
const price = computed(() => {
  if (hasVariants.value) {
    const variantPrices = props.product
      .variants!.map((v) => pricesStore.priceMap[v.slug])
      .filter((p): p is NonNullable<typeof p> => !!p);
    if (variantPrices.length === 0) return null;
    const available = variantPrices.filter((p) => p.is_available);
    const pool = available.length > 0 ? available : variantPrices;
    return pool.reduce((min, p) => (p.price_ngn < min.price_ngn ? p : min));
  }
  return pricesStore.priceMap[props.product.slug] ?? null;
});

function handleQuickAdd() {
  // Only reachable for single-SKU products (button is v-else on
  // hasVariants above) — variant products route to the detail page
  // instead, so `product.slug` here is always a real priced slug.
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
  img.src = "https://placehold.co/400x400/f5f0e6/8f7a5e?text=NIL";
};
</script>

<style scoped>
.product-image-bg {
  background-color: #ffffff;
  background-image: radial-gradient(circle, #e8e2d8 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>