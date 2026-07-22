<template>
  <section class="bg-white border-b-2 border-earth-200">
    <div class="container-max px-6 md:px-10 py-5">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
        <div
          v-for="badge in badges"
          :key="badge.title"
          class="flex items-center gap-3"
        >
          <span class="text-2xl">{{ badge.icon }}</span>
          <div class="leading-tight">
            <p class="text-sm font-semibold text-earth-900">{{ badge.title }}</p>
            <p class="text-xs text-earth-500">{{ badge.subtitle }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const badges = [
  { icon: '🛵', title: 'Same-day Delivery', subtitle: 'Across Lagos' },
  { icon: '🛡️', title: 'Fresh & Quality',   subtitle: 'Guaranteed' },
  { icon: '🔒', title: 'Secure Payments',   subtitle: '100% Safe' },
  { icon: '🔁', title: 'Easy Returns',      subtitle: 'Hassle Free' },
  { icon: '⭐', title: 'Top Rated',         subtitle: 'By Customers' },
]
</script>