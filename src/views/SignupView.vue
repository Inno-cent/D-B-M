<template>
  <div class="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
    <!-- Subtle background -->
    <div
      class="fixed inset-0 pointer-events-none"
      style="
        background-image: radial-gradient(
            circle at 80% 50%,
            rgba(30, 107, 35, 0.04) 0%,
            transparent 60%
          ),
          radial-gradient(circle at 20% 80%, rgba(30, 107, 35, 0.03) 0%, transparent 50%);
      "
    />

    <div class="w-full max-w-sm relative">
      <!-- Heading -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-earth-900 mb-2 tracking-tight">
          Create your account
        </h1>
        <p class="text-earth-500 text-sm">
          Already have one?
          <RouterLink
            to="/login"
            class="text-forest-600 font-semibold hover:text-forest-700 transition-colors underline-offset-2 hover:underline"
          >
            Sign in
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

      <!-- Success -->
      <Transition name="slide-down">
        <div
          v-if="success"
          class="mb-5 p-4 bg-forest-50 border border-forest-200 rounded-xl"
        >
          <div class="flex items-center gap-3 mb-1.5">
            <div
              class="w-6 h-6 bg-forest-600 rounded-lg flex items-center justify-center flex-shrink-0"
            >
              <svg
                class="w-3.5 h-3.5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p class="font-semibold text-forest-800 text-sm">Account created!</p>
          </div>
          <p class="text-forest-700 text-xs ml-9 leading-relaxed">
            <RouterLink to="/login" class="underline font-semibold hover:text-forest-900">
              Sign in here
            </RouterLink>
            to access your dashboard.
          </p>
        </div>
      </Transition>

      <!-- Form card -->
      <div
        v-if="!success"
        class="bg-white border border-earth-200 rounded-2xl p-7 shadow-sm shadow-earth-900/5"
      >
        <form @submit.prevent="handleSignup" class="space-y-4">
          <!-- Full name + Company -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label
                class="block text-xs font-semibold mb-1.5 text-earth-600 uppercase tracking-wider"
              >
                Full Name <span class="text-red-400 normal-case">*</span>
              </label>
              <input
                v-model="form.fullName"
                type="text"
                placeholder="Jane Smith"
                class="w-full px-3.5 py-3 rounded-xl border border-earth-200 bg-cream text-earth-900 text-sm outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all duration-200 placeholder:text-earth-300"
                required
              />
            </div>
            <div>
              <label
                class="block text-xs font-semibold mb-1.5 text-earth-600 uppercase tracking-wider"
              >
                Company
              </label>
              <input
                v-model="form.companyName"
                type="text"
                placeholder="Optional"
                class="w-full px-3.5 py-3 rounded-xl border border-earth-200 bg-cream text-earth-900 text-sm outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all duration-200 placeholder:text-earth-300"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label
              class="block text-xs font-semibold mb-1.5 text-earth-600 uppercase tracking-wider"
            >
              Email <span class="text-red-400 normal-case">*</span>
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

          <!-- Country -->
          <div>
            <label
              class="block text-xs font-semibold mb-1.5 text-earth-600 uppercase tracking-wider"
            >
              Country <span class="text-red-400 normal-case">*</span>
            </label>
            <input
              v-model="form.country"
              type="text"
              placeholder="e.g. Germany, United States"
              class="w-full px-4 py-3 rounded-xl border border-earth-200 bg-cream text-earth-900 text-sm outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all duration-200 placeholder:text-earth-300"
              required
            />
          </div>

          <!-- Password -->
          <div>
            <label
              class="block text-xs font-semibold mb-1.5 text-earth-600 uppercase tracking-wider"
            >
              Password <span class="text-red-400 normal-case">*</span>
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Min. 8 characters"
                class="w-full px-4 py-3 rounded-xl border border-earth-200 bg-cream text-earth-900 text-sm outline-none pr-11 focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all duration-200 placeholder:text-earth-300"
                required
                minlength="8"
                autocomplete="new-password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-earth-300 hover:text-earth-600 transition-colors"
              >
                <svg
                  v-if="!showPassword"
                  class="w-4 h-4"
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
                  class="w-4 h-4"
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

            <!-- Strength bar -->
            <div v-if="form.password" class="mt-2 flex gap-1">
              <div
                v-for="i in 4"
                :key="i"
                :class="[
                  'h-0.5 flex-1 rounded-full transition-all duration-300',
                  strength >= i ? strengthColor : 'bg-earth-200',
                ]"
              />
            </div>
            <p v-if="form.password" class="text-xs mt-1" :class="strengthTextColor">
              {{ strengthLabel }}
            </p>
          </div>

          <!-- Confirm password -->
          <div>
            <label
              class="block text-xs font-semibold mb-1.5 text-earth-600 uppercase tracking-wider"
            >
              Confirm Password <span class="text-red-400 normal-case">*</span>
            </label>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Repeat password"
              :class="[
                'w-full px-4 py-3 rounded-xl border bg-cream text-earth-900',
                'text-sm outline-none transition-all duration-200 placeholder:text-earth-300',
                'focus:ring-2',
                form.confirmPassword && form.password !== form.confirmPassword
                  ? 'border-red-300 focus:border-red-300 focus:ring-red-100'
                  : 'border-earth-200 focus:border-forest-400 focus:ring-forest-100',
              ]"
              required
              autocomplete="new-password"
            />
            <p
              v-if="form.confirmPassword && form.password !== form.confirmPassword"
              class="text-red-500 text-xs mt-1"
            >
              Passwords do not match
            </p>
          </div>

          <!-- Terms -->
          <label class="flex items-start gap-2.5 cursor-pointer group">
            <div class="relative mt-0.5 flex-shrink-0">
              <input v-model="form.agreed" type="checkbox" class="sr-only peer" />
              <div
                class="w-4 h-4 rounded border border-earth-300 bg-cream peer-checked:bg-forest-600 peer-checked:border-forest-600 transition-all duration-200 flex items-center justify-center"
              >
                <svg
                  v-if="form.agreed"
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
              class="text-xs text-earth-500 leading-relaxed group-hover:text-earth-700 transition-colors select-none"
            >
              I agree to the
              <a href="#" class="text-forest-600 font-semibold hover:underline">Terms</a>
              and
              <a href="#" class="text-forest-600 font-semibold hover:underline"
                >Privacy Policy</a
              >
            </span>
          </label>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading || !canSubmit"
            class="w-full py-3 rounded-xl bg-forest-700 text-white text-sm font-semibold tracking-wide mt-2 hover:bg-forest-600 active:bg-forest-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-forest-900/20"
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
            {{ loading ? "Creating account..." : "Create Account" }}
          </button>
        </form>
      </div>

      <!-- Footer -->
      <p class="text-center text-xs text-earth-400 mt-6">
        Already have an account?
        <RouterLink
          to="/login"
          class="text-forest-600 font-semibold hover:text-forest-700 transition-colors"
        >
          Sign in →
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const loading = ref(false);
const error = ref("");
const success = ref(false);
const showPassword = ref(false);

