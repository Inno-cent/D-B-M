<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="page-hero" v-if="product">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center gap-2 text-sm text-earth-400 mb-6">
          <RouterLink to="/" class="hover:text-forest-600 transition-colors">Home</RouterLink>
          <span>›</span>
          <RouterLink to="/products" class="hover:text-forest-600 transition-colors">Products</RouterLink>
          <span>›</span>
          <span class="text-earth-700 font-medium">{{ product.name }}</span>
        </div>
        <span
          class="text-xs px-3 py-1 rounded-full font-semibold mb-4 inline-block"
          :class="product.type === 'export'
            ? 'bg-forest-50 text-forest-700 border border-forest-200'
            : 'bg-earth-100 text-earth-700 border border-earth-200'"
        >
          {{ product.type === 'export' ? 'Export Commodity' : 'Local Wholesale' }}
        </span>
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-earth-900">
          {{ product.name }}
        </h1>
        <p class="text-earth-600 text-lg max-w-xl">{{ product.tagline }}</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-10 py-16" v-if="product">
      <div class="grid lg:grid-cols-2 gap-16">

        <div data-reveal>
          <div class="border-2 border-earth-200 rounded-3xl h-72 flex items-center
                      justify-center text-8xl mb-6 bg-parchment
                      hover:border-forest-300 transition-all duration-300">
            {{ product.icon }}
          </div>
          <h3 class="font-bold text-sm uppercase tracking-widest text-earth-500 mb-4">
            Market Applications
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="app in product.applications"
              :key="app"
              class="border-2 border-earth-200 rounded-xl px-4 py-3
                     text-sm text-earth-700 font-medium bg-white
                     hover:border-forest-400 hover:text-forest-700 transition-all duration-200"
            >
              {{ app }}
            </div>
          </div>
        </div>

        <div data-reveal data-reveal-delay="2">
          <h2 class="text-3xl font-bold mb-4 text-earth-900">{{ product.name }}</h2>
          <p class="text-earth-600 leading-relaxed mb-8">{{ product.description }}</p>

          <div class="border-2 border-earth-200 rounded-2xl overflow-hidden mb-8">
            <div
              v-for="(spec, i) in product.specs"
              :key="spec.key"
              :class="[
                'flex justify-between items-center px-5 py-4 text-sm border-b-2 last:border-b-0 border-earth-100',
                i % 2 === 0 ? 'bg-white' : 'bg-parchment'
              ]"
            >
              <span class="text-earth-500">{{ spec.key }}</span>
              <span class="font-semibold text-earth-900">{{ spec.value }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <RouterLink to="/request-quote" class="btn-primary w-full justify-center py-4">
              Request a Quote for This Product →
            </RouterLink>
            <RouterLink
              to="/contact"
              class="btn-outline w-full justify-center py-4"
            >
              Ask a Question
            </RouterLink>
          </div>

          <div class="mt-10 pt-8 border-t-2 border-earth-100">
            <p class="text-sm font-semibold text-earth-500 mb-4">Other products</p>
            <div class="flex flex-wrap gap-2">
              <RouterLink
                v-for="p in relatedProducts"
                :key="p.slug"
                :to="`/products/${p.slug}`"
                class="px-4 py-2 border-2 border-earth-200 rounded-xl text-sm font-medium
                       text-earth-700 bg-white hover:border-forest-400 hover:text-forest-700
                       transition-all duration-200 flex items-center gap-2"
              >
                {{ p.icon }} {{ p.name }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!product" class="max-w-7xl mx-auto px-6 md:px-10 py-32 text-center">
      <p class="text-5xl mb-4">🔍</p>
      <h2 class="text-2xl font-bold mb-4">Product not found</h2>
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
const product = computed(() => products.find(p => p.slug === route.params.slug))
const relatedProducts = computed(() =>
  products.filter(p => p.slug !== route.params.slug).slice(0, 4)
)
</script>