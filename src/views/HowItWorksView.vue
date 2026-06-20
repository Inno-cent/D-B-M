<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="page-hero">
      <div class="max-w-7xl mx-auto">
        <span class="section-label">The Process</span>
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-earth-900">
          How It Works
        </h1>
        <p class="text-earth-600 text-lg max-w-xl">
          Buy local produce today at live pricing, or request a quote for export
          commodities sourced to order — two paths, both transparent end to end.
        </p>
      </div>
    </div>

    <!-- ── Local — buying produce ──────────────────────────────────── -->
    <div class="max-w-3xl mx-auto px-6 md:px-10 pt-16">
      <div class="flex items-center gap-2 mb-2" data-reveal>
        <span class="w-2 h-2 rounded-full bg-forest-600" />
        <h2 class="text-sm font-bold uppercase tracking-widest text-forest-700">
          Buying Local Produce
        </h2>
      </div>
      <p class="text-earth-500 text-sm mb-10" data-reveal data-reveal-delay="1">
        Rice, palm oil, maize, beans, onions, cassava, garri, and wheat — available now,
        no waiting on a quote.
      </p>

      <div
        v-for="(step, i) in localSteps"
        :key="step.title"
        data-reveal
        :data-reveal-delay="String((i % 4) + 1)"
        class="flex gap-8 mb-4 last:mb-0"
      >
        <div class="flex flex-col items-center">
          <div
            class="w-12 h-12 min-w-[48px] border-2 border-earth-300 bg-white rounded-2xl flex items-center justify-center font-bold text-base text-earth-800 hover:bg-forest-700 hover:text-white hover:border-forest-700 transition-all duration-300 cursor-default"
          >
            {{ i + 1 }}
          </div>
          <div v-if="i < localSteps.length - 1" class="w-0.5 flex-1 bg-earth-200 my-3" />
        </div>
        <div class="pb-12 last:pb-0 pt-1">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 bg-forest-50 border border-forest-200 text-forest-700 rounded-full text-xs font-semibold mb-3"
          >
            {{ step.tag }}
          </div>
          <h3 class="text-xl font-bold mb-3 text-earth-900">{{ step.title }}</h3>
          <p class="text-earth-600 leading-relaxed mb-4">{{ step.desc }}</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="detail in step.details"
              :key="detail"
              class="text-xs px-3 py-1.5 border-2 border-earth-200 rounded-lg text-earth-600 font-medium bg-white"
            >
              {{ detail }}
            </span>
          </div>
        </div>
      </div>

      <div class="text-center mb-4" data-reveal>
        <RouterLink to="/products" class="btn-primary px-8 py-3.5">
          Browse Local Produce →
        </RouterLink>
      </div>
    </div>

    <!-- ── Export — sourcing to order ──────────────────────────────── -->
    <div class="max-w-3xl mx-auto px-6 md:px-10 py-16 border-t-2 border-earth-200 mt-12">
      <div class="flex items-center gap-2 mb-2" data-reveal>
        <span class="w-2 h-2 rounded-full bg-earth-500" />
        <h2 class="text-sm font-bold uppercase tracking-widest text-earth-700">
          Sourcing Export Commodities
        </h2>
      </div>
      <p class="text-earth-500 text-sm mb-10" data-reveal data-reveal-delay="1">
        Ginger, cashew nuts, shea butter, groundnut, cocoa beans, and soyabeans — sourced
        to order through our verified supplier network.
      </p>

      <div
        v-for="(step, i) in exportSteps"
        :key="step.title"
        data-reveal
        :data-reveal-delay="String((i % 5) + 1)"
        class="flex gap-8 mb-4 last:mb-0"
      >
        <div class="flex flex-col items-center">
          <div
            class="w-12 h-12 min-w-[48px] border-2 border-earth-300 bg-white rounded-2xl flex items-center justify-center font-bold text-base text-earth-800 hover:bg-earth-700 hover:text-white hover:border-earth-700 transition-all duration-300 cursor-default"
          >
            {{ i + 1 }}
          </div>
          <div v-if="i < exportSteps.length - 1" class="w-0.5 flex-1 bg-earth-200 my-3" />
        </div>
        <div class="pb-12 last:pb-0 pt-1">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 bg-earth-50 border border-earth-200 text-earth-700 rounded-full text-xs font-semibold mb-3"
          >
            {{ step.tag }}
          </div>
          <h3 class="text-xl font-bold mb-3 text-earth-900">{{ step.title }}</h3>
          <p class="text-earth-600 leading-relaxed mb-4">{{ step.desc }}</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="detail in step.details"
              :key="detail"
              class="text-xs px-3 py-1.5 border-2 border-earth-200 rounded-lg text-earth-600 font-medium bg-white"
            >
              {{ detail }}
            </span>
          </div>
        </div>
      </div>

      <div class="text-center" data-reveal>
        <RouterLink to="/request-quote" class="btn-outline px-8 py-3.5">
          Request an Export Quote →
        </RouterLink>
      </div>
    </div>

    <!-- FAQ -->
    <div class="border-t-2 border-earth-200 bg-parchment">
      <div class="max-w-3xl mx-auto px-6 md:px-10 py-16">
        <h2 class="text-3xl font-bold mb-10 text-earth-900" data-reveal>
          Common questions
        </h2>
        <div class="space-y-4">
          <div
            v-for="(faq, i) in faqs"
            :key="faq.q"
            data-reveal
            :data-reveal-delay="String((i % 4) + 1)"
            class="border-2 border-earth-200 rounded-2xl overflow-hidden bg-white"
          >
            <button
              @click="openFaq = openFaq === i ? null : i"
              class="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-parchment transition-colors duration-200"
            >
              <span class="flex items-center gap-3">
                <span
                  class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex-shrink-0"
                  :class="
                    faq.tag === 'local'
                      ? 'bg-forest-50 text-forest-700 border border-forest-200'
                      : 'bg-earth-50 text-earth-600 border border-earth-200'
                  "
                >
                  {{ faq.tag === "local" ? "Local" : "Export" }}
                </span>
                <span class="font-semibold text-base text-earth-900">{{ faq.q }}</span>
              </span>
              <span
                :class="[
                  'text-xl text-earth-400 transition-transform duration-300 ml-4 flex-shrink-0',
                  openFaq === i ? 'rotate-45' : '',
                ]"
                >+</span
              >
            </button>
            <Transition name="accordion">
              <div
                v-if="openFaq === i"
                class="px-6 pb-5 text-earth-600 text-sm leading-relaxed border-t-2 border-earth-100 pt-4"
              >
                {{ faq.a }}
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Dual CTA -->
    <div class="border-t-2 border-earth-200 py-16 px-6 md:px-10 bg-white">
      <div class="max-w-7xl mx-auto text-center" data-reveal>
        <h2 class="text-3xl font-bold mb-4 text-earth-900">Ready to get started?</h2>
        <p class="text-earth-600 mb-8 max-w-md mx-auto">
          Buy local produce now at today's price, or request a quote and we'll begin
          sourcing within 24 hours.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/products" class="btn-primary px-10 py-4">
            Buy Local Produce →
          </RouterLink>
          <RouterLink to="/request-quote" class="btn-outline px-10 py-4">
            Request an Export Quote →
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useReveal } from "../composables/useReveal";

