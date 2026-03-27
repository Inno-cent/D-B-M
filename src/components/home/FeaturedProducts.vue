<template>
  <section class="py-24 px-6 md:px-10 bg-parchment border-b-2 border-earth-200">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-14" data-reveal>
        <span class="section-label">Our Catalogue</span>
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-earth-900 mb-4">
          What we source
        </h2>
        <p class="text-earth-600 text-lg max-w-2xl mx-auto">
          Export commodities for international buyers and wholesale goods for the Nigerian market.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
        <RouterLink
          v-for="(p, i) in products"
          :key="p.name"
          :to="`/products/${p.slug}`"
          data-reveal
          :data-reveal-delay="String((i % 6) + 1)"
          class="group border-2 border-earth-200 rounded-2xl p-4 text-center bg-white
                 hover:border-forest-400 hover:shadow-lg hover:shadow-forest-100
                 hover:scale-105 transition-all duration-300"
        >
          <div class="text-3xl mb-3 group-hover:scale-125 transition-transform duration-300">
            {{ p.icon }}
          </div>
          <p class="text-xs font-semibold text-earth-800 mb-1.5
                     group-hover:text-forest-700 transition-colors">
            {{ p.name }}
          </p>
          <span class="text-xs px-2 py-0.5 rounded-full font-medium"
            :class="p.type === 'export'
              ? 'bg-forest-50 text-forest-700'
              : 'bg-earth-100 text-earth-600'">
            {{ p.type === 'export' ? 'Export' : 'Local' }}
          </span>
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
const products = [
  { name: 'Sesame Seeds', slug: 'sesame-seeds', icon: '🌿', type: 'export' },
  { name: 'Hibiscus',     slug: 'hibiscus-flower', icon: '🌺', type: 'export' },
  { name: 'Ginger',       slug: 'ginger', icon: '🫚', type: 'export' },
  { name: 'Cashew Nuts',  slug: 'cashew-nuts', icon: '🥜', type: 'export' },
  { name: 'Shea Butter',  slug: 'shea-butter', icon: '✨', type: 'export' },
  { name: 'Rice',         slug: 'rice', icon: '🌾', type: 'local' },
  { name: 'Palm Oil',     slug: 'palm-oil', icon: '🫒', type: 'local' },
  { name: 'Maize',        slug: 'maize', icon: '🌽', type: 'local' },
]
</script>