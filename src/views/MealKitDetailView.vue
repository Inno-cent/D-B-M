<template>
  <div class="bg-cream text-earth-900 min-h-screen pb-24">
    <div v-if="kit" class="max-w-6xl mx-auto px-6 md:px-10 py-8">
      <RouterLink
        to="/meal-kits"
        class="inline-flex items-center gap-1.5 text-sm text-earth-500 hover:text-forest-700 transition-colors mb-6"
      >
        ‹ Back to Meal Kits
      </RouterLink>

      <div class="grid lg:grid-cols-2 gap-10">
        <!-- Left: images -->
        <div data-reveal>
          <div
            class="rounded-2xl overflow-hidden border-2 border-earth-100 h-72 md:h-96 mb-3"
          >
            <img :src="activeImage" :alt="kit.name" class="w-full h-full object-cover" />
          </div>
          <div v-if="kit.galleryImages.length > 1" class="flex gap-2">
            <button
              v-for="(img, i) in kit.galleryImages"
              :key="i"
              type="button"
              class="w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0"
              :class="
                activeImage === img
                  ? 'border-forest-500'
                  : 'border-earth-100 hover:border-earth-300'
              "
              @click="activeImage = img"
            >
              <img :src="img" :alt="kit.name" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Right: info -->
        <div data-reveal data-reveal-delay="2">
          <h1 class="text-2xl md:text-3xl font-bold text-earth-900 mb-2">
            {{ kit.name }}
          </h1>

          <div class="flex items-center gap-1.5 mb-3">
            <span class="flex text-harvest text-sm">
              <span v-for="n in 5" :key="n">{{
                n <= Math.round(kit.rating) ? "★" : "☆"
              }}</span>
            </span>
            <span class="text-xs text-earth-500"
              >{{ kit.rating }} ({{ kit.reviewCount }} reviews)</span
            >
          </div>

          <p class="text-earth-600 text-sm leading-relaxed mb-6">{{ kit.tagline }}</p>

          <!-- Family size -->
          <h3 class="font-bold text-xs uppercase tracking-widest text-earth-500 mb-3">
            Choose Family Size
          </h3>
          <div class="grid grid-cols-3 gap-2 mb-6">
            <button
              v-for="(size, i) in kit.sizes"
              :key="size.servings"
              type="button"
              :class="[
                'border-2 rounded-xl px-3 py-2.5 text-center transition-all duration-150',
                activeSizeIndex === i
                  ? 'border-forest-600 bg-forest-50'
                  : 'border-earth-200 hover:border-earth-300',
              ]"
              @click="activeSizeIndex = i"
            >
              <p class="text-xs font-semibold text-earth-800">
                Serves {{ size.servings }}
              </p>
              <p class="text-sm font-bold text-forest-700">
                ₦{{ size.priceNgn.toLocaleString() }}
              </p>
            </button>
          </div>

          <!-- Ingredients -->
          <h3 class="font-bold text-xs uppercase tracking-widest text-earth-500 mb-3">
            What's Included
          </h3>
          <ul class="space-y-1.5 mb-2">
            <li
              v-for="ing in visibleIngredients"
              :key="ing.name"
              class="flex items-center justify-between text-sm text-earth-700 border-b border-earth-100 py-1.5"
            >
              <span class="flex items-center gap-2">
                <span class="text-forest-600">✓</span>
                {{ ing.name }}
              </span>
              <span class="text-earth-400 text-xs">{{ ing.amount }}</span>
            </li>
          </ul>
          <button
            v-if="kit.ingredients.length > 6"
            type="button"
            class="text-forest-700 text-xs font-semibold mb-6 hover:text-forest-800"
            @click="showAllIngredients = !showAllIngredients"
          >
            {{ showAllIngredients ? "Show less ↑" : "Show more ↓" }}
          </button>
          <div v-else class="mb-6" />

          <!-- Add-on proteins -->
          <template v-if="kit.addOns.length">
            <h3 class="font-bold text-xs uppercase tracking-widest text-earth-500 mb-3">
              Add-on Proteins (Optional)
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div
                v-for="addOn in kit.addOns"
                :key="addOn.id"
                class="border-2 border-earth-100 rounded-xl overflow-hidden"
              >
                <img
                  :src="addOn.image"
                  :alt="addOn.name"
                  class="w-full h-16 object-cover"
                />
                <div class="p-2">
                  <p class="text-xs font-semibold text-earth-800 truncate">
                    {{ addOn.name }}
                  </p>
                  <p class="text-xs text-earth-500 mb-1.5">
                    ₦{{ addOn.priceNgn.toLocaleString() }}
                  </p>
                  <div class="flex items-center justify-between">
                    <button
                      type="button"
                      class="w-6 h-6 rounded-full border border-earth-200 text-earth-600 text-xs flex items-center justify-center hover:border-forest-400"
                      @click="decrementAddOn(addOn.id)"
                    >
                      −
                    </button>
                    <span class="text-xs font-semibold w-4 text-center">{{
                      addOnQty[addOn.id] || 0
                    }}</span>
                    <button
                      type="button"
                      class="w-6 h-6 rounded-full border border-earth-200 text-earth-600 text-xs flex items-center justify-center hover:border-forest-400"
                      @click="incrementAddOn(addOn.id)"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 404 -->
    <div v-else class="max-w-6xl mx-auto px-6 md:px-10 py-32 text-center">
      <p class="text-5xl mb-4">🔍</p>
      <h2 class="text-2xl font-bold mb-4 text-earth-900">Meal kit not found</h2>
      <RouterLink to="/meal-kits" class="btn-primary">← Back to Meal Kits</RouterLink>
    </div>

    <!-- Sticky bottom bar -->
    <div
      v-if="kit"
      class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-earth-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-40"
    >
      <div
        class="max-w-6xl mx-auto px-6 md:px-10 py-3 flex items-center justify-between gap-4"
      >
        <div>
          <p class="text-xs text-earth-500">Total</p>
          <p class="text-lg font-bold text-forest-700">₦{{ total.toLocaleString() }}</p>
        </div>

        <div class="flex items-center gap-3">
          <div
            class="flex items-center gap-3 border-2 border-earth-200 rounded-xl px-2 py-1.5"
          >
            <button
              type="button"
              class="w-6 h-6 flex items-center justify-center text-earth-600 hover:text-forest-700"
              @click="qty = Math.max(1, qty - 1)"
            >
              −
            </button>
            <span class="text-sm font-semibold w-4 text-center">{{ qty }}</span>
            <button
              type="button"
              class="w-6 h-6 flex items-center justify-center text-earth-600 hover:text-forest-700"
              @click="qty += 1"
            >
              +
            </button>
          </div>

          <!-- Composes size + add-ons into one flat cart line — see
               handleAddToCart() for why. Navigates to /cart on success. -->
          <button type="button" class="btn-primary px-6 py-3" @click="handleAddToCart">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mealKits } from "../data/mealKits";
