<template>
  <span :class="[
    'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full',
    variantClasses
  ]">
    <span v-if="dot" class="w-1.5 h-1.5 rounded-full" :class="dotColor" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'export' | 'local' | 'trade' | 'gray'
  dot?: boolean
}>(), { variant: 'export', dot: false })

const variantClasses = computed(() => ({
  export: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  local:  'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  trade:  'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  gray:   'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
}[props.variant]))

const dotColor = computed(() => ({
  export: 'bg-green-500',
  local:  'bg-blue-500',
  trade:  'bg-yellow-500',
  gray:   'bg-gray-400',
}[props.variant]))
</script>