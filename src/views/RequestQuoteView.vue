<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="page-hero">
      <div class="max-w-7xl mx-auto">
        <span class="section-label">Get Started</span>
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-earth-900">
          Request a Quote
        </h1>
        <p class="text-earth-600 text-lg max-w-xl">
          Fill in the form and we will respond within 24 hours with pricing and
          availability.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <div class="grid lg:grid-cols-5 gap-16">
        <!-- Form -->
        <div class="lg:col-span-3" data-reveal>
          <Transition name="fade-slide" mode="out-in">
            <!-- Form state -->
            <div v-if="!submitted" key="form" class="space-y-5">
              <!-- Error banner -->
              <Transition name="fade-slide">
                <div
                  v-if="submitError"
                  class="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3"
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
                  <div>
                    <p class="font-semibold mb-0.5">Submission failed</p>
                    <p>{{ submitError }}</p>
                  </div>
                </div>
              </Transition>

              <!-- Name + Company -->
              <div class="grid sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold mb-2 text-earth-800">
                    Full Name *
                  </label>
                  <input
                    v-model="form.fullName"
                    type="text"
                    placeholder="Your full name"
                    class="input-field"
                    :class="{ 'border-red-300': touched.fullName && !form.fullName }"
                    @blur="touched.fullName = true"
                  />
                  <p
                    v-if="touched.fullName && !form.fullName"
                    class="text-red-500 text-xs mt-1"
                  >
                    Full name is required
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2 text-earth-800">
                    Company Name *
                  </label>
                  <input
                    v-model="form.company"
                    type="text"
                    placeholder="Your company name"
                    class="input-field"
                    :class="{ 'border-red-300': touched.company && !form.company }"
                    @blur="touched.company = true"
                  />
                  <p
                    v-if="touched.company && !form.company"
                    class="text-red-500 text-xs mt-1"
                  >
                    Company name is required
                  </p>
                </div>
              </div>

              <!-- Email + Phone -->
              <div class="grid sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold mb-2 text-earth-800">
                    Email Address *
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="you@company.com"
                    class="input-field"
                    :class="{ 'border-red-300': touched.email && !form.email }"
                    @blur="touched.email = true"
                  />
                  <p
                    v-if="touched.email && !form.email"
                    class="text-red-500 text-xs mt-1"
                  >
                    Email is required
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2 text-earth-800">
                    Phone / WhatsApp
                  </label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    class="input-field"
                  />
                </div>
              </div>

              <!-- Product -->
              <div>
                <label class="block text-sm font-semibold mb-2 text-earth-800">
                  Product Required *
                </label>
                <select
                  v-model="form.product"
                  class="input-field"
                  :class="{ 'border-red-300': touched.product && !form.product }"
                  @blur="touched.product = true"
                >
                  <option value="">Select a product...</option>
                  <optgroup label="Export Commodities">
                    <option v-for="p in exportProducts" :key="p">{{ p }}</option>
                  </optgroup>
                  <optgroup label="Local Wholesale">
                    <option v-for="p in localProducts" :key="p">{{ p }}</option>
                  </optgroup>
                  <option value="Other">Other (specify in notes)</option>
                </select>
                <p
                  v-if="touched.product && !form.product"
                  class="text-red-500 text-xs mt-1"
                >
                  Please select a product
                </p>
              </div>

              <!-- Quantity + Country -->
              <div class="grid sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold mb-2 text-earth-800">
                    Quantity Needed *
                  </label>
                  <input
                    v-model="form.quantity"
                    type="text"
                    placeholder="e.g. 25 MT"
                    class="input-field"
                    :class="{ 'border-red-300': touched.quantity && !form.quantity }"
                    @blur="touched.quantity = true"
                  />
                  <p
                    v-if="touched.quantity && !form.quantity"
                    class="text-red-500 text-xs mt-1"
                  >
                    Quantity is required
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2 text-earth-800">
                    Buyer Country *
                  </label>
                  <input
                    v-model="form.country"
                    type="text"
                    placeholder="e.g. Germany"
                    class="input-field"
                    :class="{ 'border-red-300': touched.country && !form.country }"
                    @blur="touched.country = true"
                  />
                  <p
                    v-if="touched.country && !form.country"
                    class="text-red-500 text-xs mt-1"
                  >
                    Country is required
                  </p>
                </div>
              </div>

              <!-- Destination -->
              <div>
                <label class="block text-sm font-semibold mb-2 text-earth-800">
                  Delivery Destination
                </label>
                <input
                  v-model="form.destination"
                  type="text"
                  placeholder="Port, city, or address"
                  class="input-field"
                />
              </div>

              <!-- Ship date -->
              <div>
                <label class="block text-sm font-semibold mb-2 text-earth-800">
                  Intended Shipment Date
                </label>
                <input
                  v-model="form.shipDate"
                  type="date"
                  class="input-field"
                  :min="minDate"
                />
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-sm font-semibold mb-2 text-earth-800">
                  Additional Notes
                </label>
                <textarea
                  v-model="form.notes"
                  rows="4"
                  placeholder="Grade preference, packaging type, certifications needed..."
                  class="input-field resize-none"
                />
              </div>

              <!-- Submit -->
              <button
                @click="handleSubmit"
                :disabled="loading || !canSubmit"
                class="btn-primary w-full justify-center py-4 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                <span v-if="loading">Submitting your request...</span>
                <span v-else>Submit Quote Request →</span>
              </button>

              <p class="text-xs text-earth-400 text-center">
                We respond within 24 hours. No spam, ever.
              </p>
            </div>

            <!-- Success state -->
            <div v-else key="success" class="text-center py-16">
              <div
                class="w-20 h-20 border-2 border-forest-500 rounded-3xl flex items-center justify-center mx-auto mb-6 bg-forest-50"
              >
                <svg
                  class="w-10 h-10 text-forest-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 class="text-3xl font-bold mb-3 text-earth-900">Request Received</h2>
              <p class="text-earth-600 text-lg mb-2">
                We will be in touch within 24 hours.
              </p>
              <p class="text-sm text-earth-400 mb-3">
                Check your inbox at <strong>{{ form.email }}</strong>
              </p>
              <p v-if="submittedRef" class="text-xs text-earth-400 font-mono mb-10">
                Reference: {{ submittedRef }}
              </p>
              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <button @click="reset" class="btn-outline">Submit another request</button>
                <RouterLink v-if="auth.isLoggedIn" to="/dashboard" class="btn-primary">
                  View in Dashboard →
                </RouterLink>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-2" data-reveal data-reveal-delay="2">
          <div class="border-2 border-earth-200 rounded-2xl p-8 bg-white sticky top-24">
            <h3 class="font-bold text-lg mb-6 text-earth-900">What happens next?</h3>
            <div class="space-y-6 mb-8">
              <div v-for="(step, i) in nextSteps" :key="step.title" class="flex gap-4">
                <div
                  class="w-8 h-8 min-w-[32px] border-2 border-earth-300 rounded-xl flex items-center justify-center text-xs font-bold text-earth-800 bg-parchment"
                >
                  {{ i + 1 }}
                </div>
                <div>
                  <p class="text-sm font-semibold mb-0.5 text-earth-900">
                    {{ step.title }}
                  </p>
                  <p class="text-xs text-earth-500 leading-relaxed">
                    {{ step.desc }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Login prompt for guests -->
            <div
              v-if="!auth.isLoggedIn"
              class="border-2 border-forest-200 rounded-xl p-4 bg-forest-50 mb-6"
            >
              <p class="text-sm font-semibold text-forest-800 mb-1">Track your request</p>
              <p class="text-xs text-forest-700 leading-relaxed mb-3">
                Sign in or create a free account to track the status of this and future
                requests in your dashboard.
              </p>
              <div class="flex gap-2">
                <RouterLink
                  to="/login"
                  class="text-xs font-semibold text-forest-600 hover:text-forest-700 border border-forest-300 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Sign In
                </RouterLink>
                <RouterLink
                  to="/signup"
                  class="text-xs font-semibold text-white bg-forest-600 hover:bg-forest-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Create Account
                </RouterLink>
              </div>
            </div>

            <div class="border-t-2 border-earth-100 pt-6 space-y-4">
              <p class="text-xs font-semibold text-earth-400 uppercase tracking-wider">
                Prefer direct contact?
              </p>
              <div class="flex items-center gap-3 text-sm text-earth-700">
                <div
                  class="w-9 h-9 border-2 border-earth-200 rounded-xl flex items-center justify-center bg-parchment"
                >
                  📧
                </div>
                <span>hello@dualmarket.com</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-earth-700">
                <div
                  class="w-9 h-9 border-2 border-earth-200 rounded-xl flex items-center justify-center bg-parchment"
                >
                  💬
                </div>
                <span>WhatsApp available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useReveal } from "../composables/useReveal";
