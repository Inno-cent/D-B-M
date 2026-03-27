<template>
  <span :class="[
    'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border',
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
  export: 'bg-forest-50 text-forest-700 border-forest-200',
  local:  'bg-earth-100 text-earth-700 border-earth-200',
  trade:  'bg-amber-50 text-amber-700 border-amber-200',
  gray:   'bg-parchment text-earth-600 border-earth-200',
}[props.variant]))

const dotColor = computed(() => ({
  export: 'bg-forest-500',
  local:  'bg-earth-400',
  trade:  'bg-amber-500',
  gray:   'bg-earth-300',
}[props.variant]))
</script>