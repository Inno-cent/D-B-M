<template>
  <div class="flex items-center gap-3">
    <div class="flex items-center gap-2">
      <button
        @click="decrementDraft"
        :disabled="draftQty <= minQty"
        class="w-8 h-8 rounded-lg border-2 border-earth-200
               flex items-center justify-center text-earth-600 font-bold
               disabled:opacity-30 disabled:cursor-not-allowed
               hover:border-forest-400 transition-colors duration-200"
      >−</button>
      <span class="text-sm font-semibold w-16 text-center">
        {{ draftQty }} {{ unit }}{{ draftQty > 1 ? 's' : '' }}
      </span>
      <button
        @click="draftQty += 1"
        class="w-8 h-8 rounded-lg border-2 border-earth-200
               flex items-center justify-center text-earth-600 font-bold
               hover:border-forest-400 transition-colors duration-200"
      >+</button>
    </div>

    <button
      @click="handleAdd"
      :disabled="disabled"
      class="btn-primary px-8 py-3 whitespace-nowrap disabled:opacity-40
             disabled:cursor-not-allowed flex-1 sm:flex-initial"
    >
      {{ justAdded ? 'Added ✓' : 'Add to Cart' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCartStore } from '../../stores/cart'

const props = defineProps<{
  slug:     string
  name:     string
  image:    string
  unit:     string
  minQty:   number
  priceNgn: number
  disabled?: boolean
}>()

const cart = useCartStore()
const draftQty  = ref(props.minQty)
const justAdded = ref(false)

// If min_qty changes (e.g. admin updates it while page is open), keep
// the draft from sitting below the new floor
watch(() => props.minQty, (newMin) => {
  if (draftQty.value < newMin) draftQty.value = newMin
})

const decrementDraft = () => {
  if (draftQty.value > props.minQty) draftQty.value -= 1
}

const handleAdd = () => {
  cart.addItem(
    {
      product_slug: props.slug,
      product_name: props.name,
      image:        props.image,
      unit:         props.unit,
      min_qty:      props.minQty,
      price_ngn:    props.priceNgn,
    },
    draftQty.value
  )
  justAdded.value = true
  setTimeout(() => { justAdded.value = false }, 1800)
}
</script>