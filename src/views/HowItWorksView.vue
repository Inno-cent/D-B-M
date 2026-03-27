<template>
  <div class="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen">
    <div class="page-hero">
      <div class="max-w-7xl mx-auto">
        <span class="section-label">The Process</span>
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-4">How It Works</h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg max-w-xl">
          A transparent end-to-end process from your first request to final delivery.
        </p>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-6 md:px-10 py-16">
      <div
        v-for="(step, i) in steps"
        :key="step.title"
        data-reveal
        :data-reveal-delay="String((i % 5) + 1)"
        class="flex gap-8 mb-4 last:mb-0"
      >
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 min-w-[48px] border-2 border-gray-200 dark:border-gray-700
                      bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center
                      font-bold text-base hover:bg-black hover:text-white hover:border-black
                      dark:hover:bg-white dark:hover:text-black dark:hover:border-white
                      transition-all duration-300 cursor-default">
            {{ i + 1 }}
          </div>
          <div v-if="i < steps.length - 1"
            class="w-0.5 flex-1 bg-gray-200 dark:bg-gray-800 my-3" />
        </div>
        <div class="pb-12 last:pb-0 pt-1">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800
                      text-gray-600 dark:text-gray-400 rounded-full text-xs font-semibold mb-3">
            {{ step.tag }}
          </div>
          <h3 class="text-xl font-bold mb-3">{{ step.title }}</h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{{ step.desc }}</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="detail in step.details"
              :key="detail"
              class="text-xs px-3 py-1.5 border-2 border-gray-200 dark:border-gray-800
                     rounded-lg text-gray-600 dark:text-gray-400 font-medium"
            >
              {{ detail }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <div class="border-t-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      <div class="max-w-3xl mx-auto px-6 md:px-10 py-16">
        <h2 class="text-3xl font-bold mb-10" data-reveal>Common questions</h2>
        <div class="space-y-4">
          <div
            v-for="(faq, i) in faqs"
            :key="faq.q"
            data-reveal
            :data-reveal-delay="String((i % 4) + 1)"
            class="border-2 border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden
                   bg-white dark:bg-gray-900"
          >
            <button
              @click="openFaq = openFaq === i ? null : i"
              class="w-full flex items-center justify-between px-6 py-5 text-left
                     hover:bg-gray-50 dark:hover:bg-black/20 transition-colors duration-200"
            >
              <span class="font-semibold text-base">{{ faq.q }}</span>
              <span :class="['text-xl transition-transform duration-300 ml-4 flex-shrink-0',
                openFaq === i ? 'rotate-45' : '']">+</span>
            </button>
            <Transition name="accordion">
              <div
                v-if="openFaq === i"
                class="px-6 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed
                       border-t-2 border-gray-100 dark:border-gray-800 pt-4"
              >
                {{ faq.a }}
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t-2 border-gray-200 dark:border-gray-800 py-16 px-6 md:px-10">
      <div class="max-w-7xl mx-auto text-center" data-reveal>
        <h2 class="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Submit a quote request and we will begin sourcing within 24 hours.
        </p>
        <RouterLink to="/request-quote" class="btn-primary px-10 py-4">
          Request a Quote →
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReveal } from '../composables/useReveal'

const { observe } = useReveal()
onMounted(() => observe())

const openFaq = ref<number | null>(null)

const steps = [
  { title: 'Submit your product request', tag: 'Takes 2 minutes',
    desc: 'Tell us what commodity you need, the quantity, your delivery destination, and preferred shipment date.',
    details: ['Online form', 'Direct email', 'WhatsApp available'] },
  { title: 'We identify qualified suppliers', tag: 'Within 24–48 hours',
    desc: 'We match your request against our verified supplier network to find the best fit for your specification.',
    details: ['50+ verified suppliers', 'Grade matching', 'Availability check'] },
  { title: 'Price and terms confirmed', tag: 'Full transparency',
    desc: 'We present pricing, grade details, and available quantity. A proforma invoice is issued once agreed.',
    details: ['Proforma invoice', 'Grade certificate', 'Payment terms'] },
  { title: 'Logistics arranged end to end', tag: 'We handle everything',
    desc: 'We coordinate freight forwarding, export documentation, customs clearance, and pre-shipment inspection.',
    details: ['SGS inspection', 'Export docs', 'Freight coordination', 'Customs clearance'] },
  { title: 'Product delivered on schedule', tag: 'Done',
    desc: 'Your commodity arrives at the agreed destination on time. We follow up post-delivery.',
    details: ['On-time delivery', 'Post-delivery follow-up', 'Repeat order support'] },
]

const faqs = [
  { q: 'What is the minimum order quantity?',
    a: 'Minimum order quantities vary by product. For sesame seeds it is typically 25 metric tonnes. For local wholesale goods like rice it can be as low as 100 bags.' },
  { q: 'How long does the sourcing process take?',
    a: 'We respond within 24–48 hours of receiving a quote request. From confirmation to delivery, timelines typically range from 2–6 weeks depending on product and destination.' },
  { q: 'Do you handle export documentation?',
    a: 'Yes. We coordinate all required export documentation including phytosanitary certificates, certificate of origin, fumigation certificates, and customs clearance.' },
  { q: 'Can I request products not listed on your website?',
    a: 'Absolutely. Our listed products represent our most commonly sourced items but our supplier network covers a much broader range of Nigerian agricultural commodities.' },
  { q: 'What payment terms do you offer?',
    a: 'Payment terms are agreed on a per-deal basis and typically involve an upfront deposit with the balance paid before shipment or against shipping documents.' },
]
</script>

<style scoped>
.accordion-enter-active, .accordion-leave-active {
  transition: opacity 0.2s ease, max-height 0.3s ease;
  max-height: 300px;
  overflow: hidden;
}
.accordion-enter-from, .accordion-leave-to { opacity: 0; max-height: 0; }
</style>