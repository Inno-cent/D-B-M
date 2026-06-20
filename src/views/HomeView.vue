<template>
  <div class="bg-cream text-earth-900">
    <HeroSection />

    <!-- Marquee — local products lead, export follows, divider between -->
    <div class="border-y-2 border-earth-200 py-4 overflow-hidden bg-forest-800">
      <div class="flex animate-marquee whitespace-nowrap">
        <span v-for="i in 2" :key="i" class="flex">
          <span
            v-for="item in marqueeItems"
            :key="item.label"
            class="text-sm text-forest-200 font-medium mx-8 flex items-center gap-3"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="item.type === 'local' ? 'bg-harvest' : 'bg-forest-400'"
            />
            {{ item.label }}
          </span>
        </span>
      </div>
    </div>

    <FeaturedProducts />
    <HowItWorksPreview />
    <WhyWorkWithUs />

    <!-- Trust strip -->
    <section class="py-20 px-6 md:px-10 bg-parchment border-y-2 border-earth-200">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(stat, i) in trustStats"
            :key="stat.label"
            data-reveal
            :data-reveal-delay="String(i + 1)"
            class="text-center border-2 border-earth-200 rounded-2xl p-8 bg-white
                   hover:border-forest-300 hover:shadow-lg transition-all duration-300"
          >
            <div class="text-4xl mb-3">{{ stat.icon }}</div>
            <div class="text-4xl font-bold text-forest-700 mb-2">{{ stat.value }}</div>
            <div class="text-earth-600 text-sm font-medium">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA with farm image — two paths -->
    <section class="relative py-28 px-6 md:px-10 overflow-hidden">
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1592982537447-6f2a6a0a7b0c?w=1600&q=80&fit=crop"
          alt="African farmer in field"
          class="w-full h-full object-cover object-center"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-forest-900/95 to-forest-800/80" />
      </div>
      <div class="max-w-4xl mx-auto text-center relative z-10" data-reveal>
        <span class="inline-block px-4 py-1.5 bg-white/10 border border-white/20
                     text-green-300 rounded-full text-xs font-semibold
                     uppercase tracking-widest mb-6">
          Start Today
        </span>
        <h2 class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Buy local produce now, or source export commodities to order
        </h2>
        <p class="text-xl text-forest-200 mb-10 max-w-2xl mx-auto leading-relaxed">
          8 local products at today's live price, delivered to your door.
          For export commodities, we respond within 24 hours with pricing
          and availability.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink
            to="/products"
            class="inline-flex items-center justify-center gap-3 bg-white text-forest-800
                   px-10 py-4 rounded-xl font-bold hover:bg-cream hover:scale-105
                   transition-all shadow-2xl active:scale-95"
          >
            Buy Local Produce →
          </RouterLink>
          <RouterLink
            to="/request-quote"
            class="inline-flex items-center justify-center gap-3
                   border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold
                   hover:bg-white/10 hover:border-white/60 transition-all active:scale-95"
          >
            Request an Export Quote
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import HeroSection from '../components/home/HeroSection.vue'
import FeaturedProducts from '../components/home/FeaturedProducts.vue'
import HowItWorksPreview from '../components/home/HowItWorksPreview.vue'
import WhyWorkWithUs from '../components/home/WhyWorkWithUs.vue'
import { useReveal } from '../composables/useReveal'

const { observe } = useReveal()
onMounted(() => observe())

const marqueeItems = [
  { label: 'Rice',                  type: 'local'  },
  { label: 'Palm Oil',              type: 'local'  },
  { label: 'Maize',                 type: 'local'  },
  { label: 'Beans',                 type: 'local'  },
  { label: 'Onions',                type: 'local'  },
  { label: 'Cassava',               type: 'local'  },
  { label: 'Garri',                 type: 'local'  },
  { label: 'Wheat',                 type: 'local'  },
  { label: 'Ginger',                type: 'export' },
  { label: 'Cashew Nuts',           type: 'export' },
  { label: 'Shea Butter',           type: 'export' },
  { label: 'Groundnut',             type: 'export' },
  { label: 'Cocoa Beans',           type: 'export' },
  { label: 'Soyabeans',             type: 'export' },
  { label: 'Live Pricing',          type: 'local'  },
  { label: 'Verified Network',      type: 'export' },
]

// "24h" stat replaced — that claim only applies to the export quote flow;
// leading with local-produce metrics that apply site-wide instead
const trustStats = [
  { icon: '🌾', value: '8',   label: 'Local Products at Live Pricing' },
  { icon: '🤝', value: '50+', label: 'Verified Suppliers Across Nigeria' },
  { icon: '🌍', value: '18',  label: 'Countries Served for Export Sourcing' },
]
</script>