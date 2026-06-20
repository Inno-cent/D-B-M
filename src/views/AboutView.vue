<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="page-hero">
      <div class="max-w-7xl mx-auto">
        <span class="section-label">Who We Are</span>
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-earth-900">
          About Prena Global
        </h1>
        <p class="text-earth-600 text-lg max-w-xl">
          Nigerian local produce at today's price, and export commodities sourced to order
          through verified supplier relationships.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <div class="grid lg:grid-cols-2 gap-16 items-start">
        <div data-reveal class="space-y-6">
          <h2 class="text-3xl font-bold text-earth-900">What we do</h2>
          <div class="space-y-4 text-earth-600 leading-relaxed">
            <p>
              Prena Global operates two distinct ways of doing business, both built on the
              same standard of quality and trust.
            </p>
            <p>
              <strong class="text-earth-900">Local produce</strong> — rice, palm oil,
              maize, beans, onions, cassava, garri, and wheat — is available to buy
              directly, at a live price that's updated throughout the day. Add to cart,
              check out, and we deliver.
            </p>
            <p>
              <strong class="text-earth-900">Export commodities</strong> — like ginger,
              cashew nuts, shea butter, and cocoa beans — are sourced to order. We act as
              a trusted intermediary, connecting international buyers with verified
              Nigerian suppliers, and handle sourcing, quality assurance, logistics, and
              full export documentation.
            </p>
            <p>
              Our supplier network spans farmer cooperatives, processors, commodity
              aggregators, and manufacturers across Nigeria's key agricultural regions.
            </p>
          </div>
          <div class="flex flex-wrap gap-3 mt-4">
            <RouterLink to="/products" class="btn-primary inline-flex">
              Buy Local Produce →
            </RouterLink>
            <RouterLink to="/request-quote" class="btn-outline inline-flex">
              Request an Export Quote →
            </RouterLink>
          </div>
        </div>

        <div data-reveal data-reveal-delay="2" class="grid grid-cols-2 gap-4">
          <div
            v-for="(stat, i) in stats"
            :key="stat.label"
            class="border-2 border-earth-200 rounded-2xl p-7 text-center bg-white hover:border-forest-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div class="text-4xl font-bold text-forest-700 mb-2">{{ stat.value }}</div>
            <div class="text-sm text-earth-500">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Farm image divider section -->
    <!-- <div class="relative py-24 px-6 md:px-10 overflow-hidden">
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80&fit=crop"
          alt="Nigerian agricultural fields"
          class="w-full h-full object-cover object-center"
        />
        <div class="absolute inset-0 bg-forest-900/85" />
      </div>
      <div class="max-w-7xl mx-auto relative z-10">
        <h2 class="text-3xl font-bold text-white mb-10 text-center" data-reveal>
          Our values
        </h2>
        <div class="grid md:grid-cols-3 gap-5">
          <div
            v-for="(value, i) in values"
            :key="value.title"
            data-reveal
            :data-reveal-delay="String(i + 1)"
            class="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"
          >
            <div
              class="text-3xl mb-5 group-hover:scale-110 transition-transform duration-300 w-fit"
            >
              {{ value.icon }}
            </div>
            <h3 class="text-xl font-bold text-white mb-3">{{ value.title }}</h3>
            <p class="text-forest-200 text-sm leading-relaxed">{{ value.desc }}</p>
          </div>
        </div>
      </div>
    </div> -->

    <!-- Two models explained -->
   
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useReveal } from "../composables/useReveal";

const { observe } = useReveal();
onMounted(() => observe());

// "24h Response Time" dropped — that claim only applies to export quotes;
// led instead with local-produce metrics that apply to every visitor
const stats = [
  { value: "8", label: "Local Products, Live Priced" },
  { value: "50+", label: "Verified Suppliers" },
  { value: "18", label: "Countries Served (Export)" },
  { value: "12+", label: "Commodities Total" },
];

const values = [
  {
    icon: "🔍",
    title: "Transparency",
    desc:
      "Local prices are live and timestamped. Export deals are fully documented and clearly priced. No hidden fees, either way.",
  },
  {
    icon: "⭐",
    title: "Quality First",
    desc:
      "We never compromise on grades. Every shipment is inspected and verified before it leaves Nigeria.",
  },
  {
    icon: "🤝",
    title: "End-to-End",
    desc:
      "From checkout to delivery, or from your first quote request to final shipment, we own the process and keep you informed.",
  },
];

const localPoints = [
  {
    title: "Live, audited pricing",
    desc:
      "Prices update throughout the day and every change is logged with a timestamp — full transparency, no disputes.",
  },
  {
    title: "No waiting on a quote",
    desc:
      "Local produce is ready to buy now. Add to cart and check out — no 24-48 hour turnaround.",
  },
  {
    title: "Price re-confirmed at checkout",
    desc:
      "What you see in your cart is checked against the live price before you\u2019re charged, so you\u2019re never billed a stale figure.",
  },
  {
    title: "Delivery handled for you",
    desc:
      "Your delivery fee is calculated automatically based on your state, and your order is tracked from confirmation to arrival.",
  },
];

const brokerPoints = [
  {
    title: "No cold-start risk",
    desc:
      "You skip the months of supplier prospecting, vetting, and trial-and-error that direct sourcing requires.",
  },
  {
    title: "Quality assurance built in",
    desc: "We inspect before you pay. No surprises when your shipment arrives.",
  },
  {
    title: "Documentation handled",
    desc:
      "Export certificates, phytosanitary docs, customs clearance — we know what is needed and we do it.",
  },
  {
    title: "Local intelligence",
    desc:
      "We know when prices are high, when supply is tight, and which suppliers to avoid.",
  },
  {
    title: "Single point of contact",
    desc:
      "Instead of managing multiple suppliers and agents — you have one contact who handles everything.",
  },
];
</script>
