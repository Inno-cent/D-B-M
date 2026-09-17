<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="max-w-7xl mx-auto px-6 md:px-10 py-16 text-center">
      <span class="text-5xl mb-4 block">🏷️</span>
      <h1 class="text-3xl font-bold text-earth-900 mb-3">Deals coming soon</h1>
      <p class="text-earth-600 max-w-md mx-auto mb-8">
        We're putting together this week's best offers. Check back shortly, or browse the
        full catalogue in the meantime.
      </p>
      <RouterLink to="/products" class="btn-primary">Shop Groceries →</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeo } from "../composables/useSeo";

// noindex: this is a "coming soon" placeholder with no real content yet.
// Remove noindex once actual deals are live here.
useSeo({
  title: "Deals",
  description: "This week's best offers on wholesale groceries — coming soon.",
  path: "/deals",
  noindex: true,
});
</script>
