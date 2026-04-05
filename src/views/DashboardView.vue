<template>
  <div class="bg-cream min-h-screen text-earth-900">

    <!-- Dashboard header -->
    <div class="bg-forest-800 pt-24 pb-12 px-6 md:px-10">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p class="text-forest-300 text-sm mb-1">Welcome back 👋</p>
            <h1 class="text-3xl font-bold text-white">
              {{ user?.fullName }}
            </h1>
            <p class="text-forest-300 text-sm mt-1 flex items-center gap-2">
              <span>{{ user?.companyName || 'Buyer Account' }}</span>
              <span class="w-1 h-1 bg-forest-400 rounded-full" />
              <span>{{ user?.country }}</span>
            </p>
          </div>
          <div class="flex items-center gap-3 flex-wrap">
            <RouterLink
              to="/request-quote"
              class="btn-harvest inline-flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              New Quote Request
            </RouterLink>
            <button
              @click="handleSignOut"
              class="inline-flex items-center gap-2 border-2 border-white/20 text-white
                     text-sm py-2.5 px-4 rounded-xl font-semibold
                     hover:bg-white/10 hover:border-white/40 transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-10 py-12">

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="border-2 border-earth-200 rounded-2xl p-6 bg-white
                 hover:border-forest-300 hover:shadow-lg transition-all duration-300"
        >
          <div class="text-2xl mb-3">{{ stat.icon }}</div>
          <div class="text-2xl font-bold text-forest-700">{{ stat.value }}</div>
          <div class="text-sm text-earth-500 mt-0.5">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Recent quote requests -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-earth-900">Your Quote Requests</h2>
          <RouterLink
            to="/request-quote"
            class="text-sm font-semibold text-forest-600 hover:text-forest-700
                   transition-colors flex items-center gap-1"
          >
            + New Request
          </RouterLink>
        </div>

        <!-- Empty state -->
        <div
          class="border-2 border-dashed border-earth-300 rounded-3xl p-16
                 text-center bg-white"
        >
          <p class="text-6xl mb-5">🌾</p>
          <h3 class="text-xl font-bold text-earth-900 mb-3">No quote requests yet</h3>
          <p class="text-earth-500 mb-8 max-w-sm mx-auto leading-relaxed">
            Submit your first quote request and we will source the best Nigerian commodity for you within 24 hours.
          </p>
          <RouterLink to="/request-quote" class="btn-primary px-8 py-4">
            Request Your First Quote →
          </RouterLink>
        </div>
      </div>

      <!-- Account details -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-earth-900 mb-6">Account Details</h2>
        <div class="border-2 border-earth-200 rounded-2xl overflow-hidden bg-white">
          <div
            v-for="(field, i) in accountFields"
            :key="field.label"
            :class="[
              'flex items-center justify-between px-6 py-4 text-sm border-b-2 last:border-b-0 border-earth-100',
              i % 2 === 0 ? 'bg-white' : 'bg-parchment/40'
            ]"
          >
            <span class="text-earth-500 font-medium w-40">{{ field.label }}</span>
            <span class="font-semibold text-earth-900 text-right">{{ field.value || '—' }}</span>
          </div>
        </div>
      </div>

      <!-- Quick actions -->
      <div>
        <h2 class="text-2xl font-bold mb-6 text-earth-900">Explore</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <RouterLink
            v-for="action in quickActions"
            :key="action.path"
            :to="action.path"
            class="group border-2 border-earth-200 rounded-2xl p-6 bg-white
                   hover:border-forest-400 hover:shadow-lg hover:-translate-y-1
                   transition-all duration-300 flex items-start gap-4"
          >
            <div class="text-3xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              {{ action.icon }}
            </div>
            <div>
              <h3 class="font-bold text-earth-900 mb-1 group-hover:text-forest-700 transition-colors">
                {{ action.title }}
              </h3>
              <p class="text-sm text-earth-500 leading-relaxed">{{ action.desc }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth   = useAuthStore()
const router = useRouter()
const user   = computed(() => auth.user)

const handleSignOut = () => {
  auth.signOut()
  router.push('/')
}

const stats = [
  { icon: '📋', value: '0', label: 'Total Requests' },
  { icon: '⏳', value: '0', label: 'Pending' },
  { icon: '🔍', value: '0', label: 'Being Sourced' },
  { icon: '✅', value: '0', label: 'Completed' },
]

const accountFields = computed(() => [
  { label: 'Full Name',    value: user.value?.fullName },
  { label: 'Email',        value: user.value?.email },
  { label: 'Company',      value: user.value?.companyName },
  { label: 'Country',      value: user.value?.country },
  { label: 'Account Type', value: 'Buyer' },
  { label: 'Member Since', value: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
])

const quickActions = [
  { icon: '📋', title: 'Request a Quote',   path: '/request-quote',
    desc: 'Submit a new commodity sourcing request' },
  { icon: '🌿', title: 'Browse Products',   path: '/products',
    desc: 'Explore our full commodity catalogue' },
  { icon: '🤝', title: 'How It Works',      path: '/how-it-works',
    desc: 'Understand our end-to-end sourcing process' },
  { icon: '🌍', title: 'Supplier Network',  path: '/supplier-network',
    desc: 'Learn about our verified supplier partners' },
  { icon: '📧', title: 'Contact Us',        path: '/contact',
    desc: 'Get in touch with our sourcing team' },
  { icon: '📰', title: 'Market Insights',   path: '/blog',
    desc: 'Stay updated on Nigerian commodity markets' },
]
</script>