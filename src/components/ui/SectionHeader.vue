<template>
  <div :class="['mb-14', centered ? 'text-center' : '']">
    <span v-if="label" class="section-label">{{ label }}</span>
    <h2 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">{{ title }}</h2>
    <p
      v-if="subtitle"
      class="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-2xl"
      :class="centered ? 'mx-auto' : ''"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  title: string
  subtitle?: string
  centered?: boolean
}>()
</script>