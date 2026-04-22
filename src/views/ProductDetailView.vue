<template>
  <div class="bg-cream text-earth-900 min-h-screen">

    <div v-if="product">
      <!-- Hero with image background -->
      <div class="relative pt-24 pb-16 overflow-hidden">
        <!-- Background image -->
        <div class="absolute inset-0">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-r
                      from-earth-900/90 via-earth-900/70 to-earth-900/30" />
        </div>

        <div class="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-sm text-white/60 mb-6">
            <RouterLink to="/" class="hover:text-white transition-colors">Home</RouterLink>
            <span>›</span>
            <RouterLink to="/products" class="hover:text-white transition-colors">Products</RouterLink>
            <span>›</span>
            <span class="text-white/90 font-medium">{{ product.name }}</span>
          </div>

          <!-- Badge -->
          <span
            :class="[
              'text-xs px-3 py-1.5 rounded-full font-semibold mb-5 inline-block border',
              product.type === 'export'
                ? 'bg-forest-600/80 text-white border-forest-400 backdrop-blur-sm'
                : 'bg-earth-800/70 text-white border-earth-600 backdrop-blur-sm'
            ]"
          >
            {{ product.type === 'export' ? '✈ Export Commodity' : '🏪 Local Wholesale' }}
          </span>

          <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white">
            {{ product.name }}
          </h1>
          <p class="text-white/80 text-lg max-w-xl leading-relaxed">
            {{ product.tagline }}
          </p>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div class="grid lg:grid-cols-5 gap-16">

          <!-- Left column — 2/5 -->
          <div class="lg:col-span-2" data-reveal>

            <!-- Image card -->
            <div class="rounded-3xl overflow-hidden border-2 border-earth-200
                        shadow-xl mb-6 h-64">
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Applications -->
            <h3 class="font-bold text-sm uppercase tracking-widest text-earth-500 mb-4">
              Market Applications
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <div
                v-for="app in product.applications"
                :key="app"
                class="border-2 border-earth-200 rounded-xl px-4 py-3 text-sm
                       text-earth-700 font-medium bg-white
                       hover:border-forest-400 hover:text-forest-700
                       transition-all duration-200"
              >
                {{ app }}
              </div>
            </div>

            <!-- Related products -->
            <div class="mt-8 pt-8 border-t-2 border-earth-100">
              <p class="text-sm font-semibold text-earth-500 mb-4">Other products</p>
              <div class="flex flex-wrap gap-2">
                <RouterLink
                  v-for="p in relatedProducts"
                  :key="p.slug"
                  :to="`/products/${p.slug}`"
                  class="flex items-center gap-2 px-3 py-2 border-2 border-earth-200
                         rounded-xl text-xs font-medium text-earth-700 bg-white
                         hover:border-forest-400 hover:text-forest-700
                         transition-all duration-200"
                >
                  <img
                    :src="p.image"
                    :alt="p.name"
                    class="w-6 h-6 rounded-lg object-cover flex-shrink-0"
                  />
                  {{ p.name }}
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Right column — 3/5 -->
          <div class="lg:col-span-3" data-reveal data-reveal-delay="2">

            <h2 class="text-3xl font-bold mb-4 text-earth-900">{{ product.name }}</h2>
            <p class="text-earth-600 leading-relaxed mb-8 text-base">
              {{ product.description }}
            </p>

            <!-- Specs -->
            <h3 class="font-bold text-sm uppercase tracking-widest text-earth-500 mb-4">
              Product Specifications
            </h3>
            <div class="border-2 border-earth-200 rounded-2xl overflow-hidden mb-8">
              <div
                v-for="(spec, i) in product.specs"
                :key="spec.key"
                :class="[
                  'flex justify-between items-center px-5 py-4 text-sm',
                  'border-b-2 last:border-b-0 border-earth-100',
                  i % 2 === 0 ? 'bg-white' : 'bg-parchment/60'
                ]"
              >
                <span class="text-earth-500 font-medium">{{ spec.key }}</span>
                <span class="font-semibold text-earth-900 text-right">{{ spec.value }}</span>
              </div>
            </div>

            <!-- CTAs -->
            <div class="flex flex-col gap-3 mb-8">
              <RouterLink
                to="/request-quote"
                class="btn-primary w-full justify-center py-4 text-base"
              >
                Request a Quote for This Product →
              </RouterLink>
              <RouterLink
                to="/contact"
                class="btn-outline w-full justify-center py-4"
              >
                Ask a Question
              </RouterLink>
            </div>

            <!-- Trust badges -->
            <div class="grid grid-cols-3 gap-4">
              <div
                v-for="badge in trustBadges"
                :key="badge.label"
                class="text-center p-4 bg-white border-2 border-earth-100
                       rounded-2xl hover:border-forest-200 transition-all"
              >
                <div class="text-2xl mb-2">{{ badge.icon }}</div>
                <p class="text-xs font-semibold text-earth-700">{{ badge.label }}</p>
                <p class="text-xs text-earth-400 mt-0.5">{{ badge.sub }}</p>
              </div>
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
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { products } from '../data/products'
import { useReveal } from '../composables/useReveal'

const { observe } = useReveal()
onMounted(() => observe())

const route = useRoute()

const product = computed(() =>
  products.find(p => p.slug === route.params.slug)
)

const relatedProducts = computed(() =>
  products
    .filter(p => p.slug !== route.params.slug)
    .filter(p => p.type === product.value?.type)
    .slice(0, 5)
)

const trustBadges = [
  { icon: '✓', label: 'Verified Source', sub: 'All suppliers audited' },
  { icon: '🔍', label: 'Quality Checked', sub: 'Pre-shipment inspection' },
  { icon: '📄', label: 'Fully Documented', sub: 'Export docs handled' },
]
</script>