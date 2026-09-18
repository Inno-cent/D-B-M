<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="max-w-7xl mx-auto px-6 md:px-10 py-16 text-center">
      <span class="text-5xl mb-4 block">📖</span>
      <h1 class="text-3xl font-bold text-earth-900 mb-3">Recipes coming soon</h1>
      <p class="text-earth-600 max-w-md mx-auto mb-8">
        We're building out a library of recipes to go with our meal kits. In the meantime,
        browse what's available to cook today.
      </p>
      <RouterLink to="/meal-kits" class="btn-primary">Shop Meal Kits →</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeo } from "../composables/useSeo";

// noindex: this is a "coming soon" placeholder with no real content yet.
// Remove noindex once actual recipes are live here.
useSeo({
  title: "Recipes",
  description: "A library of recipes to go with our meal kits — coming soon.",
  path: "/recipes",
  noindex: true,
});
</script>
