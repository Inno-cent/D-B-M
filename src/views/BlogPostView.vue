<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="page-hero">
      <div class="max-w-3xl mx-auto">
        <RouterLink
          to="/blog"
          class="inline-flex items-center gap-2 text-sm text-earth-500
                 hover:text-forest-600 transition-colors mb-6"
        >
          ← Back to Blog
        </RouterLink>
        <span class="section-label">Market Insights</span>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight leading-tight capitalize text-earth-900">
          {{ title }}
        </h1>
        <p class="text-earth-500 text-sm mt-4">DualMarket Brokerage · Market Insights</p>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-6 md:px-10 py-16">
      <div class="border-2 border-earth-200 rounded-3xl p-8 mb-12 bg-parchment">
        <p class="text-earth-600 text-sm font-medium">
          📝 Full article coming soon. Check back shortly.
        </p>
      </div>
      <div class="border-t-2 border-earth-200 pt-10
                  flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <RouterLink
          to="/blog"
          class="inline-flex items-center gap-2 text-sm font-semibold text-earth-700
                 hover:text-forest-700 hover:gap-3 transition-all"
        >
          ← All articles
        </RouterLink>
        <RouterLink to="/request-quote" class="btn-primary">
          Request a Quote →
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => String(route.params.slug).replace(/-/g, ' '))
</script>