<template>
  <div class="bg-cream min-h-screen text-earth-900">

    <!-- Header — slimmer, no big welcome banner -->
    <div class="bg-forest-800 pt-24 pb-10 px-6 md:px-10">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-full bg-forest-600 flex items-center justify-center
                        text-white font-bold text-sm flex-shrink-0">
              {{ initials }}
            </div>
            <div>
              <h1 class="text-lg font-bold text-white leading-tight">
                {{ profile?.full_name || user?.email }}
              </h1>
              <p class="text-forest-300 text-xs mt-0.5">
                {{ profile?.company_name || 'Buyer' }}
                <span v-if="profile?.country"> · {{ profile.country }}</span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <RouterLink
              v-if="auth.isAdmin"
              to="/admin/prices"
              class="text-xs font-semibold text-forest-200 border border-forest-600
                     rounded-lg px-3 py-2 hover:bg-forest-700 hover:text-white
                     transition-all duration-200"
            >
              Manage Prices
            </RouterLink>
            <button @click="handleSignOut"
              class="text-xs font-semibold text-white/70 hover:text-white
                     transition-colors duration-200">
              Sign Out
            </button>
          </div>
        </div>

        <!-- Slim status strip — signature element, replaces the 4-tile stats grid -->
        <div class="mt-7 flex items-center gap-5 flex-wrap text-sm">
          <div v-for="(stat, i) in statusStrip" :key="stat.label" class="flex items-center gap-5">
            <div class="flex items-baseline gap-1.5">
              <span class="text-xl font-bold text-white">{{ stat.value }}</span>
              <span class="text-forest-300 text-xs">{{ stat.label }}</span>
            </div>
            <span v-if="i < statusStrip.length - 1" class="w-px h-4 bg-forest-600/60" />
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-6 md:px-10 py-10">

      <!-- Tab strip: Orders leads, Quotes secondary -->
      <div class="flex items-center gap-1 mb-6 border-b-2 border-earth-200">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          :class="[
            'px-4 py-3 text-sm font-semibold transition-all duration-200 -mb-[2px] border-b-2',
            activeTab === tab.value
              ? 'border-forest-700 text-forest-800'
              : 'border-transparent text-earth-400 hover:text-earth-600'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- ── Orders panel ──────────────────────────────────────────── -->
      <div v-if="activeTab === 'orders'">
        <!-- Empty state — orders.ts not built yet, this is the real
             intended state, not a loading placeholder -->
        <div class="border-2 border-dashed border-earth-300 rounded-3xl p-14 text-center bg-white">
          <p class="text-5xl mb-4">📦</p>
          <h3 class="text-lg font-bold text-earth-900 mb-2">No orders yet</h3>
          <p class="text-earth-500 mb-7 max-w-sm mx-auto text-sm leading-relaxed">
            Browse local produce, add what you need to your cart, and check out —
            your orders will show up here.
          </p>
          <RouterLink to="/products" class="btn-primary px-7 py-3 text-sm">
            Browse Products →
          </RouterLink>
        </div>
      </div>

      <!-- ── Quote Requests panel — same logic as before, just relocated ── -->
      <div v-else>
        <div class="flex items-center justify-between mb-5">
          <p class="text-sm text-earth-500">
            For export commodities sourced to order.
          </p>
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
          class="border-2 border-dashed border-earth-300 rounded-3xl p-14 text-center bg-white">
          <p class="text-5xl mb-4">🌾</p>
          <h3 class="text-lg font-bold text-earth-900 mb-2">No quote requests yet</h3>
          <p class="text-earth-500 mb-7 max-w-sm mx-auto text-sm leading-relaxed">
            Need an export commodity sourced? Submit a request and we'll get back
            to you within 24 hours.
          </p>
          <RouterLink to="/request-quote" class="btn-primary px-7 py-3 text-sm">
            Request a Quote →
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

      <!-- Account Details — collapsed by default -->
      <div class="mt-12 border-2 border-earth-200 rounded-2xl bg-white overflow-hidden">
        <button
          @click="accountOpen = !accountOpen"
          class="w-full flex items-center justify-between px-6 py-4 text-left"
        >
          <span class="text-sm font-bold text-earth-900">Account Details</span>
          <svg
            :class="['w-4 h-4 text-earth-400 transition-transform duration-200', accountOpen ? 'rotate-180' : '']"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div v-if="accountOpen" class="border-t-2 border-earth-100">
          <!-- View mode -->
          <div v-if="!editMode">
            <div v-for="(field, i) in accountFields" :key="field.label"
              :class="[
                'flex items-center justify-between px-6 py-3.5 text-sm',
                'border-b-2 last:border-b-0 border-earth-100',
                i % 2 === 0 ? 'bg-white' : 'bg-parchment/30'
              ]">
              <span class="text-earth-500 font-medium">{{ field.label }}</span>
              <span class="font-semibold text-earth-900 text-right">{{ field.value || '—' }}</span>
            </div>
            <div class="px-6 py-4">
              <button @click="editMode = true"
                class="text-sm font-semibold text-forest-600 hover:text-forest-700 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>

          <!-- Edit mode -->
          <div v-else class="p-6 space-y-5">
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
      </div>

      <!-- Quick Actions — trimmed to what's still relevant -->
      <div class="mt-10 flex flex-wrap gap-3">
        <RouterLink v-for="action in quickActions" :key="action.path" :to="action.path"
          class="inline-flex items-center gap-2 text-sm font-semibold text-earth-600
                 border-2 border-earth-200 rounded-xl px-4 py-2.5 bg-white
                 hover:border-forest-400 hover:text-forest-700 transition-all duration-200">
          <span>{{ action.icon }}</span>
          {{ action.title }}
        </RouterLink>
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

