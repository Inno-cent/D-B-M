<template>
  <Transition name="drawer-overlay">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-earth-900/50 z-40"
      @click="close"
    />
  </Transition>

  <Transition name="drawer-slide">
    <div
      v-if="modelValue"
      class="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-cream z-50
             shadow-2xl flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b-2 border-earth-200 bg-white">
        <h2 class="font-bold text-lg text-earth-900">
          Cart
          <span v-if="cart.itemCount > 0" class="text-sm text-earth-400 font-normal">
            ({{ cart.itemCount }} {{ cart.itemCount === 1 ? 'item' : 'items' }})
          </span>
        </h2>
        <button
          @click="close"
          class="w-8 h-8 rounded-lg flex items-center justify-center
                 text-earth-400 hover:bg-earth-100 hover:text-earth-700
                 transition-colors duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="cart.isEmpty" class="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <p class="text-5xl mb-4">🛒</p>
        <p class="font-bold text-earth-900 mb-2">Your cart is empty</p>
        <p class="text-sm text-earth-500 mb-6">Browse local produce and add what you need.</p>
        <RouterLink
          :to="'/products'"
          @click="close"
          class="btn-primary px-6 py-3 text-sm"
        >
          Browse Products →
        </RouterLink>
      </div>

      <!-- Items -->
      <div v-else class="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        <div
          v-for="item in cart.items"
          :key="item.product_slug"
          class="flex gap-3 p-4 bg-white border-2 border-earth-200 rounded-2xl"
        >
          <img
            :src="item.image"
            :alt="item.product_name"
            class="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-parchment"
          />
          <div class="flex-1 min-w-0">
            <p class="font-bold text-sm text-earth-900 truncate">{{ item.product_name }}</p>
            <p class="text-xs text-earth-400 mt-0.5">
              {{ cart.formatNgn(item.price_ngn) }} / {{ item.unit }}
            </p>
            <div class="flex items-center gap-2 mt-2">
              <button
                @click="cart.decrement(item.product_slug)"
                :disabled="item.quantity <= item.min_qty"
                class="w-6 h-6 rounded-lg border-2 border-earth-200
                       flex items-center justify-center text-earth-600 font-bold text-xs
                       disabled:opacity-30 disabled:cursor-not-allowed
                       hover:border-forest-400 transition-colors duration-200"
              >−</button>
              <span class="text-xs font-semibold w-12 text-center">
                {{ item.quantity }} {{ item.unit }}{{ item.quantity > 1 ? 's' : '' }}
              </span>
              <button
                @click="cart.increment(item.product_slug)"
                class="w-6 h-6 rounded-lg border-2 border-earth-200
                       flex items-center justify-center text-earth-600 font-bold text-xs
                       hover:border-forest-400 transition-colors duration-200"
              >+</button>
            </div>
          </div>
          <div class="text-right flex flex-col justify-between items-end">
            <p class="font-bold text-sm text-earth-900">
              {{ cart.formatNgn(item.price_ngn * item.quantity) }}
            </p>
            <button
              @click="cart.removeItem(item.product_slug)"
              class="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="!cart.isEmpty" class="border-t-2 border-earth-200 bg-white p-6">
        <div class="flex justify-between items-center mb-4">
          <span class="text-sm text-earth-600">Subtotal</span>
          <span class="font-bold text-earth-900">{{ cart.formatNgn(cart.subtotalNgn) }}</span>
        </div>
        <p class="text-xs text-earth-400 mb-4">Delivery fee calculated at checkout.</p>
        <RouterLink
          to="/checkout"
          @click="close"
          class="btn-primary w-full justify-center py-3.5"
        >
          Proceed to Checkout →
        </RouterLink>
        <RouterLink
          to="/cart"
          @click="close"
          class="block text-center text-sm font-semibold text-forest-600
                 hover:text-forest-700 mt-3 transition-colors"
        >
          View full cart
        </RouterLink>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useCartStore } from '../../stores/cart'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const cart = useCartStore()

const close = () => emit('update:modelValue', false)
</script>

<style scoped>
.drawer-overlay-enter-active, .drawer-overlay-leave-active { transition: opacity 0.25s ease; }
.drawer-overlay-enter-from, .drawer-overlay-leave-to { opacity: 0; }

.drawer-slide-enter-active, .drawer-slide-leave-active { transition: transform 0.3s ease; }
.drawer-slide-enter-from, .drawer-slide-leave-to { transform: translateX(100%); }
</style>