<template>
  <div class="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen">
    <div class="page-hero">
      <div class="max-w-7xl mx-auto">
        <span class="section-label">Our Network</span>
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-4">Supplier Network</h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg max-w-xl">
          Every supplier is vetted, verified, and held to strict quality standards before we introduce them to any buyer.
        </p>
      </div>
    </div>

    <!-- Stats -->
    <div class="border-b-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div
            v-for="(stat, i) in stats"
            :key="stat.label"
            data-reveal
            :data-reveal-delay="String(i + 1)"
            class="border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center
                   bg-white dark:bg-gray-900 hover:border-black dark:hover:border-white
                   transition-all duration-300"
          >
            <div class="text-3xl font-bold mb-1">{{ stat.value }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Supplier types -->
    <div class="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <h2 class="text-3xl font-bold mb-10" data-reveal>Types of suppliers in our network</h2>
      <div class="grid md:grid-cols-2 gap-5">
        <div
          v-for="(type, i) in supplierTypes"
          :key="type.title"
          data-reveal
          :data-reveal-delay="String((i % 2) + 1)"
          class="group border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-8
                 bg-white dark:bg-gray-900 hover:border-black dark:hover:border-white
                 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          <div class="text-3xl mb-5 group-hover:scale-110 transition-transform duration-300 w-fit">
            {{ type.icon }}
          </div>
          <h3 class="text-xl font-bold mb-3">{{ type.title }}</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5">{{ type.desc }}</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in type.tags"
              :key="tag"
              class="text-xs px-3 py-1 border-2 border-gray-200 dark:border-gray-800
                     rounded-lg text-gray-600 dark:text-gray-400 font-medium"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Verification -->
    <div class="border-t-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div data-reveal>
            <h2 class="text-3xl font-bold mb-6">Our verification process</h2>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              Every partner goes through a structured evaluation before being added to our active network.
            </p>
            <div class="space-y-4">
              <div v-for="(step, i) in verifySteps" :key="step.title" class="flex gap-4 items-start">
                <div class="w-9 h-9 min-w-[36px] border-2 border-gray-200 dark:border-gray-800
                            rounded-xl flex items-center justify-center text-sm font-bold
                            bg-white dark:bg-gray-900">
                  {{ i + 1 }}
                </div>
                <div>
                  <p class="font-semibold text-sm mb-0.5">{{ step.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{{ step.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <div data-reveal data-reveal-delay="2">
            <div class="border-2 border-gray-200 dark:border-gray-800 rounded-3xl p-8
                        bg-white dark:bg-gray-900 space-y-5">
              <h3 class="font-bold text-lg border-b-2 border-gray-100 dark:border-gray-800 pb-5">
                Verification checklist
              </h3>
              <div v-for="item in checklist" :key="item" class="flex items-center gap-3 text-sm">
                <div class="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Regions -->
    <div class="border-t-2 border-gray-200 dark:border-gray-800">
      <div class="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <h2 class="text-3xl font-bold mb-10" data-reveal>Sourcing regions</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="(region, i) in regions"
            :key="region.name"
            data-reveal
            :data-reveal-delay="String((i % 3) + 1)"
            class="border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6
                   hover:border-black dark:hover:border-white transition-all duration-300"
          >
            <h3 class="font-bold mb-2">{{ region.name }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">{{ region.states }}</p>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="commodity in region.commodities"
                :key="commodity"
                class="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800
                       text-gray-600 dark:text-gray-400 rounded-lg font-medium"
              >
                {{ commodity }}
              </span>
            </div>
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
  { value: '50+',  label: 'Verified Suppliers' },
  { value: '6',    label: 'Geopolitical Zones' },
  { value: '12+',  label: 'Commodities Covered' },
  { value: '100%', label: 'Audited Before Listing' },
]

const supplierTypes = [
  { icon: '🌾', title: 'Farmer Cooperatives',
    desc: 'Organised groups of smallholder farmers producing commodities at scale across key agricultural regions in Nigeria.',
    tags: ['Sesame', 'Ginger', 'Maize', 'Rice', 'Hibiscus'] },
  { icon: '🏭', title: 'Processors',
    desc: 'Certified processing facilities that clean, grade, dry, and package commodities to international export specifications.',
    tags: ['Export grading', 'Moisture testing', 'Packaging', 'Quality control'] },
  { icon: '📦', title: 'Commodity Aggregators',
    desc: 'Experienced traders who consolidate produce from multiple farms into shippable volumes while maintaining traceability.',
    tags: ['Bulk consolidation', 'Traceability', 'Multi-source'] },
  { icon: '🏗️', title: 'Manufacturers',
    desc: 'Producers of wholesale consumer goods, packaging materials, and processed food items for the Nigerian domestic market.',
    tags: ['Packaging materials', 'Processed goods', 'FMCG', 'B2B supply'] },
]

const verifySteps = [
  { title: 'Background check', desc: 'Business registration, tax compliance, and trading history review' },
  { title: 'Quality audit', desc: 'Physical inspection of storage, processing, and packaging facilities' },
  { title: 'Trial shipment', desc: 'A supervised sample or pilot order before full network listing' },
  { title: 'Quarterly review', desc: 'Ongoing performance evaluation and re-verification every quarter' },
]

const checklist = [
  'CAC business registration confirmed',
  'Storage facility inspected and approved',
  'Sample commodity tested for grade and moisture',
  'Export documentation capability assessed',
  'Pricing transparency and fair dealing verified',
  'Pilot order completed successfully',
  'Quarterly performance review scheduled',
]

const regions = [
  { name: 'North East', states: 'Borno, Yobe, Gombe, Adamawa', commodities: ['Sesame Seeds', 'Ginger', 'Hibiscus'] },
  { name: 'North West', states: 'Kano, Kaduna, Jigawa, Sokoto', commodities: ['Sesame Seeds', 'Hibiscus', 'Groundnut'] },
  { name: 'North Central', states: 'Plateau, Nasarawa, Niger, Kwara', commodities: ['Ginger', 'Shea Butter', 'Maize'] },
  { name: 'South West', states: 'Oyo, Kwara, Osun, Ogun', commodities: ['Cashew Nuts', 'Palm Oil', 'Cocoa'] },
  { name: 'South East', states: 'Enugu, Anambra, Abia, Imo', commodities: ['Palm Oil', 'Cashew', 'Rice'] },
  { name: 'South South', states: 'Delta, Rivers, Cross River, Akwa Ibom', commodities: ['Palm Oil', 'Rubber', 'Fish'] },
]
</script>