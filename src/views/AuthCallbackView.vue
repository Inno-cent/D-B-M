<template>
  <div class="min-h-screen bg-cream flex items-center justify-center px-6">
    <div class="text-center max-w-sm w-full">

      <!-- Loading -->
      <div v-if="processing">
        <div class="w-12 h-12 border-4 border-earth-200 border-t-forest-600
                    rounded-full animate-spin mx-auto mb-4" />
        <p class="text-earth-500 text-sm">Verifying your account...</p>
      </div>

      <!-- Error -->
      <div v-else-if="errorMsg"
        class="border-2 border-red-200 rounded-2xl p-8 bg-white shadow-sm">
        <div class="w-14 h-14 bg-red-50 border-2 border-red-200 rounded-2xl
                    flex items-center justify-center mx-auto mb-5">
          <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-earth-900 mb-2">Verification failed</h2>
        <p class="text-earth-500 text-sm mb-6">{{ errorMsg }}</p>
        <RouterLink to="/login" class="btn-primary w-full justify-center py-3">
          Go to Sign In
        </RouterLink>
      </div>

      <!-- Success -->
      <div v-else
        class="border-2 border-forest-200 rounded-2xl p-8 bg-white shadow-sm">
        <div class="w-14 h-14 bg-forest-50 border-2 border-forest-200 rounded-2xl
                    flex items-center justify-center mx-auto mb-5">
          <svg class="w-7 h-7 text-forest-600" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-earth-900 mb-2">Email verified!</h2>
        <p class="text-earth-500 text-sm mb-6">
          Your account has been confirmed. Redirecting you to your dashboard...
        </p>
        <RouterLink to="/dashboard" class="btn-primary w-full justify-center py-3">
          Go to Dashboard →
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
const errorMsg   = ref('')

onMounted(async () => {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) throw error

    if (data.session) {
      processing.value = false
      // Auto-redirect after 2 seconds
      setTimeout(() => router.push('/dashboard'), 2000)
    } else {
      throw new Error('No session found. The verification link may have expired.')
    }
  } catch (e: any) {
    errorMsg.value   = e.message || 'Verification failed. Please try again.'
    processing.value = false
  }
})
</script>