import { useCartStore } from "../stores/cart";
import { useReveal } from "../composables/useReveal";

const route = useRoute();
const router = useRouter();
const cart = useCartStore();
const { observe } = useReveal();
onMounted(() => observe());

const kit = computed(() => mealKits.find((k) => k.slug === route.params.slug));

const activeImage = ref(kit.value?.galleryImages[0] ?? "");
const activeSizeIndex = ref(0);
const showAllIngredients = ref(false);
const qty = ref(1);
const addOnQty = ref<Record<string, number>>({});

watch(kit, (newKit) => {
  activeImage.value = newKit?.galleryImages[0] ?? "";
  activeSizeIndex.value = 0;
  showAllIngredients.value = false;
  qty.value = 1;
  addOnQty.value = {};
});

const visibleIngredients = computed(() => {
  if (!kit.value) return [];
  return showAllIngredients.value
    ? kit.value.ingredients
    : kit.value.ingredients.slice(0, 6);
});

function incrementAddOn(id: string) {
  addOnQty.value[id] = (addOnQty.value[id] || 0) + 1;
}
function decrementAddOn(id: string) {
  addOnQty.value[id] = Math.max(0, (addOnQty.value[id] || 0) - 1);
}

const total = computed(() => {
  const k = kit.value;
  if (!k) return 0;
  const sizePrice = k.sizes[activeSizeIndex.value]?.priceNgn ?? 0;
  const addOnsTotal = k.addOns.reduce(
    (sum, a) => sum + a.priceNgn * (addOnQty.value[a.id] || 0),
    0
  );
  return (sizePrice + addOnsTotal) * qty.value;
});

// Kit + chosen size + selected add-ons are composed into a single flat
// cart line — the store's CartItem type has no room for structured
// add-ons, and extending it would touch orders.ts / the checkout flow,
// which is confirmed-working in production and off-limits for now.
// Different size/add-on combos of the same kit get distinct composite
// slugs, so they correctly stay as separate cart lines rather than merging.
//
// Known limitation: ordersStore.reconfirmPrices() looks up live prices by
// product_slug against the product_prices table — that table only has
// entries for real products, not meal kits, so kit lines simply won't be
// price-reconfirmed at checkout (fetchPriceBySlug returns null and is
// skipped, not treated as an error). Acceptable for now since kit prices
// aren't in that live-pricing system, but worth knowing.
function handleAddToCart() {
  const k = kit.value;
  if (!k) return;
  const size = k.sizes[activeSizeIndex.value];
  if (!size) return; // shouldn't happen (activeSizeIndex is always a valid sizes index), but guards the type
  const selectedAddOns = k.addOns.filter((a) => (addOnQty.value[a.id] || 0) > 0);

  const addOnsLabel = selectedAddOns
    .map((a) =>
      addOnQty.value[a.id] > 1 ? `${a.name} x${addOnQty.value[a.id]}` : a.name
    )
    .join(", ");
  const addOnsKey = selectedAddOns
    .map((a) => `${a.id}x${addOnQty.value[a.id]}`)
    .sort()
    .join("_");
  const unitPriceNgn =
    size.priceNgn +
    selectedAddOns.reduce((sum, a) => sum + a.priceNgn * (addOnQty.value[a.id] || 0), 0);

  cart.addItem(
    {
      product_slug: `${k.slug}--serves${size.servings}${
        addOnsKey ? `--${addOnsKey}` : ""
      }`,
      product_name: `${k.name} (Serves ${size.servings})${
        addOnsLabel ? ` + ${addOnsLabel}` : ""
      }`,
      image: k.image,
      unit: "kit",
      min_qty: 1,
      price_ngn: unitPriceNgn,
    },
    qty.value
  );

  router.push("/cart");
}
</script>
