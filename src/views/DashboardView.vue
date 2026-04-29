<template>
  <div class="bg-cream min-h-screen text-earth-900">

    <!-- Header -->
    <div class="bg-forest-800 pt-24 pb-12 px-6 md:px-10">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p class="text-forest-300 text-sm mb-1">Welcome back 👋</p>
            <h1 class="text-3xl font-bold text-white">
              {{ profile?.full_name || user?.email }}
            </h1>
            <p class="text-forest-300 text-sm mt-1 flex items-center gap-2">
              <span>{{ profile?.company_name || 'Buyer Account' }}</span>
              <span v-if="profile?.country" class="w-1 h-1 bg-forest-400 rounded-full" />
              <span>{{ profile?.country }}</span>
            </p>
          </div>
          <div class="flex items-center gap-3 flex-wrap">
            <RouterLink to="/request-quote" class="btn-harvest inline-flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              New Quote Request
            </RouterLink>
            <button @click="handleSignOut"
              class="inline-flex items-center gap-2 border-2 border-white/20 text-white
                     text-sm py-2.5 px-4 rounded-xl font-semibold
                     hover:bg-white/10 hover:border-white/40 transition-all duration-200">
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
        <div v-for="stat in stats" :key="stat.label"
          class="border-2 border-earth-200 rounded-2xl p-6 bg-white
                 hover:border-forest-300 hover:shadow-lg transition-all duration-300">
          <div class="text-2xl mb-3">{{ stat.icon }}</div>
          <div class="text-2xl font-bold text-forest-700">{{ stat.value }}</div>
          <div class="text-sm text-earth-500 mt-0.5">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Quote History -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-earth-900">Quote History</h2>
          <RouterLink to="/request-quote"
            class="text-sm font-semibold text-forest-600 hover:text-forest-700 transition-colors">
            + New Request
          </RouterLink>
        </div>

        <!-- Loading -->
        <div v-if="loadingQuotes"
          class="border-2 border-earth-200 rounded-2xl p-16 text-center bg-white">
          <div class="w-8 h-8 border-4 border-earth-200 border-t-forest-600
                      rounded-full animate-spin mx-auto mb-4" />
          <p class="text-earth-400 text-sm">Loading your requests...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="quotes.length === 0"
          class="border-2 border-dashed border-earth-300 rounded-3xl p-16 text-center bg-white">
          <p class="text-6xl mb-5">🌾</p>
          <h3 class="text-xl font-bold text-earth-900 mb-3">No quote requests yet</h3>
          <p class="text-earth-500 mb-8 max-w-sm mx-auto leading-relaxed">
            Submit your first quote request and we will source the best Nigerian commodity
            for you within 24 hours.
          </p>
          <RouterLink to="/request-quote" class="btn-primary px-8 py-4">
            Request Your First Quote →
          </RouterLink>
        </div>

        <!-- Quote list -->
        <div v-else class="border-2 border-earth-200 rounded-2xl overflow-hidden bg-white">

          <!-- Table header -->
          <div class="hidden md:grid grid-cols-12 gap-4 px-6 py-3
                      bg-parchment border-b-2 border-earth-200
                      text-xs font-semibold text-earth-500 uppercase tracking-wider">
            <div class="col-span-1">Ref</div>
            <div class="col-span-3">Product</div>
            <div class="col-span-2">Quantity</div>
            <div class="col-span-2">Country</div>
            <div class="col-span-2">Status</div>
            <div class="col-span-2">Date</div>
          </div>

          <!-- Quote rows -->
          <div v-for="(quote, i) in quotes" :key="quote.id"
            :class="[
              'px-6 py-4 border-b-2 last:border-b-0 border-earth-100',
              'hover:bg-parchment/40 transition-colors duration-200',
              i % 2 === 0 ? 'bg-white' : 'bg-cream/30'
            ]">

            <!-- Mobile layout -->
            <div class="md:hidden space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-earth-900 text-sm">{{ quote.product }}</span>
                <span :class="['text-xs px-2.5 py-1 rounded-full font-semibold border',
                  statusStyles[quote.status] || 'bg-earth-100 text-earth-600 border-earth-200']">
                  {{ statusLabels[quote.status] || quote.status }}
                </span>
              </div>
              <div class="flex items-center gap-3 text-xs text-earth-500">
                <span class="font-mono">{{ quote.ref }}</span>
                <span>·</span>
                <span>{{ quote.quantity }}</span>
                <span>·</span>
                <span>{{ quote.buyer_country }}</span>
              </div>
              <div class="text-xs text-earth-400">{{ formatDate(quote.created_at) }}</div>
            </div>

            <!-- Desktop layout -->
            <div class="hidden md:grid grid-cols-12 gap-4 items-center">
              <div class="col-span-1">
                <span class="font-mono text-xs text-earth-500">{{ quote.ref }}</span>
              </div>
              <div class="col-span-3">
                <p class="font-semibold text-sm text-earth-900">{{ quote.product }}</p>
                <p class="text-xs text-earth-400 mt-0.5">{{ quote.company_name }}</p>
              </div>
              <div class="col-span-2 text-sm text-earth-600">{{ quote.quantity }}</div>
              <div class="col-span-2 text-sm text-earth-600">{{ quote.buyer_country }}</div>
              <div class="col-span-2">
                <span :class="['text-xs px-2.5 py-1 rounded-full font-semibold border',
                  statusStyles[quote.status] || 'bg-earth-100 text-earth-600 border-earth-200']">
                  {{ statusLabels[quote.status] || quote.status }}
                </span>
              </div>
              <div class="col-span-2 text-xs text-earth-400">
                {{ formatDate(quote.created_at) }}
              </div>
            </div>

            <!-- Notes if present -->
            <div v-if="quote.notes"
              class="mt-2 pt-2 border-t border-earth-100 md:pl-0">
              <p class="text-xs text-earth-400 italic truncate">
                📝 {{ quote.notes }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Details -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-earth-900">Account Details</h2>
          <button @click="editMode = !editMode"
            class="text-sm font-semibold text-forest-600 hover:text-forest-700 transition-colors">
            {{ editMode ? 'Cancel' : 'Edit Profile' }}
          </button>
        </div>

        <!-- View mode -->
        <div v-if="!editMode"
          class="border-2 border-earth-200 rounded-2xl overflow-hidden bg-white">
          <div v-for="(field, i) in accountFields" :key="field.label"
            :class="[
              'flex items-center justify-between px-6 py-4 text-sm',
              'border-b-2 last:border-b-0 border-earth-100',
              i % 2 === 0 ? 'bg-white' : 'bg-parchment/40'
            ]">
            <span class="text-earth-500 font-medium w-40 flex-shrink-0">{{ field.label }}</span>
            <span class="font-semibold text-earth-900 text-right">{{ field.value || '—' }}</span>
          </div>
        </div>

        <!-- Edit mode -->
        <div v-else class="border-2 border-earth-200 rounded-2xl p-8 bg-white space-y-5">
          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-semibold mb-2 text-earth-800">Full Name</label>
              <input v-model="editForm.full_name" type="text" class="input-field" placeholder="Your full name" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-earth-800">Company Name</label>
              <input v-model="editForm.company_name" type="text" class="input-field" placeholder="Your company" />
            </div>
          </div>
          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-semibold mb-2 text-earth-800">Country</label>
              <input v-model="editForm.country" type="text" class="input-field" placeholder="Your country" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-earth-800">Phone</label>
              <input v-model="editForm.phone" type="tel" class="input-field" placeholder="+1 234 567 8900" />
            </div>
          </div>
          <div class="flex items-center gap-3 pt-2">
            <button @click="saveProfile" :disabled="savingProfile"
              class="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">
              <svg v-if="savingProfile" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              {{ savingProfile ? 'Saving...' : 'Save Changes' }}
            </button>
            <button @click="editMode = false" class="btn-outline">Cancel</button>
          </div>
          <Transition name="fade-slide">
            <div v-if="saveSuccess"
              class="flex items-center gap-3 p-4 bg-forest-50 border-2 border-forest-200 rounded-xl text-forest-700 text-sm">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Profile updated successfully
            </div>
          </Transition>
        </div>
      </div>

      <!-- Quick Actions -->
      <div>
        <h2 class="text-2xl font-bold mb-6 text-earth-900">Explore</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <RouterLink v-for="action in quickActions" :key="action.path" :to="action.path"
            class="group border-2 border-earth-200 rounded-2xl p-6 bg-white
                   hover:border-forest-400 hover:shadow-lg hover:-translate-y-1
                   transition-all duration-300 flex items-start gap-4">
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
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useQuoteStore } from '../stores/quotes'

