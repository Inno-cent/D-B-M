<template>
  <div class="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen">
    <div class="page-hero">
      <div class="max-w-7xl mx-auto">
        <span class="section-label">Get In Touch</span>
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-4">Contact</h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg max-w-xl">
          We respond within 24 hours on business days.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <div class="grid lg:grid-cols-2 gap-16">

        <div data-reveal class="space-y-4">
          <div
            v-for="info in contactInfo"
            :key="info.label"
            class="group border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6
                   flex items-start gap-5 bg-white dark:bg-gray-900
                   hover:border-black dark:hover:border-white hover:shadow-xl
                   hover:-translate-y-1 transition-all duration-300"
          >
            <div class="w-12 h-12 border-2 border-gray-200 dark:border-gray-800 rounded-xl
                        flex items-center justify-center text-2xl flex-shrink-0
                        group-hover:border-black dark:group-hover:border-white transition-all">
              {{ info.icon }}
            </div>
            <div>
              <h3 class="font-bold text-sm uppercase tracking-wider
                         text-gray-500 dark:text-gray-400 mb-1">
                {{ info.label }}
              </h3>
              <p class="font-semibold">{{ info.value }}</p>
              <p v-if="info.sub" class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {{ info.sub }}
              </p>
            </div>
          </div>

          <div class="border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 class="font-bold text-sm uppercase tracking-wider
                       text-gray-500 dark:text-gray-400 mb-4">
              Quick Actions
            </h3>
            <div class="space-y-3">
              <RouterLink
                v-for="link in quickLinks"
                :key="link.path"
                :to="link.path"
                class="flex items-center justify-between px-4 py-3 border-2
                       border-gray-200 dark:border-gray-700 rounded-xl
                       hover:border-black dark:hover:border-white
                       transition-all duration-200 group"
              >
                <span class="text-sm font-semibold">{{ link.label }}</span>
                <span class="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </RouterLink>
            </div>
          </div>
        </div>

        <div data-reveal data-reveal-delay="2">
          <Transition name="fade-slide" mode="out-in">
            <div v-if="!submitted" class="space-y-5">
              <h2 class="text-2xl font-bold mb-6">Send a message</h2>
              <div class="grid sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold mb-2">Your Name *</label>
                  <input v-model="form.name" type="text" placeholder="Full name" class="input-field" />
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2">Email Address *</label>
                  <input v-model="form.email" type="email" placeholder="you@company.com" class="input-field" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Company</label>
                <input v-model="form.company" type="text" placeholder="Your company name" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Subject *</label>
                <input v-model="form.subject" type="text" placeholder="How can we help?" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Message *</label>
                <textarea v-model="form.message" rows="6"
                  placeholder="Tell us more about what you're looking for..."
                  class="input-field resize-none" />
              </div>
              <button
                @click="submit"
                :disabled="!form.name || !form.email || !form.message"
                class="btn-primary w-full justify-center py-4
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Send Message →
              </button>
            </div>

            <div v-else class="text-center py-16">
              <div class="w-20 h-20 border-2 border-green-500 rounded-3xl flex items-center
                          justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 class="text-3xl font-bold mb-3">Message Sent</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-8">
                We will get back to you within 24 hours.
              </p>
              <button @click="submitted = false" class="btn-outline">
                Send another message
              </button>
            </div>
          </Transition>
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
const form = reactive({ name: '', email: '', company: '', subject: '', message: '' })

const submit = () => {
  if (!form.name || !form.email || !form.message) return
  submitted.value = true
}

const contactInfo = [
  { icon: '📧', label: 'Email',         value: 'hello@dualmarket.com',    sub: 'Best for detailed enquiries' },
  { icon: '💬', label: 'WhatsApp',      value: 'Available on request',    sub: 'For time-sensitive sourcing needs' },
  { icon: '📍', label: 'Location',      value: 'Lagos, Nigeria',          sub: 'Operating across all geopolitical zones' },
  { icon: '⏱️', label: 'Response Time', value: 'Within 24 hours',        sub: 'Monday to Friday, business days' },
]

const quickLinks = [
  { label: 'Request a Quote',   path: '/request-quote' },
  { label: 'Browse Products',   path: '/products' },
  { label: 'How It Works',      path: '/how-it-works' },
]
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from { opacity: 0; transform: translateY(12px); }
.fade-slide-leave-to   { opacity: 0; transform: translateY(-8px); }
</style>