<template>
  <div class="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen">
    <div class="page-hero">
      <div class="max-w-7xl mx-auto">
        <span class="section-label">Insights</span>
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-4">Market Insights</h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg max-w-xl mb-8">
          Analysis on Nigerian commodity exports, trade education, and wholesale market dynamics.
        </p>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="cat in categories"
            :key="cat.value"
            @click="activeCategory = cat.value"
            :class="[
              'px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200',
              activeCategory === cat.value
                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400'
            ]"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <!-- Featured -->
      <div class="border-2 border-gray-200 dark:border-gray-800 rounded-3xl p-8 md:p-12 mb-10
                  hover:border-black dark:hover:border-white hover:shadow-2xl
                  transition-all duration-300" data-reveal>
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span class="text-xs px-3 py-1 rounded-full font-semibold mb-4 inline-block
                         bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400">
              Export Insights
            </span>
            <h2 class="text-3xl font-bold mb-4 leading-tight">
              How to import sesame seeds from Nigeria: A complete buyer's guide
            </h2>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Everything international buyers need to know about sourcing, grading, and shipping sesame seeds from verified Nigerian suppliers.
            </p>
            <RouterLink
              to="/blog/importing-sesame-seeds-nigeria"
              class="inline-flex items-center gap-2 font-semibold text-sm hover:gap-3 transition-all"
            >
              Read article <span>→</span>
            </RouterLink>
          </div>
          <div class="border-2 border-gray-200 dark:border-gray-800 rounded-2xl h-48
                      flex items-center justify-center text-8xl bg-gray-50 dark:bg-gray-900">
            🌿
          </div>
        </div>
      </div>

      <!-- Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <RouterLink
          v-for="(post, i) in filteredPosts"
          :key="post.slug"
          :to="`/blog/${post.slug}`"
          data-reveal
          :data-reveal-delay="String((i % 3) + 1)"
          class="group border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-7
                 bg-white dark:bg-gray-900 hover:border-black dark:hover:border-white
                 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
        >
          <span
            class="text-xs px-3 py-1 rounded-full font-semibold mb-5 w-fit"
            :class="{
              'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400': post.category === 'export',
              'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400': post.category === 'local',
              'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400': post.category === 'trade',
            }"
          >
            {{ post.categoryLabel }}
          </span>
          <h3 class="font-bold text-base mb-3 leading-snug flex-1
                     group-hover:underline underline-offset-4">
            {{ post.title }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-5">
            {{ post.excerpt }}
          </p>
          <span class="inline-flex items-center gap-1 text-sm font-semibold
                       group-hover:gap-2 transition-all duration-200">
            Read more <span>→</span>
          </span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useReveal } from '../composables/useReveal'

const { observe } = useReveal()
onMounted(() => observe())

const activeCategory = ref('all')

const categories = [
  { label: 'All Articles',   value: 'all' },
  { label: 'Export Insights',value: 'export' },
  { label: 'Nigerian Market',value: 'local' },
  { label: 'Trade Education',value: 'trade' },
]

const posts = [
  { slug: 'hibiscus-export-standards', title: 'Export quality standards for hibiscus flower',
    excerpt: 'Understanding moisture, colour, and packaging requirements for hibiscus destined for European and Asian markets.',
    category: 'export', categoryLabel: 'Export Insights' },
  { slug: 'wholesale-palm-oil-nigeria', title: 'Wholesale palm oil distribution in Nigeria',
    excerpt: 'Key distribution hubs, pricing dynamics, and supplier types for palm oil buyers in the Nigerian domestic market.',
    category: 'local', categoryLabel: 'Nigerian Market' },
  { slug: 'fob-vs-cif', title: 'FOB vs CIF: what commodity buyers need to know',
    excerpt: 'A plain-English explanation of the two most common shipping incoterms used in Nigerian export contracts.',
    category: 'trade', categoryLabel: 'Trade Education' },
  { slug: 'ginger-supply-season', title: 'Nigerian ginger supply season explained',
    excerpt: 'When to buy, when prices peak, and how seasonal cycles affect availability of Nigerian ginger year-round.',
    category: 'export', categoryLabel: 'Export Insights' },
  { slug: 'export-documentation', title: 'Export documentation for Nigerian commodities',
    excerpt: 'A breakdown of the key documents required to legally export agricultural commodities from Nigeria.',
    category: 'trade', categoryLabel: 'Trade Education' },
  { slug: 'maize-sourcing-nigeria', title: 'Best regions for maize sourcing in Nigeria',
    excerpt: 'A guide to the top maize-producing states, seasonal pricing trends, and quality considerations for bulk buyers.',
    category: 'local', categoryLabel: 'Nigerian Market' },
]

const filteredPosts = computed(() =>
  activeCategory.value === 'all' ? posts : posts.filter(p => p.category === activeCategory.value)
)
</script>