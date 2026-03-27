<template>
  <div class="border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-8
              bg-white dark:bg-gray-900">
    <h3 class="text-lg font-bold mb-1">Get a Quote</h3>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">We respond within 24 hours.</p>

    <Transition name="fade-slide" mode="out-in">
      <div v-if="!submitted" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
            Product
          </label>
          <select v-model="form.product" class="input-field">
            <option value="">Select a product...</option>
            <option v-for="p in productOptions" :key="p">{{ p }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
            Quantity
          </label>
          <input v-model="form.quantity" type="text" placeholder="e.g. 25 MT" class="input-field" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
            Email
          </label>
          <input v-model="form.email" type="email" placeholder="you@company.com" class="input-field" />
        </div>
        <button
          @click="submit"
          :disabled="!form.product || !form.email"
          class="btn-primary w-full justify-center py-3.5
                 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Request Quote →
        </button>
      </div>

      <div v-else class="text-center py-6">
        <div class="w-14 h-14 border-2 border-green-500 rounded-2xl flex items-center
                    justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 class="font-bold mb-2">Request received</h4>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          We will be in touch within 24 hours.
        </p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const submitted = ref(false)
const form = reactive({ product: '', quantity: '', email: '' })

const submit = () => {
  if (!form.product || !form.email) return
  submitted.value = true
}

const productOptions = [
  'Sesame Seeds', 'Hibiscus Flower', 'Ginger', 'Cashew Nuts',
  'Shea Butter', 'Rice', 'Palm Oil', 'Maize', 'Other'
]
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to   { opacity: 0; transform: translateY(-10px); }
</style>