const auth       = useAuthStore()
const quoteStore = useQuoteStore()
const router     = useRouter()

const profile = computed(() => auth.profile)
const user    = computed(() => auth.user)

// ── Load quotes on mount ───────────────────────────────────────
onMounted(async () => {
  if (auth.user) {
    await quoteStore.fetchMyQuotes(auth.user.id)
  }
})

const quotes        = computed(() => quoteStore.quotes)
const loadingQuotes = computed(() => quoteStore.loading)

// ── Status display ─────────────────────────────────────────────
const statusStyles: Record<string, string> = {
  pending:          'bg-amber-50  text-amber-700  border-amber-200',
  reviewing:        'bg-blue-50   text-blue-700   border-blue-200',
  sourcing:         'bg-violet-50 text-violet-700 border-violet-200',
  in_store:         'bg-orange-50 text-orange-700 border-orange-200',
  transit:          'bg-sky-50    text-sky-700    border-sky-200',
  out_for_delivery: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  completed:        'bg-forest-50 text-forest-700 border-forest-200',
  cancelled:        'bg-red-50    text-red-700    border-red-200',
}

const statusLabels: Record<string, string> = {
  pending:          'Quote Received',
  reviewing:        'Under Review',
  sourcing:         'Sourcing Product',
  in_store:         'Parcel in Store',
  transit:          'In Transit',
  out_for_delivery: 'Out for Delivery',
  completed:        'Delivered',
  cancelled:        'Cancelled',
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

// ── Stats ──────────────────────────────────────────────────────
const stats = computed(() => [
  {
    icon: '📋',
    value: quotes.value.length,
    label: 'Total Requests'
  },
  {
    icon: '⏳',
    value: quotes.value.filter(q =>
      ['pending', 'reviewing', 'sourcing'].includes(q.status)
    ).length,
    label: 'In Progress'
  },
  {
    icon: '🚢',
    value: quotes.value.filter(q =>
      ['in_store', 'transit', 'out_for_delivery'].includes(q.status)
    ).length,
    label: 'In Transit'
  },
  {
    icon: '✅',
    value: quotes.value.filter(q => q.status === 'completed').length,
    label: 'Completed'
  },
])

// ── Edit profile ───────────────────────────────────────────────
const editMode      = ref(false)
const savingProfile = ref(false)
const saveSuccess   = ref(false)

const editForm = reactive({
  full_name:    '',
  company_name: '',
  country:      '',
  phone:        '',
})

watch(profile, (p) => {
  if (p) {
    editForm.full_name    = p.full_name    || ''
    editForm.company_name = p.company_name || ''
    editForm.country      = p.country      || ''
    editForm.phone        = p.phone        || ''
  }
}, { immediate: true })

const saveProfile = async () => {
  savingProfile.value = true
  saveSuccess.value   = false
  try {
    await auth.updateProfile({
      full_name:    editForm.full_name,
      company_name: editForm.company_name,
      country:      editForm.country,
      phone:        editForm.phone,
    })
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
      editMode.value    = false
    }, 2000)
  } catch (e) {
    console.error('Profile update failed:', e)
  } finally {
    savingProfile.value = false
  }
}

