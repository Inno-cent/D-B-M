<template>
  <RouterLink
    :to="`/products/${product.slug}`"
    class="group flex flex-col bg-white rounded-2xl overflow-hidden
           border border-earth-100 shadow-sm
           hover:shadow-xl hover:shadow-earth-200/60
           hover:-translate-y-1 transition-all duration-300"
  >
    <!-- Image -->
    <div class="relative h-44 overflow-hidden bg-parchment">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105
               transition-transform duration-500"
        loading="lazy"
        @error="handleImgError"
      />
      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      <!-- Badge -->
      <span
        :class="[
          'absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-semibold border',
          product.type === 'export'
            ? 'bg-forest-600/90 text-white border-forest-500 backdrop-blur-sm'
            : 'bg-earth-800/80 text-white border-earth-700 backdrop-blur-sm'
        ]"
      >
        {{ product.type === 'export' ? '✈ Export' : '🏪 Local' }}
      </span>
    </div>

    <!-- Content -->
    <div class="flex flex-col flex-1 p-5">
      <h3 class="font-bold text-base text-earth-900 mb-1
                 group-hover:text-forest-700 transition-colors duration-200">
        {{ product.name }}
      </h3>
      <p class="text-xs text-earth-500 leading-relaxed mb-4 flex-1">
        {{ product.detail }}
      </p>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-3
                  border-t border-earth-100">
        <span class="text-xs text-earth-400 font-medium">
          {{ product.specs[0]?.value }}
        </span>
        <span class="inline-flex items-center gap-1 text-xs font-semibold
                     text-forest-600 group-hover:gap-2 transition-all duration-200">
          View details <span>→</span>
        </span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { Product } from '../../data/products'

defineProps<{ product: Product }>()

const handleImgError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80&fit=crop'
}
</script>