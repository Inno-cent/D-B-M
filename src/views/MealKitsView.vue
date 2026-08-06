<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="max-w-7xl mx-auto px-6 md:px-10 py-8">
      <div class="flex items-center gap-2 text-xs text-earth-400 mb-6">
        <RouterLink to="/" class="hover:text-forest-700 transition-colors"
          >Home</RouterLink
        >
        <span>›</span>
        <span class="text-earth-700 font-medium">Meal Kits</span>
      </div>

      <h1 class="text-3xl font-bold text-earth-900 mb-2">Shop Meal Kits</h1>
      <p class="text-earth-600 mb-8 max-w-xl">
        Complete ingredient kits for your favourite Nigerian meals. Choose your family
        size and cook with ease.
      </p>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <div
          v-for="(kit, i) in mealKits"
          :key="kit.slug"
          data-reveal
          :data-reveal-delay="String((i % 4) + 1)"
        >
          <MealKitCard :kit="kit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import MealKitCard from "../components/meal-kits/MealKitCard.vue";
import { mealKits } from "../data/mealKits";
import { useReveal } from "../composables/useReveal";

const { observe } = useReveal();
onMounted(() => observe());
</script>
