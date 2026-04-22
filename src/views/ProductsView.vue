<template>
  <div class="bg-cream text-earth-900 min-h-screen">

    <!-- Page hero -->
    <div class="page-hero">
      <div class="max-w-7xl mx-auto">
        <span class="section-label">Our Catalogue</span>
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-earth-900">
          Products
        </h1>
        <p class="text-earth-600 text-lg max-w-xl mb-8">
          Browse export commodities and local wholesale goods from verified Nigerian suppliers.
        </p>

        <!-- Filters -->
        <div class="flex flex-wrap gap-3">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="filter = tab.value"
            :class="[
              'px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200',
              filter === tab.value
                ? 'bg-forest-700 text-white border-forest-700 shadow-lg shadow-forest-700/20'
                : 'border-earth-300 text-earth-700 hover:border-forest-400 hover:text-forest-700 bg-white'
            ]"
          >
            {{ tab.label }}
            <span class="ml-1.5 opacity-60 text-xs font-normal">{{ tab.count }}</span>
          </button>

          <!-- Search -->
          <div class="relative ml-auto">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="search"
              type="text"
              placeholder="Search products..."
              class="pl-9 pr-4 py-2.5 border-2 border-earth-300 rounded-xl text-sm
                     bg-white text-earth-900 outline-none
                     focus:border-forest-400 transition-all duration-200
                     placeholder:text-earth-400 w-48"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Grid -->
    <div class="max-w-7xl mx-auto px-6 md:px-10 py-14">

      <!-- Result count -->
      <p class="text-sm text-earth-500 mb-6">
        Showing <span class="font-semibold text-earth-900">{{ filtered.length }}</span>
        {{ filtered.length === 1 ? 'product' : 'products' }}
        <span v-if="search"> for "<span class="text-forest-600">{{ search }}</span>"</span>
      </p>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <div
          v-for="(p, i) in filtered"
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
          @click="search = ''; filter = 'all'"
          class="btn-outline"
        >
          Clear filters
        </button>
      </div>
    </div>

    <!-- Bottom CTA -->
    <div class="border-t-2 border-earth-200 py-16 px-6 md:px-10 bg-parchment">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 class="text-2xl font-bold mb-2 text-earth-900">Can't find what you need?</h3>
          <p class="text-earth-600">
            We source beyond our listed catalogue. Tell us what you're looking for.
          </p>
        </div>
        <RouterLink to="/request-quote" class="btn-primary px-8 py-4 whitespace-nowrap">
          Request a Quote →
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProductCard from '../components/products/ProductCard.vue'
import { products } from '../data/products'
import { useReveal } from '../composables/useReveal'

const { observe } = useReveal()
onMounted(() => observe())

const filter = ref('all')
const search = ref('')

const tabs = [
  { label: 'All Products',    value: 'all',    count: products.length },
  { label: 'Export',          value: 'export', count: products.filter(p => p.type === 'export').length },
  { label: 'Local Wholesale', value: 'local',  count: products.filter(p => p.type === 'local').length },
]

const filtered = computed(() => {
  let list = filter.value === 'all'
    ? products
    : products.filter(p => p.type === filter.value)

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.detail.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q)
    )
  }

  return list
})
</script>