<template>
  <section class="py-24 px-6 md:px-10 bg-parchment border-b-2 border-earth-200">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-14" data-reveal>
        <span class="section-label">Our Catalogue</span>
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-earth-900 mb-4">
          What we source
        </h2>
        <p class="text-earth-600 text-lg max-w-2xl mx-auto">
          Export commodities and local wholesale goods from verified Nigerian suppliers.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
        <RouterLink
          v-for="(p, i) in featuredProducts"
          :key="p.slug"
          :to="`/products/${p.slug}`"
          data-reveal
          :data-reveal-delay="String((i % 6) + 1)"
          class="group border-2 border-earth-200 rounded-2xl overflow-hidden bg-white
                 hover:border-forest-400 hover:shadow-lg hover:scale-105
                 transition-all duration-300"
        >
          <!-- Image -->
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
          <!-- Name -->
          <div class="p-2.5 text-center">
            <p class="text-xs font-semibold text-earth-800 leading-tight
                       group-hover:text-forest-700 transition-colors">
              {{ p.name }}
            </p>
            <span class="text-xs mt-1 inline-block"
              :class="p.type === 'export'
                ? 'text-forest-600'
                : 'text-earth-500'">
              {{ p.type === 'export' ? 'Export' : 'Local' }}
            </span>
          </div>
        </RouterLink>
      </div>

      <div class="text-center" data-reveal>
        <RouterLink to="/products" class="btn-outline">
          View all products →
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { products } from '../../data/products'

// Show first 8 for the homepage grid
const featuredProducts = products.slice(0, 8)
</script>