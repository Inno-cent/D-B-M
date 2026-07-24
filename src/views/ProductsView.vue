<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="max-w-7xl mx-auto px-6 md:px-10 py-8">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-xs text-earth-400 mb-6">
        <RouterLink to="/" class="hover:text-forest-700 transition-colors"
          >Home</RouterLink
        >
        <span>›</span>
        <span class="text-earth-700 font-medium">Shop</span>
      </div>

      <div class="grid lg:grid-cols-[220px_1fr] gap-8">
        <!-- Sidebar -->
        <aside class="lg:sticky lg:top-[152px] h-fit">
          <h3 class="font-bold text-sm text-earth-900 mb-3">Type</h3>
          <nav class="flex lg:flex-col gap-1.5 flex-wrap mb-6">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="filter = tab.value"
              :class="[
                'text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-between gap-2',
                filter === tab.value
                  ? 'bg-forest-700 text-white'
                  : 'text-earth-700 hover:bg-earth-50',
              ]"
            >
              <span>{{ tab.label }}</span>
              <span
                :class="filter === tab.value ? 'text-forest-100' : 'text-earth-400'"
                class="text-xs"
              >
                {{ tab.count }}
              </span>
            </button>
          </nav>

          <h3 class="font-bold text-sm text-earth-900 mb-3">Category</h3>
          <nav class="flex lg:flex-col gap-1.5 flex-wrap mb-8">
            <button
              type="button"
              :class="[
                'text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                !selectedCategory
                  ? 'bg-forest-700 text-white'
                  : 'text-earth-700 hover:bg-earth-50',
              ]"
              @click="selectedCategory = null"
            >
              All Categories
            </button>
            <button
              v-for="cat in categoriesWithCounts"
              :key="cat.slug"
              type="button"
              :disabled="cat.count === 0"
              :class="[
                'text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-between gap-2 disabled:opacity-40 disabled:cursor-not-allowed',
                selectedCategory === cat.slug
                  ? 'bg-forest-700 text-white'
                  : 'text-earth-700 hover:bg-earth-50',
              ]"
              @click="selectedCategory = cat.slug"
            >
              <span>{{ cat.label }}</span>
              <span
                :class="
                  selectedCategory === cat.slug ? 'text-forest-100' : 'text-earth-400'
                "
                class="text-xs"
              >
                {{ cat.count }}
              </span>
            </button>
          </nav>

          <!-- Search -->
          <h3 class="font-bold text-sm text-earth-900 mb-3">Search</h3>
          <div class="relative mb-8">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              v-model="search"
              type="text"
              placeholder="Search products..."
              class="pl-9 pr-3 py-2.5 border-2 border-earth-200 rounded-lg text-sm w-full bg-white text-earth-900 outline-none focus:border-forest-400 transition-all duration-200 placeholder:text-earth-400"
            />
          </div>

          <!-- WhatsApp help banner -->
          <div
            class="hidden lg:block rounded-xl bg-forest-50 border-2 border-forest-100 p-4"
          >
            <p class="text-sm font-semibold text-earth-900 mb-1">Need help choosing?</p>
            <p class="text-xs text-earth-600 mb-3">Chat with us on WhatsApp</p>
            <a
              href="https://wa.me/2348123456789"
              target="_blank"
              rel="noopener"
              class="btn-primary w-full justify-center !py-2 !text-xs"
            >
              Chat Now
            </a>
          </div>
        </aside>

        <!-- Main -->
        <div>
          <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h1 class="text-2xl font-bold text-earth-900">
                {{ activeTabLabel }}
              </h1>
              <p class="text-sm text-earth-500 mt-0.5">
                Showing
                <span class="font-semibold text-earth-900">{{ filtered.length }}</span>
                {{ filtered.length === 1 ? "product" : "products" }}
                <span v-if="search">
                  for "<span class="text-forest-600">{{ search }}</span
                  >"</span
                >
              </p>
            </div>

            <select
              v-model="sort"
              class="border-2 border-earth-200 rounded-lg text-sm px-3 py-2 bg-white text-earth-700 outline-none focus:border-forest-400"
            >
              <option value="default">Sort by: Popular</option>
              <option value="name">Sort by: Name (A–Z)</option>
              <option value="price">Sort by: Price (low to high)</option>
            </select>
          </div>

          <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            <div
              v-for="(p, i) in sorted"
              :key="p.slug"
              data-reveal
              :data-reveal-delay="String((i % 4) + 1)"
            >
              <ProductCard :product="p" />
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="filtered.length === 0" class="text-center py-24">
            <p class="text-5xl mb-4">🔍</p>
            <p class="text-earth-500 text-lg mb-2">No products found</p>
            <p class="text-earth-400 text-sm mb-6">
              Try a different search term or category
            </p>
            <button
              @click="
                search = '';
                filter = 'all';
                selectedCategory = null;
              "
              class="btn-outline"
            >
              Clear filters
            </button>
          </div>

          <!-- Bottom CTA — kept from the original: catch-all for anything
               not in the listed catalogue -->
          <div
            class="mt-14 border-2 border-earth-200 rounded-2xl p-8 bg-parchment flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 class="text-xl font-bold mb-1 text-earth-900">
                Can't find what you need?
              </h3>
              <p class="text-earth-600 text-sm">
                We source beyond our listed catalogue. Tell us what you're looking for.
              </p>
            </div>
            <RouterLink
              to="/request-quote"
              class="btn-primary px-6 py-3 whitespace-nowrap"
            >
              Request a Quote →
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import ProductCard from "../components/products/ProductCard.vue";
import { products } from "../data/products";
import { categories } from "../data/categories";
import { useReveal } from "../composables/useReveal";
import { usePricesStore } from "../stores/prices";

