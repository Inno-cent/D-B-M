<template>
  <div class="min-h-screen bg-cream flex items-center justify-center px-6 py-20">
    <div class="w-full max-w-md">

      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-3 mb-10 group w-fit">
        <div class="w-9 h-9 bg-forest-700 rounded-xl flex items-center justify-center
                    group-hover:bg-forest-600 transition-colors shadow-lg">
          <span class="text-white font-bold text-xs">DM</span>
        </div>
        <div>
          <span class="font-bold text-earth-900 block leading-none">DualMarket</span>
          <span class="text-earth-500 text-xs">Brokerage</span>
        </div>
      </RouterLink>

      <!-- Back link -->
      <RouterLink to="/login"
        class="inline-flex items-center gap-2 text-sm text-earth-500
               hover:text-forest-600 transition-colors mb-8">
        ← Back to Sign In
      </RouterLink>

      <div class="border-2 border-earth-200 rounded-3xl p-8 bg-white shadow-sm">

        <!-- Icon -->
        <div class="w-14 h-14 bg-forest-50 border-2 border-forest-200 rounded-2xl
                    flex items-center justify-center mb-6">
          <svg class="w-7 h-7 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>

        <Transition name="fade-slide" mode="out-in">

          <!-- Form state -->
          <div v-if="!sent" key="form">
            <h1 class="text-2xl font-bold text-earth-900 mb-2">Forgot your password?</h1>
            <p class="text-earth-500 text-sm leading-relaxed mb-6">
              Enter the email address linked to your account and we will send you a link to reset your password.
            </p>

            <!-- Error -->
            <div v-if="error"
              class="mb-5 p-4 bg-red-50 border-2 border-red-200 rounded-xl
                     text-red-700 text-sm flex items-start gap-3">
              <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd" />
              </svg>
              {{ error }}
            </div>

            <form @submit.prevent="handleForgot" class="space-y-4">
              <div>
                <label class="block text-sm font-semibold mb-2 text-earth-800">
                  Email Address
                </label>
                <input
                  v-model="email"
                  type="email"
                  placeholder="you@company.com"
                  class="input-field"
                  required
                  autocomplete="email"
                />
              </div>
              <button
                type="submit"
                :disabled="loading || !email"
                class="btn-primary w-full justify-center py-4
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg v-if="loading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {{ loading ? 'Sending...' : 'Send Reset Link' }}
              </button>
            </form>
          </div>

          <!-- Success state -->
          <div v-else key="success" class="text-center py-4">
            <div class="w-16 h-16 bg-forest-50 border-2 border-forest-300 rounded-2xl
                        flex items-center justify-center mx-auto mb-5">
              <svg class="w-8 h-8 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-earth-900 mb-3">Check your email</h2>
            <p class="text-earth-600 text-sm leading-relaxed mb-2">
              We sent a password reset link to
            </p>
            <p class="font-semibold text-earth-900 mb-5">{{ email }}</p>
            <p class="text-earth-500 text-xs leading-relaxed mb-6">
              Didn't receive it? Check your spam folder or
              <button
                @click="sent = false; error = ''"
                class="text-forest-600 font-semibold hover:text-forest-700 transition-colors"
              >
                try again
              </button>
            </p>
            <RouterLink to="/login" class="btn-outline w-full justify-center py-3">
              Back to Sign In
            </RouterLink>
          </div>

        </Transition>
      </div>

      <p class="text-center text-xs text-earth-400 mt-6">
        Remember your password?
        <RouterLink to="/login" class="text-forest-600 font-semibold hover:text-forest-700">
          Sign in
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth    = useAuthStore()
const email   = ref('')
const loading = ref(false)
const error   = ref('')
const sent    = ref(false)

const handleForgot = async () => {
  loading.value = true
  error.value   = ''
  try {
    await auth.forgotPassword(email.value)
    sent.value = true
  } catch (e: any) {
    error.value = e.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to   { opacity: 0; transform: translateY(-10px); }
</style>