<template>
  <section class="section-padding !py-14 md:!py-16 bg-white border-t-2 border-earth-200">
    <div class="container-max">
      <h2 class="text-2xl md:text-3xl font-bold text-earth-900 mb-6" data-reveal>
        Shop by Category
      </h2>

      <div
        class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-y-6 gap-x-3"
      >
        <RouterLink
          v-for="cat in categories"
          :key="cat.slug"
          :to="`/products?category=${cat.slug}`"
          class="flex flex-col items-center gap-2 group"
          data-reveal
        >
          <span
            class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-earth-200 group-hover:border-forest-400 transition-colors bg-parchment"
          >
            <img :src="cat.image" :alt="cat.label" class="w-full h-full object-cover" />
          </span>
          <span
            class="text-xs sm:text-sm text-earth-800 font-medium text-center leading-tight"
          >
            {{ cat.label }}
          </span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Sourced from data/categories.ts — the shared taxonomy. This section just
// links out to /products?category=<slug>; the actual category filtering
// (product.categories.includes(slug)) lives in ProductsView.vue.
import { categories } from "../../data/categories";
</script>
