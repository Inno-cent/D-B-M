<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="page-hero">
      <div class="max-w-5xl mx-auto">
        <span class="section-label">Your Order</span>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-earth-900">
          Cart
        </h1>
        <p class="text-earth-600 text-lg">Review your items before checkout.</p>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-6 md:px-10 py-12">
      <div v-if="cart.isEmpty" class="text-center py-20">
        <p class="text-6xl mb-5">🛒</p>
        <h3 class="text-xl font-bold text-earth-900 mb-3">Your cart is empty</h3>
        <p class="text-earth-500 mb-8 max-w-sm mx-auto leading-relaxed">
          Browse our local produce and add what you need — prices update live.
        </p>
        <RouterLink to="/products" class="btn-primary px-8 py-4"
          >Browse Products →</RouterLink
        >
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-10">
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cart.items"
            :key="item.product_slug"
            class="flex gap-4 p-5 bg-white border-2 border-earth-200 rounded-2xl"
          >
            <img
              :src="item.image"
              :alt="item.product_name"
              class="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-parchment border border-earth-100"
            />
            <div class="flex-1">
              <p class="font-bold text-earth-900">
                {{ item.product_name }} ({{ item.unit }})
              </p>
              <p class="text-sm text-earth-400 mt-0.5">
                {{ cart.formatNgn(item.price_ngn) }} / {{ item.unit }}
              </p>
              <div class="flex items-center gap-3 mt-3">
                <button
                  @click="cart.decrement(item.product_slug)"
                  :disabled="item.quantity <= item.min_qty"
                  class="w-7 h-7 rounded-lg border-2 border-earth-200 flex items-center justify-center text-earth-600 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:border-forest-400 transition-colors duration-200"
                >
                  −
                </button>
                <span class="text-sm font-semibold">
                  {{ item.quantity }} {{ item.unit }}{{ item.quantity > 1 ? "s" : "" }}
                </span>
                <button
                  @click="cart.increment(item.product_slug)"
                  class="w-7 h-7 rounded-lg border-2 border-earth-200 flex items-center justify-center text-earth-600 font-bold hover:border-forest-400 transition-colors duration-200"
                >
                  +
                </button>
              </div>
              <p
                v-if="item.quantity <= item.min_qty"
                class="text-xs text-earth-400 mt-1.5"
              >
                Minimum order: {{ item.min_qty }} {{ item.unit
                }}{{ item.min_qty > 1 ? "s" : "" }}
              </p>
            </div>
            <div class="text-right flex flex-col justify-between items-end">
              <p class="font-bold text-earth-900">
                {{ cart.formatNgn(item.price_ngn * item.quantity) }}
              </p>
              <button
                @click="cart.removeItem(item.product_slug)"
                class="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>

          <!-- You may also need -->
          <div v-if="suggestions.length" class="pt-6">
            <h3 class="font-bold text-earth-900 mb-4">You may also need</h3>
            <div class="grid sm:grid-cols-3 gap-4">
              <div
                v-for="s in suggestions"
                :key="s.slug"
                class="border-2 border-earth-200 rounded-xl p-3 bg-white flex flex-col"
              >
                <img
                  :src="s.product.image"
                  :alt="s.name"
                  class="w-full h-20 object-cover rounded-lg mb-2"
                />
                <p class="text-xs font-semibold text-earth-900 mb-1 line-clamp-1">
                  {{ s.name }}
                </p>
                <p v-if="s.price" class="text-xs font-bold text-forest-700 mb-2">
                  {{ cart.formatNgn(s.price.price_ngn) }}
                  <span class="font-normal text-earth-400">/ {{ s.price.unit }}</span>
                </p>
                <!-- Compact button, not the full AddToCartButton widget —
                     that's a stepper+button combo built for the spacious
                     product detail page; it overflows a card this narrow. -->
                <button
                  v-if="s.price"
                  type="button"
                  class="btn-primary mt-auto w-full justify-center !py-1.5 !text-xs"
                  @click="handleQuickAdd(s)"
                >
                  {{ justAddedSlug === s.slug ? "Added ✓" : "Add to Cart" }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="border-2 border-earth-200 rounded-2xl p-6 bg-white sticky top-24">
            <h3 class="font-bold text-earth-900 mb-5">Order Summary</h3>
            <div class="space-y-3 text-sm mb-5">
              <div class="flex justify-between text-earth-600">
                <span>Subtotal</span>
                <span class="font-semibold text-earth-900">{{
                  cart.formatNgn(cart.subtotalNgn)
                }}</span>
              </div>
              <div class="flex justify-between text-earth-600">
                <span>Delivery</span>
                <span class="text-earth-400">Calculated at checkout</span>
              </div>
            </div>
            <div class="border-t-2 border-earth-100 pt-4 mb-6">
              <div class="flex justify-between">
                <span class="font-bold text-earth-900">Total</span>
                <span class="font-bold text-earth-900 text-lg">{{
                  cart.formatNgn(cart.subtotalNgn)
                }}</span>
              </div>
            </div>
            <RouterLink to="/checkout" class="btn-primary w-full justify-center py-3.5">
              Proceed to Checkout →
            </RouterLink>
            <p class="text-xs text-earth-400 text-center mt-3">
              Prices are re-confirmed at checkout before you pay.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useCartStore } from "../stores/cart";
import { usePricesStore } from "../stores/prices";
import { products } from "../data/products";

const cart = useCartStore();
const pricesStore = usePricesStore();
const justAddedSlug = ref<string | null>(null);

onMounted(() => {
  if (pricesStore.prices.length === 0) pricesStore.fetchPrices();
});

// CHANGED: products with `variants` have no price at their own top-level
// slug anymore (pricing lives per brand+size variant) — quick-adding by
// product.slug would silently show no price for all 22 new branded
// products. Fixed by resolving each suggestion to its *first* variant
// (same default the product detail page opens on) when one exists, and
// falling through to the product's own slug otherwise — unchanged
// behavior for the original single-SKU products, which have no variants.
// This card is a compact quick-add, not a picker, so it can only ever
// offer one option; the full picker lives on the product detail page.
const suggestions = computed(() => {
  const inCart = new Set(cart.items.map((i) => i.product_slug));
  return products
    .filter((p) => p.type === "local")
    .map((p) => {
      const variant = p.variants?.[0] ?? null;
      const slug = variant?.slug ?? p.slug;
      const name = variant ? `${p.name} — ${variant.brand} (${variant.size})` : p.name;
      return {
        product: p,
        slug,
        name,
        price: pricesStore.priceMap[slug] ?? null,
      };
    })
    .filter((s) => !inCart.has(s.slug))
    .slice(0, 3);
});

// CHANGED: takes the whole suggestion entry (slug/name/price already
// resolved above) instead of just a Product, since a variant product's
// cartable slug/name differ from its own.
function handleQuickAdd(s: typeof suggestions.value[number]) {
  if (!s.price) return;
  cart.addItem({
    product_slug: s.slug,
    product_name: s.name,
    image: s.product.image,
    unit: s.price.unit,
    min_qty: s.price.min_qty,
    price_ngn: s.price.price_ngn,
  });
  justAddedSlug.value = s.slug;
  setTimeout(() => {
    justAddedSlug.value = null;
  }, 1800);
}
</script>
