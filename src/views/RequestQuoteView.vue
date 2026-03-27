<template>
  <div class="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen">
    <div class="page-hero">
      <div class="max-w-7xl mx-auto">
        <span class="section-label">Get Started</span>
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-4">Request a Quote</h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg max-w-xl">
          Fill in the form and we will respond within 24 hours with pricing and availability.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <div class="grid lg:grid-cols-5 gap-16">

        <div class="lg:col-span-3" data-reveal>
          <Transition name="fade-slide" mode="out-in">
            <div v-if="!submitted" class="space-y-5">
              <div class="grid sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold mb-2">Company Name *</label>
                  <input v-model="form.company" type="text" placeholder="Your company name" class="input-field" />
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2">Email Address *</label>
                  <input v-model="form.email" type="email" placeholder="you@company.com" class="input-field" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Phone / WhatsApp</label>
                <input v-model="form.phone" type="tel" placeholder="+1 234 567 8900" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Product Required *</label>
                <select v-model="form.product" class="input-field">
                  <option value="">Select a product...</option>
                  <optgroup label="Export Commodities">
                    <option v-for="p in exportProducts" :key="p">{{ p }}</option>
                  </optgroup>
                  <optgroup label="Local Wholesale">
                    <option v-for="p in localProducts" :key="p">{{ p }}</option>
                  </optgroup>
                  <option value="Other">Other (specify in notes)</option>
                </select>
              </div>
              <div class="grid sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold mb-2">Quantity Needed *</label>
                  <input v-model="form.quantity" type="text" placeholder="e.g. 25 MT" class="input-field" />
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2">Buyer Country *</label>
                  <input v-model="form.country" type="text" placeholder="e.g. Germany" class="input-field" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Delivery Destination</label>
                <input v-model="form.destination" type="text" placeholder="Port, city, or address" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Intended Shipment Date</label>
                <input v-model="form.shipDate" type="date" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Additional Notes</label>
                <textarea v-model="form.notes" rows="4"
                  placeholder="Grade preference, packaging type, certifications needed..."
                  class="input-field resize-none" />
              </div>
              <button
                @click="submit"
                :disabled="!form.company || !form.email || !form.product || !form.quantity"
                class="btn-primary w-full justify-center py-4
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Submit Quote Request →
              </button>
              <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
                We respond within 24 hours. No spam, ever.
              </p>
            </div>

            <div v-else class="text-center py-16">
              <div class="w-20 h-20 border-2 border-green-500 rounded-3xl flex items-center
                          justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 class="text-3xl font-bold mb-3">Request Received</h2>
              <p class="text-gray-600 dark:text-gray-400 text-lg mb-2">
                We will be in touch within 24 hours.
              </p>
              <p class="text-sm text-gray-500 mb-10">Check your inbox at <strong>{{ form.email }}</strong></p>
              <button
                @click="reset"
                class="btn-outline"
              >
                Submit another request
              </button>
            </div>
          </Transition>
        </div>

        <div class="lg:col-span-2" data-reveal data-reveal-delay="2">
          <div class="border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-8
                      bg-white dark:bg-gray-900 sticky top-24">
            <h3 class="font-bold text-lg mb-6">What happens next?</h3>
            <div class="space-y-6 mb-8">
              <div v-for="(step, i) in nextSteps" :key="step.title" class="flex gap-4">
                <div class="w-8 h-8 min-w-[32px] border-2 border-gray-200 dark:border-gray-700
                            rounded-xl flex items-center justify-center text-xs font-bold">
                  {{ i + 1 }}
                </div>
                <div>
                  <p class="text-sm font-semibold mb-0.5">{{ step.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{{ step.desc }}</p>
                </div>
              </div>
            </div>
            <div class="border-t-2 border-gray-100 dark:border-gray-800 pt-6 space-y-4">
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Prefer direct contact?
              </p>
              <div class="flex items-center gap-3 text-sm">
                <div class="w-9 h-9 border-2 border-gray-200 dark:border-gray-700 rounded-xl
                            flex items-center justify-center">📧</div>
                <span>hello@dualmarket.com</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <div class="w-9 h-9 border-2 border-gray-200 dark:border-gray-700 rounded-xl
                            flex items-center justify-center">💬</div>
                <span>WhatsApp available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useReveal } from '../composables/useReveal'

const { observe } = useReveal()
onMounted(() => observe())

const submitted = ref(false)

const emptyForm = {
  company: '', email: '', phone: '', product: '',
  quantity: '', country: '', destination: '', shipDate: '', notes: ''
}
const form = reactive({ ...emptyForm })

const submit = () => {
  if (!form.company || !form.email || !form.product || !form.quantity) return
  submitted.value = true
}

const reset = () => {
  submitted.value = false
  Object.assign(form, emptyForm)
}

const exportProducts = ['Sesame Seeds', 'Hibiscus Flower', 'Ginger', 'Cashew Nuts', 'Shea Butter']
const localProducts  = ['Rice', 'Palm Oil', 'Maize', 'Packaging Materials']

const nextSteps = [
  { title: 'We review your request', desc: 'Our team checks your requirements against current supplier availability.' },
  { title: 'We contact you within 24hrs', desc: 'You receive pricing, grade details, and a delivery timeline.' },
  { title: 'Terms agreed and locked', desc: 'A proforma invoice is issued once both parties confirm.' },
]
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from { opacity: 0; transform: translateY(12px); }
.fade-slide-leave-to   { opacity: 0; transform: translateY(-8px); }
</style>