<template>
  <div class="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen">
    <div class="page-hero">
      <div class="max-w-7xl mx-auto">
        <span class="section-label">Who We Are</span>
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-4">About DualMarket</h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg max-w-xl">
          A trusted Nigerian commodity brokerage built on verified supplier relationships and deep market expertise.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <div class="grid lg:grid-cols-2 gap-16 items-start">
        <div data-reveal class="space-y-6">
          <h2 class="text-3xl font-bold">What we do</h2>
          <div class="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>DualMarket Brokerage connects international buyers and local Nigerian businesses with verified suppliers of agricultural commodities and wholesale goods.</p>
            <p>We specialise in two market segments — export commodities for international buyers, and wholesale products for the Nigerian domestic market.</p>
            <p>Operating as a trusted intermediary, we handle sourcing, quality assurance, logistics coordination, and full export documentation — removing the complexity of direct supplier engagement.</p>
            <p>Our supplier network spans farmer cooperatives, processors, commodity aggregators, and manufacturers across Nigeria's key agricultural regions.</p>
          </div>
          <RouterLink to="/request-quote" class="btn-primary inline-flex mt-4">
            Work With Us →
          </RouterLink>
        </div>

        <div data-reveal data-reveal-delay="2" class="grid grid-cols-2 gap-4">
          <div
            v-for="(stat, i) in stats"
            :key="stat.label"
            class="border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-7 text-center
                   hover:border-black dark:hover:border-white hover:shadow-xl
                   hover:-translate-y-1 transition-all duration-300"
          >
            <div class="text-4xl font-bold mb-2">{{ stat.value }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Values -->
    <div class="border-t-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <h2 class="text-3xl font-bold mb-10" data-reveal>Our values</h2>
        <div class="grid md:grid-cols-3 gap-5">
          <div
            v-for="(value, i) in values"
            :key="value.title"
            data-reveal
            :data-reveal-delay="String(i + 1)"
            class="group border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-8
                   bg-white dark:bg-gray-900 hover:border-black dark:hover:border-white
                   hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div class="text-3xl mb-5 group-hover:scale-110 transition-transform duration-300 w-fit">
              {{ value.icon }}
            </div>
            <h3 class="text-xl font-bold mb-3">{{ value.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{{ value.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Why broker -->
    <div class="border-t-2 border-gray-200 dark:border-gray-800">
      <div class="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div data-reveal>
            <h2 class="text-3xl font-bold mb-6">Why work with a broker?</h2>
            <div class="space-y-5">
              <div v-for="point in brokerPoints" :key="point.title" class="flex gap-4 items-start">
                <div class="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-sm mb-0.5">{{ point.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{{ point.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <div data-reveal data-reveal-delay="2"
            class="border-2 border-gray-200 dark:border-gray-800 rounded-3xl p-10
                   bg-gray-50 dark:bg-gray-900/50 text-center">
            <div class="text-6xl mb-6">🌍</div>
            <h3 class="text-2xl font-bold mb-3">Based in Lagos, Nigeria</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
              We operate at the heart of Nigeria's commodity trade ecosystem, with on-the-ground relationships that remote buyers cannot replicate.
            </p>
            <RouterLink
              to="/contact"
              class="btn-outline"
            >
              Get In Touch →
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useReveal } from '../composables/useReveal'

const { observe } = useReveal()
onMounted(() => observe())

const stats = [
  { value: '50+', label: 'Verified Suppliers' },
  { value: '18',  label: 'Countries Served' },
  { value: '12+', label: 'Commodities' },
  { value: '24h', label: 'Response Time' },
]

const values = [
  { icon: '🔍', title: 'Transparency',
    desc: 'Every deal is fully documented, clearly priced, and backed by formal agreements. No hidden fees.' },
  { icon: '⭐', title: 'Quality First',
    desc: 'We never compromise on grades. Every shipment is inspected and verified before it leaves Nigeria.' },
  { icon: '🤝', title: 'End-to-End',
    desc: 'From your first quote request to final delivery, we own the entire process and keep you informed.' },
]

const brokerPoints = [
  { title: 'No cold-start risk', desc: 'You skip the months of supplier prospecting, vetting, and trial-and-error that direct sourcing requires.' },
  { title: 'Quality assurance built in', desc: 'We inspect before you pay. No surprises when your shipment arrives.' },
  { title: 'Documentation handled', desc: 'Export certificates, phytosanitary docs, customs clearance — we know what is needed and we do it.' },
  { title: 'Local intelligence', desc: 'We know when prices are high, when supply is tight, and which suppliers to avoid.' },
  { title: 'Single point of contact', desc: 'Instead of managing multiple suppliers and agents — you have one contact who handles everything.' },
]
</script>