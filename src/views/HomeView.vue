<template>
  <div class="bg-cream text-earth-900">
    <HeroSection />

    <!-- Marquee -->
    <div class="border-y-2 border-earth-200 py-4 overflow-hidden bg-forest-800">
      <div class="flex animate-marquee whitespace-nowrap">
        <span v-for="i in 2" :key="i" class="flex">
          <span
            v-for="item in marqueeItems"
            :key="item"
            class="text-sm text-forest-200 font-medium mx-8 flex items-center gap-3"
          >
            <span class="w-1.5 h-1.5 bg-forest-400 rounded-full" />
            {{ item }}
          </span>
        </span>
      </div>
    </div>

    <FeaturedProducts />
    <HowItWorksPreview />
    <WhyWorkWithUs />

    <!-- Testimonial / trust strip -->
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

    <!-- CTA with farm image -->
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
          Ready to source from Nigeria?
        </h2>
        <p class="text-xl text-forest-200 mb-10 max-w-2xl mx-auto leading-relaxed">
          Tell us what you need. We respond within 24 hours with pricing and
          availability from verified Nigerian suppliers.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink
            to="/request-quote"
            class="inline-flex items-center justify-center gap-3 bg-white text-forest-800
                   px-10 py-4 rounded-xl font-bold hover:bg-cream hover:scale-105
                   transition-all shadow-2xl active:scale-95"
          >
            Request a Quote →
          </RouterLink>
          <RouterLink
            to="/products"
            class="inline-flex items-center justify-center gap-3
                   border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold
                   hover:bg-white/10 hover:border-white/60 transition-all active:scale-95"
          >
            Browse Products
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
  'Sesame Seeds', 'Hibiscus Flower', 'Ginger', 'Cashew Nuts',
  'Shea Butter', 'Palm Oil', 'Rice', 'Maize',
  'Verified Network', 'Export Documentation', 'Quality Control', 'Lagos Nigeria'
]

const trustStats = [
  { icon: '🌾', value: '50+', label: 'Verified Suppliers Across Nigeria' },
  { icon: '🌍', value: '18',  label: 'Countries We Have Served' },
  { icon: '⚡', value: '24h', label: 'Average Quote Response Time' },
]
</script>