const { observe } = useReveal();
onMounted(() => observe());

const openFaq = ref<number | null>(null);

const localSteps = [
  {
    title: "Browse and add to cart",
    tag: "Live pricing",
    desc:
      "Pick from 8 local products — rice, palm oil, maize, beans, onions, cassava, garri, wheat. Prices reflect today\u2019s market and can change up to three times a day.",
    details: ["8 local products", "Live price feed", "No minimum-quote wait"],
  },
  {
    title: "Checkout and pay",
    tag: "Re-confirmed at checkout",
    desc:
      "Enter your delivery address — we resolve the delivery fee for your state automatically. Pay by card, bank transfer, or USSD. Your final price is re-confirmed live before you\u2019re charged.",
    details: ["Card / Transfer / USSD", "Zone-based delivery fee", "Live price re-check"],
  },
  {
    title: "We prepare your order",
    tag: "Soon after payment",
    desc: "Once payment is confirmed, your order is logged and prepared for dispatch.",
    details: ["Payment confirmation", "Order logged", "Dispatch prepared"],
  },
  {
    title: "Delivered to your address",
    tag: "Tracked",
    desc:
      "Your order is delivered to the address you provided. You can follow its status from your dashboard.",
    details: ["Delivery tracking", "Order history", "Dashboard access"],
  },
];

