<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="page-hero">
      <div class="max-w-7xl mx-auto">
        <span class="section-label">Who We Are</span>
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-earth-900">
          About Orenag
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
              Orenag operates two distinct ways of doing business, both built on the same
              standard of quality and trust.
            </p>
            <p>
              <strong class="text-earth-900">Local produce</strong> — staples and grains,
              fresh produce, oils, spices, and pantry essentials — is available to buy
              directly, at a live price that's updated throughout the day. Add to cart,
              check out, and we deliver.
            </p>
            <p>
              <strong class="text-earth-900">Export commodities</strong> — like ginger,
              cocoa beans, groundnut, soyabeans, and shea butter — are sourced to order.
              We act as a trusted intermediary, connecting international buyers with
              verified Nigerian suppliers, and handle sourcing, quality assurance,
              logistics, and full export documentation.
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
            v-for="stat in stats"
            :key="stat.label"
            class="border-2 border-earth-200 rounded-2xl p-7 text-center bg-white hover:border-forest-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div class="text-4xl font-bold text-forest-700 mb-2">{{ stat.value }}</div>
            <div class="text-sm text-earth-500">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useReveal } from "../composables/useReveal";
import { products } from "../data/products";

const { observe } = useReveal();
onMounted(() => observe());

// Local/export/total counts are now computed from the real catalogue
// instead of hardcoded, so this page can't silently go stale the way the
// old "8 Local Products" figure had (actual count was 18). Supplier count
// and countries served are marketing claims with no backing data source —
// left as-is; update manually if those numbers change.
const stats = [
  {
    value: String(products.filter((p) => p.type === "local").length),
    label: "Local Products, Live Priced",
  },
  { value: "50+", label: "Verified Suppliers" },
  { value: "18", label: "Countries Served (Export)" },
  { value: String(products.length), label: "Commodities Total" },
];
</script>
