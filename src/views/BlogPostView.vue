<template>
  <div class="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen">
    <div class="page-hero">
      <div class="max-w-3xl mx-auto">
        <RouterLink
          to="/blog"
          class="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400
                 hover:text-black dark:hover:text-white transition-colors mb-6"
        >
          ← Back to Blog
        </RouterLink>
        <span class="section-label">Market Insights</span>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight leading-tight capitalize">
          {{ title }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-4">
          DualMarket Brokerage · Market Insights
        </p>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-6 md:px-10 py-16">
      <div class="border-2 border-gray-200 dark:border-gray-800 rounded-3xl p-8 mb-12
                  bg-gray-50 dark:bg-gray-900/50">
        <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">
          📝 Full article coming soon. Check back shortly.
        </p>
      </div>

      <div class="border-t-2 border-gray-200 dark:border-gray-800 pt-10
                  flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <RouterLink
          to="/blog"
          class="inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all"
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
const title = computed(() =>
  String(route.params.slug).replace(/-/g, ' ')
)
</script>