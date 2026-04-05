<template>
  <div class="min-h-screen bg-cream flex">
    <!-- Left — form panel -->
    <div class="flex-1 flex items-center justify-center px-6 py-20 overflow-y-auto">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-3 mb-10 group w-fit">
          <div
            class="w-9 h-9 bg-forest-700 rounded-xl flex items-center justify-center group-hover:bg-forest-600 transition-colors shadow-lg"
          >
            <span class="text-white font-bold text-xs">DM</span>
          </div>
          <div>
            <span class="font-bold text-earth-900 block leading-none text-base"
              >DualMarket</span
            >
            <span class="text-earth-500 text-xs">Brokerage</span>
          </div>
        </RouterLink>

        <h1 class="text-3xl font-bold text-earth-900 mb-2">Create your account</h1>
        <p class="text-earth-500 mb-8 text-sm">
          Already have an account?
          <RouterLink
            to="/login"
            class="text-forest-600 font-semibold hover:text-forest-700 transition-colors"
          >
            Sign in here
          </RouterLink>
        </p>

        <!-- Error message -->
        <Transition name="fade-slide">
          <div
            v-if="error"
            class="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3"
          >
            <svg
              class="w-5 h-5 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            {{ error }}
          </div>
        </Transition>

        <!-- Success message -->
        <Transition name="fade-slide">
          <div
            v-if="success"
            class="mb-6 p-5 bg-forest-50 border-2 border-forest-200 rounded-xl text-forest-800"
          >
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <svg
                  class="w-4 h-4 text-white"
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
              <p class="font-bold">Account created successfully!</p>
            </div>
            <p class="text-sm text-forest-700 ml-11">
              <RouterLink
                to="/login"
                class="underline font-semibold hover:text-forest-900"
              >
                Click here to sign in
              </RouterLink>
              with your new account.
            </p>
          </div>
        </Transition>

        <!-- Form -->
        <form v-if="!success" @submit.prevent="handleSignup" class="space-y-5">
          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-semibold mb-2 text-earth-800">
                Full Name <span class="text-red-400">*</span>
              </label>
              <input
                v-model="form.fullName"
                type="text"
                placeholder="Jane Smith"
                class="input-field"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-earth-800"
                >Company Name</label
              >
              <input
                v-model="form.companyName"
                type="text"
                placeholder="Your company"
                class="input-field"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2 text-earth-800">
              Email Address <span class="text-red-400">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="you@company.com"
              class="input-field"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2 text-earth-800">
              Country <span class="text-red-400">*</span>
            </label>
            <input
              v-model="form.country"
              type="text"
              placeholder="e.g. Germany, United States, China"
              class="input-field"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2 text-earth-800">
              Password <span class="text-red-400">*</span>
            </label>
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
                class="absolute right-4 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-700 transition-colors"
              >
                <svg
                  v-if="!showPassword"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5"
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

            <!-- Password strength -->
            <div v-if="form.password" class="mt-2 flex gap-1">
              <div
                v-for="i in 4"
                :key="i"
                :class="[
                  'h-1 flex-1 rounded-full transition-all duration-300',
                  passwordStrength >= i ? strengthColor : 'bg-earth-200',
                ]"
              />
            </div>
            <p v-if="form.password" class="text-xs mt-1" :class="strengthTextColor">
              {{ strengthLabel }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2 text-earth-800">
              Confirm Password <span class="text-red-400">*</span>
            </label>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Repeat your password"
              class="input-field"
              :class="
                form.confirmPassword && form.password !== form.confirmPassword
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : ''
              "
              required
            />
            <p
              v-if="form.confirmPassword && form.password !== form.confirmPassword"
              class="text-red-500 text-xs mt-1"
            >
              Passwords do not match
            </p>
          </div>

          <div class="flex items-start gap-3">
            <input
              v-model="form.agreed"
              type="checkbox"
              id="terms"
              class="mt-0.5 w-4 h-4 accent-forest-600 cursor-pointer rounded"
            />
            <label
              for="terms"
              class="text-sm text-earth-600 cursor-pointer leading-relaxed"
            >
              I agree to the
              <a href="#" class="text-forest-600 font-semibold hover:underline"
                >Terms of Service</a
              >
              and
              <a href="#" class="text-forest-600 font-semibold hover:underline"
                >Privacy Policy</a
              >
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading || !canSubmit"
            class="btn-primary w-full justify-center py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <svg
              v-if="loading"
              class="animate-spin w-5 h-5"
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
            {{ loading ? "Creating account..." : "Create Account →" }}
          </button>
        </form>
      </div>
    </div>

    <!-- Right — farm image panel -->
    <div class="hidden lg:flex flex-1 relative overflow-hidden max-w-xl">
      <img
        src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=90&fit=crop&crop=center"
        alt="Nigerian farm"
        class="w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-br from-forest-900/82 to-forest-800/55"
      />
      <div class="absolute inset-0 flex flex-col justify-end p-12">
        <div class="space-y-6">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full"
          >
            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span class="text-white text-sm font-medium">Join our buyer network</span>
          </div>
          <h2 class="text-3xl font-bold text-white leading-tight">
            Source quality Nigerian commodities with confidence
          </h2>
          <div class="space-y-3">
            <div v-for="point in benefits" :key="point" class="flex items-center gap-3">
              <div
                class="w-5 h-5 bg-green-500/20 border border-green-400/40 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <svg
                  class="w-3 h-3 text-green-400"
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
              <span class="text-forest-100 text-sm">{{ point }}</span>
            </div>
          </div>

          <!-- Trust badge -->
          <div class="border-t border-white/10 pt-6 flex items-center gap-4">
            <div class="flex -space-x-2">
              <div
                v-for="(color, i) in avatarColors"
                :key="i"
                :class="`w-8 h-8 rounded-full border-2 border-forest-800 flex items-center
                         justify-center text-xs font-bold text-white ${color}`"
              >
                {{ avatarInitials[i] }}
              </div>
            </div>
            <p class="text-forest-200 text-xs">
              <span class="text-white font-semibold">500+ buyers</span> trust DualMarket
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();
const loading = ref(false);
const error = ref("");
const success = ref(false);
const showPassword = ref(false);

const form = reactive({
  fullName: "",
  companyName: "",
  email: "",
  country: "",
  password: "",
  confirmPassword: "",
  agreed: false,
});

// Password strength
const passwordStrength = computed(() => {
  const p = form.password;
  if (!p) return 0;
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  return score;
});

const strengthColor = computed(
  () =>
    ({
      1: "bg-red-400",
      2: "bg-amber-400",
      3: "bg-yellow-400",
      4: "bg-forest-500",
    }[passwordStrength.value] || "bg-earth-200")
);

const strengthTextColor = computed(
  () =>
    ({
      1: "text-red-500",
      2: "text-amber-600",
      3: "text-yellow-600",
      4: "text-forest-600",
    }[passwordStrength.value] || "")
);

const strengthLabel = computed(
  () =>
    ({
      1: "Weak — add uppercase letters, numbers, or symbols",
      2: "Fair — getting better",
      3: "Good password",
      4: "Strong password ✓",
    }[passwordStrength.value] || "")
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

  // Simulate a brief loading state
  await new Promise((r) => setTimeout(r, 800));

  try {
    auth.signUp({
      id: crypto.randomUUID(),
      fullName: form.fullName,
      companyName: form.companyName,
      email: form.email,
      country: form.country,
    });
    success.value = true;
  } catch (e: any) {
    error.value = "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
};

const benefits = [
  "Submit quote requests and track their status",
  "Access verified Nigerian commodity suppliers",
  "Get pricing and availability within 24 hours",
  "Full logistics and documentation handled for you",
];

const avatarColors = ["bg-forest-600", "bg-harvest", "bg-earth-500", "bg-forest-400"];
const avatarInitials = ["AK", "LM", "JW", "PN"];
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
