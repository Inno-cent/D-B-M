<template>
  <RouterLink
    :to="`/meal-kits/${kit.slug}`"
    class="group flex flex-col bg-white rounded-2xl overflow-hidden border-2 border-earth-100 hover:border-forest-300 hover:shadow-lg transition-all duration-300"
  >
    <div class="relative h-40 overflow-hidden bg-parchment">
      <img
        :src="kit.image"
        :alt="kit.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <span
        v-if="kit.badge"
        class="absolute top-3 left-3 bg-harvest text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded"
      >
        {{ kit.badge }}
      </span>
    </div>
    <div class="p-4">
      <h3
        class="font-bold text-sm text-earth-900 mb-1 group-hover:text-forest-700 transition-colors"
      >
        {{ kit.name }}
      </h3>
      <p class="text-xs text-earth-500 mb-2">
        Serves {{ kit.sizes.map((s) => s.servings).join(" · ") }}
      </p>
      <p class="text-sm font-bold text-forest-700">
        From ₦{{ Math.min(...kit.sizes.map((s) => s.priceNgn)).toLocaleString() }}
      </p>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { MealKit } from "../../data/mealKits";

defineProps<{ kit: MealKit }>();
</script>
