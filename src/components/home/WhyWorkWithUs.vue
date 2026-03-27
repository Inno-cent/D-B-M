<template>
  <section class="relative py-24 px-6 md:px-10 overflow-hidden">

    <!-- Farm background image -->
    <div class="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&q=80&fit=crop"
        alt="Nigerian farm workers harvesting"
        class="w-full h-full object-cover object-center"
      />
      <div class="absolute inset-0 bg-forest-900/88" />
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="text-center mb-16" data-reveal>
        <span class="inline-block px-4 py-1.5 bg-white/10 border border-white/20
                     text-forest-200 rounded-full text-xs font-semibold
                     uppercase tracking-widest mb-4">
          Why DualMarket
        </span>
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Built on trust and real supplier relationships
        </h2>
        <p class="text-forest-200 text-lg max-w-2xl mx-auto">
          Everything you need for trusted Nigerian commodity sourcing
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <div
          v-for="(f, i) in features"
          :key="f.title"
          data-reveal
          :data-reveal-delay="String(i + 1)"
          class="group bg-white/8 backdrop-blur-sm border border-white/15
                 rounded-2xl p-8 hover:bg-white/15 hover:border-white/30
                 hover:-translate-y-1 transition-all duration-300"
        >
          <div class="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl
                      flex items-center justify-center mb-6
                      group-hover:scale-110 transition-transform duration-300 text-2xl">
            {{ f.icon }}
          </div>
          <h4 class="font-bold text-lg text-white mb-3">{{ f.title }}</h4>
          <p class="text-forest-200 text-sm leading-relaxed">{{ f.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  { icon: '✓', title: 'Verified Suppliers',
    desc: 'Every supplier is vetted through a rigorous process before entering our network. No shortcuts.' },
  { icon: '★', title: 'Quality Control',
    desc: 'Pre-shipment inspections on every consignment. You receive exactly what was agreed.' },
  { icon: '📦', title: 'Full Logistics',
    desc: 'Freight forwarding, customs clearance, and export documentation handled end to end.' },
  { icon: '🌍', title: 'Export Expertise',
    desc: 'Deep knowledge of Nigerian commodity trade cycles, seasonal pricing, and grading standards.' },
  { icon: '⚡', title: '24h Response',
    desc: 'Submit a quote request and receive a detailed response within one business day.' },
  { icon: '🤝', title: 'Trusted Deals',
    desc: 'Every transaction is backed by formal agreements and transparent pricing. No hidden fees.' },
]
</script>