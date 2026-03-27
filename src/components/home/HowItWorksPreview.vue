<template>
  <section class="py-24 px-6 md:px-10 bg-white border-b-2 border-earth-200">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16" data-reveal>
        <span class="section-label">The Process</span>
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-earth-900 mb-4">
          How it works
        </h2>
        <p class="text-earth-600 text-lg max-w-2xl mx-auto">
          A transparent five-step process from request to delivery
        </p>
      </div>

      <div class="grid md:grid-cols-5 gap-6">
        <div
          v-for="(step, i) in steps"
          :key="step.title"
          data-reveal
          :data-reveal-delay="String(i + 1)"
          class="group relative border-2 border-earth-200 p-6 rounded-2xl bg-white
                 hover:border-forest-400 hover:shadow-xl hover:shadow-forest-50
                 hover:scale-105 transition-all duration-300"
        >
          <div class="absolute -top-4 -left-4 w-10 h-10 bg-forest-700 text-white
                      rounded-xl flex items-center justify-center font-bold text-sm shadow-lg
                      group-hover:bg-harvest transition-colors duration-300">
            {{ i + 1 }}
          </div>
          <div class="w-12 h-12 bg-forest-50 rounded-xl flex items-center justify-center
                      mb-5 mt-2 group-hover:scale-110 transition-transform duration-300 text-2xl">
            {{ step.icon }}
          </div>
          <h3 class="font-bold text-base mb-2 text-earth-900">{{ step.title }}</h3>
          <p class="text-earth-500 text-sm leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>

      <div class="text-center mt-12" data-reveal>
        <RouterLink to="/how-it-works" class="btn-outline">
          See full process →
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  { icon: '📋', title: 'Submit request',  desc: 'Tell us what you need, the quantity, and destination' },
  { icon: '🔍', title: 'We source',       desc: 'We match your request against our verified supplier network' },
  { icon: '🤝', title: 'Confirm deal',    desc: 'Price and terms agreed, proforma invoice issued' },
  { icon: '🚢', title: 'Logistics',       desc: 'Freight, customs, and documentation all coordinated' },
  { icon: '✅', title: 'Delivered',       desc: 'Product arrives at your destination on schedule' },
]
</script>