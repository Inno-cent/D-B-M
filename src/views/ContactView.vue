<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="page-hero">
      <div class="max-w-7xl mx-auto">
        <span class="section-label">Get In Touch</span>
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-earth-900">Contact</h1>
        <p class="text-earth-600 text-lg max-w-xl">
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
            class="group border-2 border-earth-200 rounded-2xl p-6 flex items-start gap-5
                   bg-white hover:border-forest-400 hover:shadow-lg hover:-translate-y-1
                   transition-all duration-300"
          >
            <div class="w-12 h-12 border-2 border-earth-200 rounded-xl flex items-center
                        justify-center text-2xl flex-shrink-0 bg-parchment
                        group-hover:border-forest-400 transition-all">
              {{ info.icon }}
            </div>
            <div>
              <h3 class="font-bold text-xs uppercase tracking-wider text-earth-400 mb-1">
                {{ info.label }}
              </h3>
              <p class="font-semibold text-earth-900">{{ info.value }}</p>
              <p v-if="info.sub" class="text-sm text-earth-500 mt-0.5">{{ info.sub }}</p>
            </div>
          </div>

          <div class="border-2 border-earth-200 rounded-2xl p-6 bg-white">
            <h3 class="font-bold text-xs uppercase tracking-wider text-earth-400 mb-4">
              Quick Actions
            </h3>
            <div class="space-y-3">
              <RouterLink
                v-for="link in quickLinks"
                :key="link.path"
                :to="link.path"
                class="flex items-center justify-between px-4 py-3 border-2
                       border-earth-200 rounded-xl text-earth-800 font-semibold text-sm
                       hover:border-forest-400 hover:text-forest-700
                       transition-all duration-200 group"
              >
                <span>{{ link.label }}</span>
                <span class="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </RouterLink>
            </div>
          </div>
        </div>

        <div data-reveal data-reveal-delay="2">
          <Transition name="fade-slide" mode="out-in">
            <div v-if="!submitted" class="space-y-5">
              <h2 class="text-2xl font-bold mb-6 text-earth-900">Send a message</h2>
              <div class="grid sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold mb-2 text-earth-800">Your Name *</label>
                  <input v-model="form.name" type="text" placeholder="Full name" class="input-field" />
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2 text-earth-800">Email Address *</label>
                  <input v-model="form.email" type="email" placeholder="you@company.com" class="input-field" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2 text-earth-800">Company</label>
                <input v-model="form.company" type="text" placeholder="Your company name" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2 text-earth-800">Subject *</label>
                <input v-model="form.subject" type="text" placeholder="How can we help?" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2 text-earth-800">Message *</label>
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
              <div class="w-20 h-20 border-2 border-forest-500 rounded-3xl flex items-center
                          justify-center mx-auto mb-6 bg-forest-50">
                <svg class="w-10 h-10 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 class="text-3xl font-bold mb-3 text-earth-900">Message Sent</h2>
              <p class="text-earth-600 mb-8">We will get back to you within 24 hours.</p>
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
  { icon: '📧', label: 'Email',         value: 'hello@dualmarket.com',  sub: 'Best for detailed enquiries' },
  { icon: '💬', label: 'WhatsApp',      value: 'Available on request',  sub: 'For time-sensitive sourcing needs' },
  { icon: '📍', label: 'Location',      value: 'Lagos, Nigeria',        sub: 'Operating across all geopolitical zones' },
  { icon: '⏱️', label: 'Response Time', value: 'Within 24 hours',      sub: 'Monday to Friday, business days' },
]

const quickLinks = [
  { label: 'Request a Quote', path: '/request-quote' },
  { label: 'Browse Products', path: '/products' },
  { label: 'How It Works',    path: '/how-it-works' },
]
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from { opacity: 0; transform: translateY(12px); }
.fade-slide-leave-to   { opacity: 0; transform: translateY(-8px); }
</style>