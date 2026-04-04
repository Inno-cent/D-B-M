<template>
  <div class="min-h-screen bg-cream flex">

    <!-- Left — form -->
    <div class="flex-1 flex items-center justify-center px-6 py-20">
      <div class="w-full max-w-md">

        <RouterLink to="/" class="flex items-center gap-3 mb-10 group w-fit">
          <div class="w-9 h-9 bg-forest-700 rounded-xl flex items-center justify-center
                      group-hover:bg-forest-600 transition-colors">
            <span class="text-white font-bold text-xs">DM</span>
          </div>
          <span class="font-bold text-earth-900">DualMarket Brokerage</span>
        </RouterLink>

        <h1 class="text-3xl font-bold text-earth-900 mb-2">Create your account</h1>
        <p class="text-earth-500 mb-8">
          Already have an account?
          <RouterLink to="/login" class="text-forest-600 font-semibold hover:text-forest-700">
            Sign in
          </RouterLink>
        </p>

        <!-- Error -->
        <div v-if="error"
          class="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm">
          {{ error }}
        </div>

        <!-- Success -->
        <div v-if="success"
          class="mb-6 p-4 bg-forest-50 border-2 border-forest-200 rounded-xl text-forest-700 text-sm">
          <p class="font-semibold mb-1">Account created successfully!</p>
          <p>Check your email to confirm your account, then
            <RouterLink to="/login" class="underline font-semibold">sign in here</RouterLink>.
          </p>
        </div>

        <form v-if="!success" @submit.prevent="handleSignup" class="space-y-5">
          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-semibold mb-2 text-earth-800">Full Name *</label>
              <input
                v-model="form.fullName"
                type="text"
                placeholder="John Doe"
                class="input-field"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-earth-800">Company Name</label>
              <input
                v-model="form.companyName"
                type="text"
                placeholder="Your company"
                class="input-field"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2 text-earth-800">Email Address *</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="you@company.com"
              class="input-field"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2 text-earth-800">Country *</label>
            <input
              v-model="form.country"
              type="text"
              placeholder="e.g. Germany, United States"
              class="input-field"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2 text-earth-800">Password *</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="At least 8 characters"
                class="input-field pr-12"
                required
                minlength="8"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-earth-400
                       hover:text-earth-700 transition-colors"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2 text-earth-800">Confirm Password *</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Repeat your password"
              class="input-field"
              required
            />
            <p v-if="form.confirmPassword && form.password !== form.confirmPassword"
              class="text-red-500 text-xs mt-1">
              Passwords do not match
            </p>
          </div>

          <div class="flex items-start gap-3">
            <input
              v-model="form.agreed"
              type="checkbox"
              id="terms"
              class="mt-1 w-4 h-4 accent-forest-600 cursor-pointer"
              required
            />
            <label for="terms" class="text-sm text-earth-600 cursor-pointer leading-relaxed">
              I agree to the
              <a href="#" class="text-forest-600 font-semibold hover:underline">Terms of Service</a>
              and
              <a href="#" class="text-forest-600 font-semibold hover:underline">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading || form.password !== form.confirmPassword || !form.agreed"
            class="btn-primary w-full justify-center py-4
                   disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Right — farm image panel -->
    <div class="hidden lg:flex flex-1 relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=85&fit=crop"
        alt="Nigerian farm"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-forest-900/85 to-forest-800/60" />
      <div class="absolute inset-0 flex flex-col justify-end p-12">
        <div class="space-y-6">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10
                      border border-white/20 rounded-full">
            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span class="text-white text-sm font-medium">Join our buyer network</span>
          </div>
          <h2 class="text-4xl font-bold text-white leading-tight">
            Source quality Nigerian commodities with confidence
          </h2>
          <div class="space-y-3">
            <div v-for="point in benefits" :key="point" class="flex items-center gap-3">
              <svg class="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd" />
              </svg>
              <span class="text-forest-100 text-sm">{{ point }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const loading = ref(false)
const error   = ref('')
const success = ref(false)
const showPassword = ref(false)

const form = reactive({
  fullName: '',
  companyName: '',
  email: '',
  country: '',
  password: '',
  confirmPassword: '',
  agreed: false,
})

const handleSignup = async () => {
  if (form.password !== form.confirmPassword) return
  loading.value = true
  error.value   = ''
  try {
    await auth.signUp(form.email, form.password, form.fullName, form.companyName)
    success.value = true
  } catch (e: any) {
    error.value = e.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

const benefits = [
  'Submit quote requests and track their status',
  'Access verified Nigerian commodity suppliers',
  'Get pricing and availability within 24 hours',
  'Full logistics and documentation handled',
]
</script>