const initials = computed(() => {
  const name = profile.value?.full_name || user.value?.email || ''
  return name
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join('') || '?'
})

// ── Load quotes on mount ───────────────────────────────────────
onMounted(async () => {
  if (auth.user) {
    await quoteStore.fetchMyQuotes(auth.user.id)
  }
})

const quotes        = computed(() => quoteStore.quotes)
const loadingQuotes = computed(() => quoteStore.loading)

// ── Tabs — Orders leads ─────────────────────────────────────────
const tabs = [
  { label: 'Orders',         value: 'orders' as const },
  { label: 'Quote Requests', value: 'quotes' as const },
]
const activeTab = ref<'orders' | 'quotes'>('orders')

// ── Status display (unchanged logic) ────────────────────────────
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

// ── Slim status strip — replaces the 4-tile stats grid.
//    Orders count is hardcoded to 0 until orders.ts exists; swap in
//    real data once that store is built. ───────────────────────────
const statusStrip = computed(() => [
  { value: 0,                      label: 'Orders' },
  { value: quotes.value.length,     label: 'Quote Requests' },
  {
    value: quotes.value.filter(q => ['pending', 'reviewing', 'sourcing'].includes(q.status)).length,
    label: 'In Progress'
  },
])

// ── Account details collapse ────────────────────────────────────
const accountOpen = ref(false)

// ── Edit profile (unchanged logic) ──────────────────────────────
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

// ── Quick Actions — trimmed; dropped Request Quote duplicate
//    (already accessible via tab) and Market Insights to reduce noise ──
const quickActions = [
  { icon: '🌿', title: 'Browse Products',  path: '/products' },
  { icon: '🤝', title: 'How It Works',      path: '/how-it-works' },
  { icon: '🌍', title: 'Supplier Network',  path: '/supplier-network' },
  { icon: '📧', title: 'Contact Us',        path: '/contact' },
]
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from { opacity: 0; transform: translateY(-6px); }
.fade-slide-leave-to   { opacity: 0; transform: translateY(6px); }
</style>