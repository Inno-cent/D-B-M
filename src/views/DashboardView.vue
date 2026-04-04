<template>
  <div class="bg-cream min-h-screen text-earth-900">

    <!-- Dashboard Hero -->
    <div class="bg-forest-800 pt-24 pb-12 px-6 md:px-10">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p class="text-forest-300 text-sm mb-1">Welcome back</p>
            <h1 class="text-3xl font-bold text-white">
              {{ profile?.full_name || user?.email }}
            </h1>
            <p class="text-forest-300 text-sm mt-1">
              {{ profile?.company_name || 'Buyer Account' }} · {{ profile?.country }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink to="/request-quote" class="btn-harvest">
              + New Quote Request
            </RouterLink>
            <button
              @click="handleSignOut"
              class="btn-outline border-white/20 text-white hover:bg-white/10
                     hover:border-white/40 hover:text-white"
            >
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
                 hover:border-forest-300 transition-all duration-300"
        >
          <div class="text-2xl mb-2">{{ stat.icon }}</div>
          <div class="text-2xl font-bold text-forest-700">{{ stat.value }}</div>
          <div class="text-sm text-earth-500 mt-0.5">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Quote Requests -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-earth-900">Your Quote Requests</h2>
          <RouterLink to="/request-quote"
            class="text-sm font-semibold text-forest-600 hover:text-forest-700 transition-colors">
            + New Request
          </RouterLink>
        </div>

        <!-- Loading -->
        <div v-if="loadingQuotes" class="text-center py-16">
          <svg class="animate-spin w-8 h-8 text-forest-500 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p class="text-earth-400 text-sm mt-3">Loading your requests...</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="quotes.length === 0"
          class="border-2 border-dashed border-earth-300 rounded-3xl p-16 text-center bg-white">
          <p class="text-5xl mb-4">🌾</p>
          <h3 class="text-xl font-bold text-earth-900 mb-2">No quote requests yet</h3>
          <p class="text-earth-500 mb-6 max-w-sm mx-auto">
            Submit your first quote request and we will source the best Nigerian commodity for you.
          </p>
          <RouterLink to="/request-quote" class="btn-primary">
            Request Your First Quote →
          </RouterLink>
        </div>

        <!-- Quotes table -->
        <div v-else class="border-2 border-earth-200 rounded-2xl overflow-hidden bg-white">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-parchment border-b-2 border-earth-200">
                  <th class="text-left px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th class="text-left px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th class="text-left px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th class="text-left px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="text-left px-6 py-4 text-xs font-semibold text-earth-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(quote, i) in quotes"
                  :key="quote.id"
                  :class="['border-b border-earth-100 last:border-0 hover:bg-parchment/50 transition-colors',
                    i % 2 === 0 ? 'bg-white' : 'bg-cream/30']"
                >
                  <td class="px-6 py-4">
                    <span class="font-semibold text-earth-900 text-sm">{{ quote.product }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-earth-600">{{ quote.quantity }}</td>
                  <td class="px-6 py-4 text-sm text-earth-600">
                    {{ quote.delivery_destination || quote.buyer_country }}
                  </td>
                  <td class="px-6 py-4">
                    <span :class="[
                      'text-xs px-3 py-1 rounded-full font-semibold border',
                      statusClass(quote.status)
                    ]">
                      {{ quote.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-earth-500">
                    {{ formatDate(quote.created_at) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Quick links -->
      <div>
        <h2 class="text-2xl font-bold mb-6 text-earth-900">Quick Actions</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <RouterLink
            v-for="action in quickActions"
            :key="action.path"
            :to="action.path"
            class="group border-2 border-earth-200 rounded-2xl p-6 bg-white
                   hover:border-forest-400 hover:shadow-lg hover:-translate-y-1
                   transition-all duration-300 flex items-start gap-4"
          >
            <div class="text-3xl group-hover:scale-110 transition-transform duration-300">
              {{ action.icon }}
            </div>
            <div>
              <h3 class="font-bold text-earth-900 mb-1">{{ action.title }}</h3>
              <p class="text-sm text-earth-500 leading-relaxed">{{ action.desc }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../lib/supabase'

const auth   = useAuthStore()
const router = useRouter()

const user    = computed(() => auth.user)
const profile = ref<any>(null)
const quotes  = ref<any[]>([])
const loadingQuotes = ref(true)

onMounted(async () => {
  // Fetch profile
  if (auth.user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', auth.user.id)
      .single()
    profile.value = data
  }

  // Fetch quotes
  const { data } = await supabase
    .from('quote_requests')
    .select('*')
    .eq('user_id', auth.user?.id)
    .order('created_at', { ascending: false })
  quotes.value = data || []
  loadingQuotes.value = false
})

const handleSignOut = async () => {
  await auth.signOut()
  router.push('/')
}

const statusClass = (status: string) => ({
  pending:    'bg-amber-50 text-amber-700 border-amber-200',
  reviewing:  'bg-blue-50 text-blue-700 border-blue-200',
  sourcing:   'bg-forest-50 text-forest-700 border-forest-200',
  completed:  'bg-green-50 text-green-700 border-green-200',
  cancelled:  'bg-red-50 text-red-700 border-red-200',
}[status] || 'bg-earth-100 text-earth-600 border-earth-200')

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

const stats = computed(() => [
  { icon: '📋', value: quotes.value.length,                                                label: 'Total Requests' },
  { icon: '⏳', value: quotes.value.filter(q => q.status === 'pending').length,            label: 'Pending' },
  { icon: '🔍', value: quotes.value.filter(q => q.status === 'sourcing').length,           label: 'Being Sourced' },
  { icon: '✅', value: quotes.value.filter(q => q.status === 'completed').length,          label: 'Completed' },
])

const quickActions = [
  { icon: '📋', title: 'Request a Quote', path: '/request-quote',
    desc: 'Submit a new commodity sourcing request' },
  { icon: '🌿', title: 'Browse Products', path: '/products',
    desc: 'Explore our full commodity catalogue' },
  { icon: '🤝', title: 'How It Works',   path: '/how-it-works',
    desc: 'Understand our sourcing process' },
  { icon: '📧', title: 'Contact Us',     path: '/contact',
    desc: 'Get in touch with our sourcing team' },
  { icon: '🌍', title: 'Supplier Network', path: '/supplier-network',
    desc: 'Learn about our verified suppliers' },
  { icon: '📰', title: 'Market Insights', path: '/blog',
    desc: 'Stay updated on Nigerian commodity markets' },
]
</script>