const handleSignOut = async () => {
  await auth.signOut()
  router.push('/')
}

const accountFields = computed(() => [
  { label: 'Full Name',    value: profile.value?.full_name },
  { label: 'Email',        value: user.value?.email },
  { label: 'Company',      value: profile.value?.company_name },
  { label: 'Country',      value: profile.value?.country },
  { label: 'Phone',        value: profile.value?.phone },
  { label: 'Account Type', value: 'Buyer' },
  {
    label: 'Member Since',
    value: profile.value?.created_at
      ? new Date(profile.value.created_at).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'long', year: 'numeric'
        })
      : '—'
  },
])

const quickActions = [
  { icon: '📋', title: 'Request a Quote',  path: '/request-quote',    desc: 'Submit a new commodity sourcing request' },
  { icon: '🌿', title: 'Browse Products',  path: '/products',         desc: 'Explore our full commodity catalogue' },
  { icon: '🤝', title: 'How It Works',     path: '/how-it-works',     desc: 'Understand our sourcing process' },
  { icon: '🌍', title: 'Supplier Network', path: '/supplier-network', desc: 'Learn about our verified supplier partners' },
  { icon: '📧', title: 'Contact Us',       path: '/contact',          desc: 'Get in touch with our sourcing team' },
  { icon: '📰', title: 'Market Insights',  path: '/blog',             desc: 'Stay updated on Nigerian commodity markets' },
]
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from { opacity: 0; transform: translateY(-6px); }
.fade-slide-leave-to   { opacity: 0; transform: translateY(6px); }
</style>