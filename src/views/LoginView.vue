<template>
  <div class="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
    <!-- Subtle background texture -->
    <div
      class="fixed inset-0 pointer-events-none"
      style="
        background-image: radial-gradient(
            circle at 20% 50%,
            rgba(30, 107, 35, 0.04) 0%,
            transparent 60%
          ),
          radial-gradient(circle at 80% 20%, rgba(30, 107, 35, 0.03) 0%, transparent 50%);
      "
    />

    <div class="w-full max-w-sm relative">
      <!-- Heading -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-earth-900 mb-2 tracking-tight">Sign in</h1>
        <p class="text-earth-500 text-sm">
          No account?
          <RouterLink
            to="/signup"
            class="text-forest-600 font-semibold hover:text-forest-700 transition-colors underline-offset-2 hover:underline"
          >
            Create one for free
          </RouterLink>
        </p>
      </div>

      <!-- Error -->
      <Transition name="slide-down">
        <div
          v-if="error"
          class="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2.5"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          {{ error }}
        </div>
      </Transition>

      <!-- Form card -->
      <div
        class="bg-white border border-earth-200 rounded-2xl p-7 shadow-sm shadow-earth-900/5"
      >
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label
              class="block text-xs font-semibold mb-1.5 text-earth-600 uppercase tracking-wider"
            >
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="you@company.com"
              class="w-full px-4 py-3 rounded-xl border border-earth-200 bg-cream text-earth-900 text-sm outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all duration-200 placeholder:text-earth-300"
              required
              autocomplete="email"
            />
          </div>

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label
                class="text-xs font-semibold text-earth-600 uppercase tracking-wider"
              >
                Password
              </label>
              <RouterLink
                to="/forgot-password"
                class="text-xs text-forest-600 hover:text-forest-700 transition-colors font-medium"
              >
                Forgot?
              </RouterLink>
            </div>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-xl border border-earth-200 bg-cream text-earth-900 text-sm outline-none pr-11 focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all duration-200 placeholder:text-earth-300"
                required
                autocomplete="current-password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-earth-300 hover:text-earth-600 transition-colors"
              >
                <svg
                  v-if="!showPassword"
                  class="w-4.5 h-4.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-4.5 h-4.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember me -->
          <label class="flex items-center gap-2.5 cursor-pointer group">
            <div class="relative">
              <input v-model="form.remember" type="checkbox" class="sr-only peer" />
              <div
                class="w-4 h-4 rounded border border-earth-300 bg-cream peer-checked:bg-forest-600 peer-checked:border-forest-600 transition-all duration-200 flex items-center justify-center"
              >
                <svg
                  v-if="form.remember"
                  class="w-2.5 h-2.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <span
              class="text-sm text-earth-500 group-hover:text-earth-700 transition-colors select-none"
            >
              Keep me signed in
            </span>
          </label>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading || !form.email || !form.password"
            class="w-full py-3 rounded-xl bg-forest-700 text-white text-sm font-semibold tracking-wide hover:bg-forest-600 active:bg-forest-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-forest-900/20 mt-2"
          >
            <svg
              v-if="loading"
              class="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            {{ loading ? "Signing in..." : "Sign In" }}
          </button>
        </form>
      </div>

      <!-- Footer note -->
      <p class="text-center text-xs text-earth-400 mt-6 leading-relaxed">
        By signing in you agree to our
        <a
          href="#"
          class="hover:text-earth-600 transition-colors underline underline-offset-2"
          >Terms</a
        >
        and
        <a
          href="#"
          class="hover:text-earth-600 transition-colors underline underline-offset-2"
          >Privacy Policy</a
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const error = ref("");
const showPassword = ref(false);

const form = reactive({
  email: "",
  password: "",
  remember: false,
});

const handleLogin = async () => {
  loading.value = true;
  error.value = "";
  try {
    await auth.signIn(form.email, form.password);
    const redirect = route.query.redirect as string;
    router.push(redirect || "/dashboard");
  } catch (e: any) {
    error.value = e.message?.includes("Invalid login credentials")
      ? "Incorrect email or password. Please try again."
      : e.message || "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease, max-height 0.25s ease;
  max-height: 80px;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
  max-height: 0;
}
</style>