const exportSteps = [
  {
    title: "Submit your product request",
    tag: "Takes 2 minutes",
    desc:
      "Tell us what commodity you need, the quantity, delivery destination, and preferred shipment date.",
    details: ["Online form", "Direct email", "WhatsApp available"],
  },
  {
    title: "We identify qualified suppliers",
    tag: "Within 24–48 hours",
    desc:
      "We match your request against our verified supplier network to find the best fit.",
    details: ["50+ verified suppliers", "Grade matching", "Availability check"],
  },
  {
    title: "Price and terms confirmed",
    tag: "Full transparency",
    desc:
      "We present pricing, grade details, and available quantity. A proforma invoice is issued once agreed.",
    details: ["Proforma invoice", "Grade certificate", "Payment terms"],
  },
  {
    title: "Logistics arranged end to end",
    tag: "We handle everything",
    desc:
      "We coordinate freight forwarding, export documentation, customs clearance, and pre-shipment inspection.",
    details: [
      "SGS inspection",
      "Export docs",
      "Freight coordination",
      "Customs clearance",
    ],
  },
  {
    title: "Product delivered on schedule",
    tag: "Done",
    desc:
      "Your commodity arrives at the agreed destination on time. We follow up post-delivery.",
    details: ["On-time delivery", "Post-delivery follow-up", "Repeat order support"],
  },
];

const faqs = [
  {
    tag: "local",
    q: "Why do local produce prices change so often?",
    a:
      "Local commodity prices can move up to three times a day depending on market conditions. We update prices directly so what you see is always current, and every change is logged with a timestamp for full transparency.",
  },
  {
    tag: "local",
    q: "Will the price I see in my cart be the price I pay?",
    a:
      "Your cart shows the price at the time you added the item. At checkout, we re-confirm the live price before you\u2019re charged, so you\u2019re never billed a stale price — if it has changed, you\u2019ll see the updated amount before paying.",
  },
  {
    tag: "local",
    q: "How is my delivery fee calculated?",
    a:
      "Delivery fees are set by zone based on your state. Enter your delivery address at checkout and the applicable fee is calculated automatically before you pay.",
  },
  {
    tag: "export",
    q: "What is the minimum order quantity?",
    a:
      "Minimum order quantities vary by product. For sesame seeds it is typically 25 metric tonnes. For local wholesale goods like rice it can be as low as 100 bags.",
  },
  {
    tag: "export",
    q: "How long does the sourcing process take?",
    a:
      "We respond within 24–48 hours of receiving a quote. From confirmation to delivery, timelines typically range from 2–6 weeks.",
  },
  {
    tag: "export",
    q: "Do you handle export documentation?",
    a:
      "Yes. We coordinate all required export documentation including phytosanitary certificates, certificate of origin, fumigation certificates, and customs clearance.",
  },
  {
    tag: "export",
    q: "Can I request products not listed on your website?",
    a:
      "Absolutely. Our listed products represent our most commonly sourced items but our network covers a much broader range of Nigerian agricultural commodities.",
  },
  {
    tag: "export",
    q: "What payment terms do you offer?",
    a:
      "Payment terms are agreed per deal and typically involve an upfront deposit with the balance paid before shipment or against shipping documents.",
  },
];
</script>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: opacity 0.2s ease, max-height 0.3s ease;
  max-height: 300px;
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
