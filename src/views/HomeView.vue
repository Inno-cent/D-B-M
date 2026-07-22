<template>
  <div class="bg-cream text-earth-900">
    <HeroSection />
    <TrustBadgeStrip />
    <MealKitsSection />
    <PromoBanners />
    <ShopByCategorySection />
    <WhyShopWithUs />
    <BottomFeatureStrip />

    <!-- Export quote CTA — kept from the previous homepage. Not part of the
         reference image, but this is the export-commodities path (separate
         from the local-produce checkout), so it's preserved here rather than
         dropped. Happy to move/remove if you'd rather handle it elsewhere. -->
    <section class="relative py-20 px-6 md:px-10 overflow-hidden">
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1592982537447-6f2a6a0a7b0c?w=1600&q=80&fit=crop"
          alt="African farmer in field"
          class="w-full h-full object-cover object-center"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-forest-900/95 to-forest-800/80"
        />
      </div>
      <div class="max-w-3xl mx-auto text-center relative z-10" data-reveal>
        <span
          class="inline-block px-4 py-1.5 bg-white/10 border border-white/20 text-green-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
        >
          Sourcing for Export
        </span>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          Sourcing export commodities in bulk?
        </h2>
        <p class="text-lg text-forest-200 mb-8 max-w-xl mx-auto leading-relaxed">
          We respond within 24 hours with pricing and availability for cocoa, cashew, shea
          butter, and more.
        </p>
        <RouterLink to="/request-quote" class="btn-white">
          Request an Export Quote →
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import HeroSection from "../components/home/HeroSection.vue";
import TrustBadgeStrip from "../components/home/TrustBadgeStrip.vue";
import MealKitsSection from "../components/home/MealKitsSection.vue";
import PromoBanners from "../components/home/PromoBanners.vue";
import ShopByCategorySection from "../components/home/ShopByCategorySection.vue";
import WhyShopWithUs from "../components/home/WhyShopWithUs.vue";
import BottomFeatureStrip from "../components/home/BottomFeatureStrip .vue";
import { useReveal } from "../composables/useReveal";

const { observe } = useReveal();
onMounted(() => observe());
</script>
