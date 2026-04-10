<template>
  <div class="min-h-screen bg-cream flex items-center justify-center px-6">
    <div class="text-center max-w-sm">
      <div v-if="processing">
        <div class="w-12 h-12 border-4 border-earth-200 border-t-forest-600
                    rounded-full animate-spin mx-auto mb-4" />
        <p class="text-earth-500 text-sm">Verifying your account...</p>
      </div>

      <div v-else-if="error" class="border-2 border-red-200 rounded-2xl p-8 bg-white">
        <div class="w-14 h-14 bg-red-50 border-2 border-red-200 rounded-2xl
                    flex items-center justify-center mx-auto mb-5">
          <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-earth-900 mb-2">Verification failed</h2>
        <p class="text-earth-500 text-sm mb-6">{{ error }}</p>
        <RouterLink to="/login" class="btn-primary w-full justify-center py-3">
          Go to Sign In
        </RouterLink>
      </div>

      <div v-else class="border-2 border-forest-200 rounded-2xl p-8 bg-white">
        <div class="w-14 h-14 bg-forest-50 border-2 border-forest-200 rounded-2xl
                    flex items-center justify-center mx-auto mb-5">
          <svg class="w-7 h-7 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-earth-900 mb-2">Account verified!</h2>
        <p class="text-earth-500 text-sm mb-6">
          Your email has been confirmed. Redirecting you to your dashboard...
        </p>
        <RouterLink to="/dashboard" class="btn-primary w-full justify-center py-3">
          Go to Dashboard
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router     = useRouter()
const processing = ref(true)
const error      = ref('')

onMounted(async () => {
  try {
    const { data, error: err } = await supabase.auth.getSession()

    if (err) throw err

    if (data.session) {
      // Successfully authenticated — redirect to dashboard after a moment
      processing.value = false
      setTimeout(() => router.push('/dashboard'), 2000)
    } else {
      throw new Error('No session found. The link may have expired.')
    }
  } catch (e: any) {
    error.value      = e.message || 'Verification failed.'
    processing.value = false
  }
})
</script>