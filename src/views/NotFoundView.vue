<template>
  <div class="bg-cream text-earth-900 min-h-screen flex items-center justify-center px-6">
    <div class="text-center max-w-lg">
      <p class="text-8xl mb-6">🌾</p>
      <h1 class="text-5xl font-bold tracking-tight mb-4 text-earth-900">404</h1>
      <p class="text-xl font-semibold mb-3 text-earth-800">Page not found</p>
      <p class="text-earth-500 mb-10 leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <RouterLink to="/" class="btn-primary px-8 py-4">Go Home →</RouterLink>
        <RouterLink to="/products" class="btn-outline px-8 py-4">Browse Products</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useSeo } from "../composables/useSeo";

const route = useRoute();

// Note: this only sets a noindex *meta tag* — it can't make the server
// actually respond with a real HTTP 404 status code, since this is a
// client-rendered SPA route match, not a server error. If SEO-grade
// crawlers dinging you for "soft 404s" becomes a problem, that needs a
// server/edge rule (e.g. a Vercel rewrite that 404s specific known-bad
// paths), not something fixable from inside this component.
useSeo({
  title: "Page Not Found",
  path: route.fullPath,
  noindex: true,
});
</script>