const { observe } = useReveal();
onMounted(() => observe());

const route = useRoute();
const pricesStore = usePricesStore();

const filter = ref("all");
const search = ref("");
const sort = ref("default");
const selectedCategory = ref<string | null>(
  typeof route.query.category === "string" ? route.query.category : null
);

// Picks up ?q= from the header search bar and ?category= from the
// homepage's Shop by Category tiles (both routed here from elsewhere)
onMounted(() => {
  if (typeof route.query.q === "string") search.value = route.query.q;
  if (typeof route.query.category === "string")
    selectedCategory.value = route.query.category;
});
watch(
  () => route.query.q,
  (q) => {
    if (typeof q === "string") search.value = q;
  }
);
watch(
  () => route.query.category,
  (c) => {
    selectedCategory.value = typeof c === "string" ? c : null;
  }
);

const tabs = [
  { label: "All Products", value: "all", count: products.length },
  {
    label: "Export",
    value: "export",
    count: products.filter((p) => p.type === "export").length,
  },
  {
    label: "Local Wholesale",
    value: "local",
    count: products.filter((p) => p.type === "local").length,
  },
];



const activeTabLabel = computed(() => {
  const catLabel = selectedCategory.value
    ? categories.find((c) => c.slug === selectedCategory.value)?.label
    : null;
  const typeLabel = tabs.find((t) => t.value === filter.value)?.label ?? "All Products";
  return catLabel ?? typeLabel;
});

const filtered = computed(() => {
  let list =
    filter.value === "all" ? products : products.filter((p) => p.type === filter.value);

  if (selectedCategory.value) {
    list = list.filter((p) => p.category === selectedCategory.value);
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.detail.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q)
    );
  }

  return list;
});

// Price sort only affects local products with a fetched price — export
// items (no numeric price) keep catalogue order and sort to the end.
const sorted = computed(() => {
  const list = [...filtered.value];
  if (sort.value === "name") {
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sort.value === "price") {
    return list.sort((a, b) => {
      const priceA = pricesStore.priceMap[a.slug]?.price_ngn;
      const priceB = pricesStore.priceMap[b.slug]?.price_ngn;
      if (priceA == null && priceB == null) return 0;
      if (priceA == null) return 1;
      if (priceB == null) return -1;
      return priceA - priceB;
    });
  }
  return list;
});
</script>