import { useAuthStore } from "../stores/auth";
import { useQuoteStore } from "../stores/quotes";

const { observe } = useReveal();
const auth = useAuthStore();
const quoteStore = useQuoteStore();

const submitted = ref(false);
const submittedRef = ref("");
const submitError = ref("");
const loading = computed(() => quoteStore.loading);

// Minimum date = today
const minDate = new Date().toISOString().split("T")[0];

const emptyForm = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  product: "",
  quantity: "",
  country: "",
  destination: "",
  shipDate: "",
  notes: "",
};

const form = reactive({ ...emptyForm });
const touched = reactive({
  fullName: false,
  company: false,
  email: false,
  product: false,
  quantity: false,
  country: false,
});

onMounted(() => {
  observe();
  // Pre-fill from profile if logged in
  if (auth.profile) {
    form.fullName = auth.profile.full_name || "";
    form.company = auth.profile.company_name || "";
    form.country = auth.profile.country || "";
    form.phone = auth.profile.phone || "";
  }
  if (auth.user) {
    form.email = auth.user.email || "";
  }
});

const canSubmit = computed(
  () =>
    !!form.fullName &&
    !!form.company &&
    !!form.email &&
    !!form.product &&
    !!form.quantity &&
    !!form.country
);

const handleSubmit = async () => {
  // Mark all fields as touched to show validation
  touched.fullName = true;
  touched.company = true;
  touched.email = true;
  touched.product = true;
  touched.quantity = true;
  touched.country = true;

  if (!canSubmit.value) {
    console.warn("Form validation failed — missing required fields");
    return;
  }

  submitError.value = "";
  console.log("📋 Submitting quote form...");

  try {
    const result = await quoteStore.submitQuote({
      user_id: auth.user?.id ?? null,
      full_name: form.fullName,
      company_name: form.company,
      email: form.email,
      phone: form.phone || undefined,
      product: form.product,
      quantity: form.quantity,
      buyer_country: form.country,
      delivery_destination: form.destination || undefined,
      ship_date: form.shipDate || undefined,
      notes: form.notes || undefined,
    });

    console.log("✅ Quote submitted successfully:", result?.ref);
    submittedRef.value = result?.ref || "";
    submitted.value = true;
  } catch (e: any) {
    console.error("❌ Quote submission error:", e.message);
    submitError.value = e.message?.includes("violates")
      ? "There was a database error. Please try again or contact us directly."
      : e.message || "Something went wrong. Please try again.";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const reset = () => {
  submitted.value = false;
  submittedRef.value = "";
  submitError.value = "";
  Object.assign(form, emptyForm);
  Object.assign(touched, {
    fullName: false,
    company: false,
    email: false,
    product: false,
    quantity: false,
    country: false,
  });
  // Re-fill from profile
  if (auth.profile) {
    form.fullName = auth.profile.full_name || "";
    form.company = auth.profile.company_name || "";
    form.country = auth.profile.country || "";
    form.phone = auth.profile.phone || "";
  }
  if (auth.user) {
    form.email = auth.user.email || "";
  }
};

const exportProducts = [
  "Sesame Seeds",
  "Hibiscus Flower",
  "Ginger",
  "Cashew Nuts",
  "Shea Butter",
  "Groundnut",
  "Cocoa Beans",
  "Soyabeans",
];
const localProducts = [
  "Rice",
  "Palm Oil",
  "Maize",
  "Beans",
  "Onions",
  "Cassava",
  "Garri",
  "Wheat",
];

const nextSteps = [
  {
    title: "We review your request",
    desc: "Our team checks your requirements against current supplier availability.",
  },
  {
    title: "We contact you within 24hrs",
    desc: "You receive pricing, grade details, and a delivery timeline.",
  },
  {
    title: "Terms agreed and locked",
    desc: "A proforma invoice is issued once both parties confirm.",
  },
];
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
