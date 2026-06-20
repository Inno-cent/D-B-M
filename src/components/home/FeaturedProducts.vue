<template>
  <section class="py-24 px-6 md:px-10 bg-parchment border-b-2 border-earth-200">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-14" data-reveal>
        <span class="section-label">Our Catalogue</span>
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-earth-900 mb-4">
          What we source
        </h2>
        <p class="text-earth-600 text-lg max-w-2xl mx-auto">
          Local produce ready to buy at today's price, plus export commodities
          sourced to order from verified Nigerian suppliers.
        </p>
      </div>

      <!-- ── Local — buy now, live price ──────────────────────────── -->
      <div class="mb-14" data-reveal>
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 class="text-lg font-bold text-earth-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-forest-600" />
              Local Produce
            </h3>
            <p class="text-sm text-earth-500 mt-0.5">Buy now at today's price</p>
          </div>
          <RouterLink to="/products" class="text-sm font-semibold text-forest-600
                       hover:text-forest-700 transition-colors whitespace-nowrap">
            Browse all →
          </RouterLink>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <RouterLink
            v-for="(p, i) in localProducts"
            :key="p.slug"
            :to="`/products/${p.slug}`"
            data-reveal
            :data-reveal-delay="String((i % 4) + 1)"
            class="group border-2 border-earth-200 rounded-2xl overflow-hidden bg-white
                   hover:border-forest-400 hover:shadow-lg hover:scale-105
                   transition-all duration-300"
          >
            <div class="relative h-24 overflow-hidden">
              <img
                :src="p.image"
                :alt="p.name"
                class="w-full h-full object-cover group-hover:scale-110
                       transition-transform duration-500"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div class="p-3 text-center">
              <p class="text-sm font-semibold text-earth-800 leading-tight
                         group-hover:text-forest-700 transition-colors mb-1">
                {{ p.name }}
              </p>
              <span v-if="pricesStore.loading && !priceFor(p.slug)" class="text-xs text-earth-400">
                Loading…
              </span>
              <span v-else-if="priceFor(p.slug)" class="text-xs font-bold text-forest-700">
                {{ pricesStore.formatNgn(priceFor(p.slug)!.price_ngn) }}
                <span class="font-normal text-earth-400">/ {{ priceFor(p.slug)!.unit }}</span>
              </span>
              <span v-else class="text-xs text-earth-400">Price unavailable</span>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- ── Export — quote to order ──────────────────────────────── -->
      <div data-reveal>
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 class="text-lg font-bold text-earth-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-earth-500" />
              Export Commodities
            </h3>
            <p class="text-sm text-earth-500 mt-0.5">Sourced to order — request a quote</p>
          </div>
          <RouterLink to="/products" class="text-sm font-semibold text-forest-600
                       hover:text-forest-700 transition-colors whitespace-nowrap">
            Browse all →
          </RouterLink>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <RouterLink
            v-for="(p, i) in exportProducts"
            :key="p.slug"
            :to="`/products/${p.slug}`"
            data-reveal
            :data-reveal-delay="String((i % 6) + 1)"
            class="group border-2 border-earth-200 rounded-2xl overflow-hidden bg-white
                   hover:border-forest-400 hover:shadow-lg hover:scale-105
                   transition-all duration-300"
          >
            <div class="relative h-20 overflow-hidden">
              <img
                :src="p.image"
                :alt="p.name"
                class="w-full h-full object-cover group-hover:scale-110
                       transition-transform duration-500"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div class="p-2.5 text-center">
              <p class="text-xs font-semibold text-earth-800 leading-tight
                         group-hover:text-forest-700 transition-colors">
                {{ p.name }}
              </p>
              <span class="text-xs text-earth-500 mt-1 inline-block">Quote on request</span>
            </div>
          </RouterLink>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { products } from '../../data/products'
import { usePricesStore } from '../../stores/prices'

const pricesStore = usePricesStore()

onMounted(() => {
  if (pricesStore.prices.length === 0) pricesStore.fetchPrices()
})

const localProducts  = computed(() => products.filter(p => p.type === 'local').slice(0, 8))
const exportProducts = computed(() => products.filter(p => p.type === 'export').slice(0, 6))

const priceFor = (slug: string) => pricesStore.priceMap[slug] ?? null
</script>