<template>
  <div>
    <div class="flex flex-wrap gap-3 mb-10">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="emit('filter', tab.value)"
        :class="[
          'px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200',
          activeFilter === tab.value
            ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400'
        ]"
      >
        {{ tab.label }}
        <span class="ml-1.5 opacity-50 text-xs">{{ tab.count }}</span>
      </button>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <div
        v-for="(product, i) in products"
        :key="product.slug"
        data-reveal
        :data-reveal-delay="String((i % 4) + 1)"
      >
        <ProductCard :product="product" />
      </div>
    </div>

    <div v-if="products.length === 0" class="text-center py-24">
      <p class="text-5xl mb-4">🔍</p>
      <p class="text-gray-500 dark:text-gray-400 text-lg">No products in this category.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from './ProductCard.vue'
import type { Product } from '../../data/products'

defineProps<{
  products: Product[]
  activeFilter: string
  tabs: { label: string; value: string; count: number }[]
}>()

const emit = defineEmits<{ filter: [value: string] }>()
</script>