<template>
  <RouterLink
    :to="`/products/${product.slug}`"
    class="group border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6
           bg-white dark:bg-gray-900 flex flex-col
           hover:border-black dark:hover:border-white hover:shadow-2xl
           hover:-translate-y-1 transition-all duration-300"
  >
    <div class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 w-fit">
      {{ product.icon }}
    </div>
    <span
      class="text-xs px-3 py-1 rounded-full font-semibold mb-3 w-fit"
      :class="product.type === 'export'
        ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
        : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'"
    >
      {{ product.type === 'export' ? 'Export' : 'Local Wholesale' }}
    </span>
    <h3 class="font-bold text-base mb-1 group-hover:underline underline-offset-4">
      {{ product.name }}
    </h3>
    <p class="text-xs text-gray-500 dark:text-gray-400 mb-5 flex-1 leading-relaxed">
      {{ product.detail }}
    </p>
    <span class="inline-flex items-center gap-1 text-xs font-semibold
                 group-hover:gap-2 transition-all duration-200">
      Request Quote <span>→</span>
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import type { Product } from '../../data/products'
defineProps<{ product: Product }>()
</script>