const form = reactive({
  fullName: "",
  companyName: "",
  email: "",
  country: "",
  phone: "",
  password: "",
  confirmPassword: "",
  agreed: false,
});

const strength = computed(() => {
  const p = form.password;
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
});

const strengthColor = computed(
  () =>
    ["", "bg-red-400", "bg-amber-400", "bg-yellow-400", "bg-forest-500"][strength.value]
);

const strengthTextColor = computed(
  () =>
    ["", "text-red-500", "text-amber-500", "text-yellow-600", "text-forest-600"][
      strength.value
    ]
);

const strengthLabel = computed(
  () =>
    [
      "",
      "Weak — add uppercase, numbers or symbols",
      "Fair — getting better",
      "Good password",
      "Strong ✓",
    ][strength.value]
);

const canSubmit = computed(
  () =>
    form.fullName &&
    form.email &&
    form.country &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword &&
    form.agreed
);

const handleSignup = async () => {
  if (!canSubmit.value) return;
  loading.value = true;
  error.value = "";
  try {
    await auth.signUp(
      form.email,
      form.password,
      form.fullName,
      form.companyName,
      form.country,
      form.phone
    );
    success.value = true;
  } catch (e: any) {
    error.value = e.message?.includes("already registered")
      ? "An account with this email already exists. Please sign in."
      : e.message || "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease, max-height 0.3s ease;
  max-height: 100px;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
  max-height: 0;
}
</style>
