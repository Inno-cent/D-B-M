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

      <div class="border-2 border-earth-200 rounded-3xl p-8 bg-white shadow-sm">

        <!-- Icon -->
        <div class="w-14 h-14 bg-forest-50 border-2 border-forest-200 rounded-2xl
                    flex items-center justify-center mb-6">
          <svg class="w-7 h-7 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <Transition name="fade-slide" mode="out-in">

          <!-- Invalid / expired token state -->
          <div v-if="invalidToken" key="invalid" class="text-center py-4">
            <h2 class="text-2xl font-bold text-earth-900 mb-3">Link expired</h2>
            <p class="text-earth-500 text-sm leading-relaxed mb-6">
              This password reset link has expired or is invalid. Please request a new one.
            </p>
            <RouterLink to="/forgot-password" class="btn-primary w-full justify-center py-3">
              Request New Link
            </RouterLink>
          </div>

          <!-- Success state -->
          <div v-else-if="success" key="success" class="text-center py-4">
            <div class="w-16 h-16 bg-forest-50 border-2 border-forest-300 rounded-2xl
                        flex items-center justify-center mx-auto mb-5">
              <svg class="w-8 h-8 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-earth-900 mb-3">Password updated</h2>
            <p class="text-earth-500 text-sm leading-relaxed mb-6">
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
            <RouterLink to="/login" class="btn-primary w-full justify-center py-4">
              Sign In →
            </RouterLink>
          </div>

          <!-- Reset form -->
          <div v-else key="form">
            <h1 class="text-2xl font-bold text-earth-900 mb-2">Set new password</h1>
            <p class="text-earth-500 text-sm leading-relaxed mb-6">
              Choose a strong new password for your DualMarket account.
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

            <form @submit.prevent="handleReset" class="space-y-5">
              <div>
                <label class="block text-sm font-semibold mb-2 text-earth-800">
                  New Password
                </label>
                <div class="relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="At least 8 characters"
                    class="input-field pr-12"
                    required
                    minlength="8"
                  />
                  <button type="button" @click="showPassword = !showPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2
                           text-earth-400 hover:text-earth-700 transition-colors">
                    <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>

                <!-- Strength bar -->
                <div v-if="password" class="mt-2 flex gap-1">
                  <div v-for="i in 4" :key="i"
                    :class="['h-1 flex-1 rounded-full transition-all duration-300',
                      strength >= i ? strengthColor : 'bg-earth-200']" />
                </div>
                <p v-if="password" class="text-xs mt-1" :class="strengthTextColor">
                  {{ strengthLabel }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-semibold mb-2 text-earth-800">
                  Confirm New Password
                </label>
                <input
                  v-model="confirmPassword"
                  type="password"
                  placeholder="Repeat your new password"
                  class="input-field"
                  :class="confirmPassword && password !== confirmPassword
                    ? 'border-red-300 focus:border-red-400' : ''"
                  required
                />
                <p v-if="confirmPassword && password !== confirmPassword"
                  class="text-red-500 text-xs mt-1">
                  Passwords do not match
                </p>
              </div>

              <button
                type="submit"
                :disabled="loading || !password || password !== confirmPassword || strength < 2"
                class="btn-primary w-full justify-center py-4
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg v-if="loading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {{ loading ? 'Updating password...' : 'Update Password' }}
              </button>
            </form>
          </div>

        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'

const auth    = useAuthStore()
const route   = useRoute()

const password        = ref('')
const confirmPassword = ref('')
const loading         = ref(false)
const error           = ref('')
const success         = ref(false)
const invalidToken    = ref(false)
const showPassword    = ref(false)

// Supabase puts the tokens in the URL hash on redirect
// We need to let Supabase handle the session from the URL
onMounted(async () => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  const errorCode  = hashParams.get('error_code')
  const errorDesc  = hashParams.get('error_description')

  if (errorCode || errorDesc) {
    invalidToken.value = true
  }
})

// Password strength
const strength = computed(() => {
  const p = password.value
  if (!p) return 0
  let s = 0
  if (p.length >= 8)            s++
  if (/[A-Z]/.test(p))         s++
  if (/[0-9]/.test(p))         s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
})

const strengthColor = computed(() => [
  '', 'bg-red-400', 'bg-amber-400', 'bg-yellow-400', 'bg-forest-500'
][strength.value])

const strengthTextColor = computed(() => [
  '', 'text-red-500', 'text-amber-600', 'text-yellow-600', 'text-forest-600'
][strength.value])

const strengthLabel = computed(() => [
  '',
  'Weak — add uppercase, numbers or symbols',
  'Fair — getting better',
  'Good password',
  'Strong password ✓',
][strength.value])

const handleReset = async () => {
  if (password.value !== confirmPassword.value) return
  loading.value = true
  error.value   = ''
  try {
    await auth.resetPassword(password.value)
    success.value = true
  } catch (e: any) {
    error.value = e.message?.includes('expired')
      ? 'This reset link has expired. Please request a new one.'
      : e.message || 'Something went wrong. Please try again.'
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