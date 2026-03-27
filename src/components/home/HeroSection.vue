<template>
  <section class="relative min-h-screen flex items-center overflow-hidden">

    <!-- Background image -->
    <div class="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800&q=85&fit=crop"
        alt="Farm fields at golden hour"
        class="w-full h-full object-cover object-center"
      />
      <!-- Gradient overlay — heavy left for text, fades right -->
      <div class="absolute inset-0 bg-gradient-to-r
                  from-forest-900/92 via-forest-900/70 to-forest-900/30" />
      <!-- Bottom fade -->
      <div class="absolute bottom-0 left-0 right-0 h-32
                  bg-gradient-to-t from-cream to-transparent" />
    </div>

    <!-- Floating nature texture -->
    <div class="absolute inset-0 pointer-events-none opacity-10"
      style="background-image: url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=40');
             background-size: 300px; background-repeat: repeat; mix-blend-mode: overlay;" />

    <div class="max-w-7xl mx-auto px-6 md:px-10 relative z-10 pt-32 pb-20 w-full">
      <div class="grid lg:grid-cols-2 gap-16 items-center">

        <!-- Left -->
        <div class="space-y-8">
          <div class="inline-flex items-center gap-2 px-4 py-2
                      bg-white/10 backdrop-blur-sm border border-white/20
                      rounded-full text-white text-sm font-medium">
            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Nigerian Commodity Brokerage
          </div>

          <h1 class="text-5xl md:text-7xl font-bold tracking-tight leading-[1.08] text-white">
            From Nigeria's
            <span class="block bg-gradient-to-r from-green-300 to-yellow-300
                         bg-clip-text text-transparent">
              farms to your
            </span>
            market.
          </h1>

          <p class="text-lg md:text-xl text-forest-100/90 max-w-lg leading-relaxed">
            We connect international buyers and Nigerian businesses with verified,
            quality-assured suppliers — handling sourcing, logistics, and documentation end to end.
          </p>

          <div class="flex flex-col sm:flex-row gap-4">
            <RouterLink
              to="/products"
              class="group inline-flex items-center justify-center gap-3
                     bg-white text-forest-800 px-8 py-4 rounded-xl font-bold
                     hover:bg-cream hover:scale-105 transition-all
                     shadow-xl shadow-forest-900/30 active:scale-95"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Products
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </RouterLink>

            <RouterLink
              to="/request-quote"
              class="inline-flex items-center justify-center gap-3
                     border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold
                     hover:bg-white/10 hover:border-white/60
                     transition-all active:scale-95 backdrop-blur-sm"
            >
              Request a Quote
            </RouterLink>
          </div>

          <div class="flex flex-wrap items-center gap-6 pt-2">
            <div v-for="t in trust" :key="t" class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd" />
              </svg>
              <span class="text-sm text-forest-100">{{ t }}</span>
            </div>
          </div>
        </div>

        <!-- Right — stat cards -->
        <div class="hidden lg:flex flex-col gap-4">

          <!-- Main card -->
          <div class="bg-white/10 backdrop-blur-md border border-white/20
                      rounded-3xl p-8 animate-float">
            <p class="text-forest-200 text-xs font-semibold uppercase tracking-widest mb-5">
              Live sourcing activity
            </p>
            <div class="space-y-4">
              <div v-for="item in liveItems" :key="item.product"
                class="flex items-center justify-between py-3
                       border-b border-white/10 last:border-0">
                <div class="flex items-center gap-3">
                  <span class="text-xl">{{ item.icon }}</span>
                  <div>
                    <p class="text-white font-semibold text-sm">{{ item.product }}</p>
                    <p class="text-forest-300 text-xs">{{ item.origin }}</p>
                  </div>
                </div>
                <span :class="[
                  'text-xs font-semibold px-2.5 py-1 rounded-full',
                  item.status === 'Available'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-yellow-500/20 text-yellow-300'
                ]">
                  {{ item.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Stats row -->
          <div class="grid grid-cols-3 gap-4">
            <div v-for="s in heroStats" :key="s.label"
              class="bg-white/10 backdrop-blur-md border border-white/20
                     rounded-2xl p-5 text-center hover:bg-white/15
                     transition-all duration-300">
              <div class="text-2xl font-bold text-white mb-1">{{ s.value }}</div>
              <div class="text-xs text-forest-300">{{ s.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const trust = ['Verified Suppliers', 'Quality Assured', '24h Response']

const liveItems = [
  { icon: '🌿', product: 'Sesame Seeds',   origin: 'Jigawa, Nigeria',  status: 'Available' },
  { icon: '🌺', product: 'Hibiscus Flower',origin: 'Kano, Nigeria',    status: 'Available' },
  { icon: '🫚', product: 'Dried Ginger',   origin: 'Kaduna, Nigeria',  status: 'Seasonal' },
  { icon: '🥜', product: 'Cashew Nuts',    origin: 'Oyo, Nigeria',     status: 'Available' },
]

const heroStats = [
  { value: '50+', label: 'Suppliers' },
  { value: '18',  label: 'Countries' },
  { value: '24h', label: 'Response' },
]
</script>