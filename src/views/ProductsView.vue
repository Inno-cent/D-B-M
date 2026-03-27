<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="page-hero">
      <div class="max-w-7xl mx-auto">
        <span class="section-label">Our Catalogue</span>
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-earth-900">
          Products
        </h1>
        <p class="text-earth-600 text-lg max-w-xl mb-8">
          Browse export commodities and local wholesale goods from verified Nigerian suppliers.
        </p>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="filter = tab.value"
            :class="[
              'px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200',
              filter === tab.value
                ? 'bg-forest-700 text-white border-forest-700'
                : 'border-earth-300 text-earth-700 hover:border-forest-400 hover:text-forest-700 bg-white'
            ]"
          >
            {{ tab.label }}
            <span class="ml-1.5 opacity-50 text-xs">{{ tab.count }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-10 py-16">
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
      <div v-if="filtered.length === 0" class="text-center py-24">
        <p class="text-5xl mb-4">🔍</p>
        <p class="text-earth-500 text-lg">No products in this category.</p>
      </div>
    </div>

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

const tabs = [
  { label: 'All',             value: 'all',    count: products.length },
  { label: 'Export',          value: 'export', count: products.filter(p => p.type === 'export').length },
  { label: 'Local Wholesale', value: 'local',  count: products.filter(p => p.type === 'local').length },
]

const filtered = computed(() =>
  filter.value === 'all' ? products : products.filter(p => p.type === filter.value)
)
</script>