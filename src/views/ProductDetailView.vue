<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div v-if="product" class="max-w-7xl mx-auto px-6 md:px-10 py-8">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-xs text-earth-400 mb-6">
        <RouterLink to="/" class="hover:text-forest-700 transition-colors"
          >Home</RouterLink
        >
        <span>›</span>
        <RouterLink to="/products" class="hover:text-forest-700 transition-colors"
          >Shop</RouterLink
        >
        <span>›</span>
        <span class="text-earth-700 font-medium">{{ product.name }}</span>
      </div>

      <div class="grid lg:grid-cols-2 gap-10">
        <!-- Image -->
        <div data-reveal>
          <div
            class="rounded-2xl overflow-hidden border-2 border-earth-100 h-80 md:h-[420px] mb-4"
          >
            <!-- CHANGED: was :src="product.image" — now :src="displayImage",
                 which swaps to the selected variant's own photo when one
                 exists (see `displayImage` computed below). Falls back to
                 product.image for non-variant products and for variants
                 that don't have a photo yet, so behavior is unchanged for
                 everything that isn't a photographed variant. -->
            <img
              :src="displayImage"
              :alt="activeName || product.name"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Related products as thumbnails -->
          <div v-if="relatedProducts.length" class="flex gap-2">
            <RouterLink
              v-for="p in relatedProducts.slice(0, 5)"
              :key="p.slug"
              :to="`/products/${p.slug}`"
              class="w-14 h-14 rounded-lg overflow-hidden border-2 border-earth-100 hover:border-forest-400 transition-colors flex-shrink-0"
            >
              <img :src="p.image" :alt="p.name" class="w-full h-full object-cover" />
            </RouterLink>
          </div>
        </div>

        <!-- Info -->
        <div data-reveal data-reveal-delay="2">
          <span
            :class="[
              'text-xs px-3 py-1 rounded-full font-semibold mb-3 inline-block',
              product.type === 'export'
                ? 'bg-forest-50 text-forest-700 border border-forest-200'
                : 'bg-earth-50 text-earth-700 border border-earth-200',
            ]"
          >
            {{ product.type === "export" ? "✈ Export Commodity" : "🏪 Local Wholesale" }}
          </span>

          <h1 class="text-3xl font-bold text-earth-900 mb-2">{{ product.name }}</h1>
          <p class="text-earth-600 leading-relaxed mb-6">{{ product.tagline }}</p>

          <!-- Local: price + purchase -->
          <div v-if="product.type === 'local'" class="mb-6">
            <!-- Brand & size picker — only rendered when the product has
                 `variants`. Selecting one changes which slug pricing, Add
                 to Cart, and Buy Now all operate on (see `activeSlug`
                 below), AND now also changes the photo shown above via
                 `displayImage` — when that variant has its own `image`.
                 The original single-SKU products have no variants, so
                 this block simply doesn't render for them and everything
                 behaves exactly as before. -->
            <div v-if="product.variants?.length" class="mb-5">
              <h3 class="font-bold text-xs uppercase tracking-widest text-earth-500 mb-2">
                Choose Brand & Size
              </h3>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="v in product.variants"
                  :key="v.slug"
                  type="button"
                  :class="[
                    'px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all duration-150 text-left',
                    selectedVariantSlug === v.slug
                      ? 'bg-forest-700 text-white border-forest-700'
                      : 'bg-white text-earth-700 border-earth-200 hover:border-forest-400',
                  ]"
                  @click="selectedVariantSlug = v.slug"
                >
                  {{ v.brand }}
                  <span class="block font-normal opacity-80">{{ v.size }}</span>
                </button>
              </div>
            </div>

            <div v-if="pricesStore.loading && !price" class="text-sm text-earth-400">
              Loading current price…
            </div>

            <template v-else-if="price">
              <p class="text-3xl font-bold text-forest-700 mb-1">
                {{ pricesStore.formatNgn(price.price_ngn) }}
                <span class="text-base font-medium text-earth-500"
                  >/ {{ price.unit }}</span
                >
              </p>
              <p class="text-xs text-earth-400 mb-5">
                Min. order: {{ price.min_qty }} {{ price.unit
                }}{{ price.min_qty > 1 ? "s" : "" }} · Updated
                {{ formatRelativeTime(price.last_updated) }}
              </p>
              <p
                v-if="!price.is_available"
                class="text-xs text-red-600 font-semibold mb-4"
              >
                Currently unavailable
              </p>

              <div class="flex flex-col sm:flex-row gap-3">
                <!-- slug/name/image come from activeSlug/activeName/
                     displayImage (the selected variant's, when one
                     exists, else the product's own — unchanged behavior
                     for non-variant products). -->
                <AddToCartButton
                  :slug="activeSlug"
                  :name="activeName"
                  :image="displayImage"
                  :unit="price.unit"
                  :min-qty="price.min_qty"
                  :price-ngn="price.price_ngn"
                  :disabled="!price.is_available"
                  class="flex-1 justify-center py-3.5"
                />
                <!-- "Buy Now" = add to cart at minimum qty, then go straight
                     to checkout — confirmed against the real cart store. -->
                <button
                  type="button"
                  class="btn-outline flex-1 justify-center py-3.5"
                  :disabled="!price.is_available"
                  @click="handleBuyNow"
                >
                  Buy Now
                </button>
              </div>
            </template>

            <div v-else class="text-sm text-earth-500">
              Price currently unavailable — please check back shortly or
              <RouterLink to="/contact" class="text-forest-600 font-semibold underline"
                >contact us</RouterLink
              >.
            </div>
          </div>

          <!-- Export: quote-only, unchanged from original -->
          <div v-else class="mb-6">
            <RouterLink
              to="/request-quote"
              class="btn-primary w-full justify-center py-4 text-base mb-3"
            >
              Request a Quote for This Product →
            </RouterLink>
            <RouterLink to="/contact" class="btn-outline w-full justify-center py-3.5">
              Ask a Question
            </RouterLink>
          </div>

          <p class="text-earth-600 leading-relaxed mb-6 text-sm">
            {{ product.description }}
          </p>

          <!-- "Also available as" — cross-links related forms of the
               same conceptual product via the `family` field (e.g. fresh
               Tomato <-> Tomato Paste — Sachet <-> Tomato Paste — Pouch &
               Tin). Only renders when other family members exist. -->
          <div v-if="familyProducts.length" class="mb-6">
            <h3 class="font-bold text-xs uppercase tracking-widest text-earth-500 mb-3">
              Also Available As
            </h3>
            <div class="flex flex-wrap gap-2">
              <RouterLink
                v-for="fp in familyProducts"
                :key="fp.slug"
                :to="`/products/${fp.slug}`"
                class="px-3 py-2 rounded-lg text-xs font-semibold border-2 border-earth-200 bg-white text-earth-700 hover:border-forest-400 hover:text-forest-700 transition-all"
              >
                {{ fp.name }}
              </RouterLink>
            </div>
          </div>

          <!-- Specs -->
          <h3 class="font-bold text-xs uppercase tracking-widest text-earth-500 mb-3">
            Product Specifications
          </h3>
          <div class="border-2 border-earth-100 rounded-xl overflow-hidden mb-6">
            <div
              v-for="(spec, i) in product.specs"
              :key="spec.key"
              :class="[
                'flex justify-between items-center px-4 py-3 text-sm border-b-2 last:border-b-0 border-earth-50',
                i % 2 === 0 ? 'bg-white' : 'bg-parchment/60',
              ]"
            >
              <span class="text-earth-500 font-medium">{{ spec.key }}</span>
              <span class="font-semibold text-earth-900 text-right">{{
                spec.value
              }}</span>
            </div>
          </div>

          <!-- Applications -->
          <h3 class="font-bold text-xs uppercase tracking-widest text-earth-500 mb-3">
            Market Applications
          </h3>
          <div class="grid grid-cols-2 gap-2 mb-6">
            <div
              v-for="app in product.applications"
              :key="app"
              class="border-2 border-earth-100 rounded-lg px-3 py-2 text-xs text-earth-700 font-medium bg-white hover:border-forest-400 hover:text-forest-700 transition-all duration-200"
            >
              {{ app }}
            </div>
          </div>

          <!-- Trust badges -->
          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="badge in trustBadges"
              :key="badge.label"
              class="text-center p-3 bg-white border-2 border-earth-100 rounded-xl hover:border-forest-200 transition-all"
            >
              <div class="text-xl mb-1.5">{{ badge.icon }}</div>
              <p class="text-xs font-semibold text-earth-700">{{ badge.label }}</p>
              <p class="text-[11px] text-earth-400 mt-0.5">{{ badge.sub }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 404 state -->
    <div v-else class="max-w-7xl mx-auto px-6 md:px-10 py-32 text-center">
      <p class="text-5xl mb-4">🔍</p>
      <h2 class="text-2xl font-bold mb-4 text-earth-900">Product not found</h2>
      <p class="text-earth-500 mb-8">
        This product doesn't exist or may have been removed.
      </p>
      <RouterLink to="/products" class="btn-primary">← Back to Products</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { products } from "../data/products";
import { useReveal } from "../composables/useReveal";
import { usePricesStore } from "../stores/prices";
import { useCartStore } from "../stores/cart";
import AddToCartButton from "../components/products/AddToCartButton.vue";

const { observe } = useReveal();
onMounted(() => observe());

const route = useRoute();
const router = useRouter();
const pricesStore = usePricesStore();
const cart = useCartStore();

const product = computed(() => products.find((p) => p.slug === route.params.slug));

// p.type === product.value?.type is unaffected by the categories[]
// change (type is untouched) — left exactly as it was.
const relatedProducts = computed(() =>
  products
    .filter((p) => p.slug !== route.params.slug)
    .filter((p) => p.type === product.value?.type)
    .slice(0, 5)
);

// Other products sharing the same `family` (e.g. fresh Tomato links to
// Tomato Paste — Sachet and Tomato Paste — Pouch & Tin, and back).
const familyProducts = computed(() => {
  if (!product.value?.family) return [];
  return products.filter(
    (p) => p.family === product.value!.family && p.slug !== product.value!.slug
  );
});

// Which variant (brand + size) is currently selected, for products that
// have `variants`. Defaults to the first variant, and resets whenever
// the product itself changes (navigating between detail pages).
const selectedVariantSlug = ref<string | null>(null);
watch(
  product,
  (p) => {
    selectedVariantSlug.value = p?.variants?.[0]?.slug ?? null;
  },
  { immediate: true }
);

const selectedVariant = computed(
  () => product.value?.variants?.find((v) => v.slug === selectedVariantSlug.value) ?? null
);

// The slug/name that pricing, Add to Cart, and Buy Now all actually
// operate on — the selected variant's when the product has variants,
// otherwise the product's own slug/name (unchanged behavior for the
// original single-SKU products, which have no variants and so always
// fall through to this else branch).
const activeSlug = computed(
  () => selectedVariant.value?.slug ?? product.value?.slug ?? ""
);
const activeName = computed(() => {
  if (!product.value) return "";
  return selectedVariant.value
    ? `${product.value.name} — ${selectedVariant.value.brand} (${selectedVariant.value.size})`
    : product.value.name;
});

// NEW: the image actually shown on the detail page. Uses the selected
// variant's own photo when it has one; otherwise falls back to the
// parent product's placeholder image — same fallback for non-variant
// products (selectedVariant is always null for those) and for variants
// that haven't been photographed yet (e.g. the 3 Power Oil sizes with
// no `image` in products.ts).
const displayImage = computed(
  () => selectedVariant.value?.image ?? product.value?.image ?? ""
);

// Keyed off activeSlug instead of product.value.slug, so a
// variant-product's price reflects whichever brand+size is selected.
const price = computed(() =>
  activeSlug.value ? pricesStore.priceMap[activeSlug.value] ?? null : null
);

const fetchIfLocal = () => {
  if (product.value?.type === "local") {
    pricesStore.fetchPrices();
  }
};

onMounted(fetchIfLocal);
watch(() => route.params.slug, fetchIfLocal);

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

// Uses activeSlug/activeName/displayImage (selected variant, when
// present) instead of product.value.slug/name/image directly. Confirmed
// against the real cart store (stores/cart.ts) — same shape as before,
// just different source values, plus the variant's own photo now
// travels into the cart line item too.
function handleBuyNow() {
  if (!product.value || !price.value) return;
  cart.addItem({
    product_slug: activeSlug.value,
    product_name: activeName.value,
    image: displayImage.value,
    unit: price.value.unit,
    min_qty: price.value.min_qty,
    price_ngn: price.value.price_ngn,
  });
  router.push("/checkout");
}

const trustBadges = [
  { icon: "✓", label: "Verified Source", sub: "All suppliers audited" },
  { icon: "🔍", label: "Quality Checked", sub: "Pre-shipment inspection" },
  { icon: "📄", label: "Fully Documented", sub: "Export docs handled" },
];
</script>
