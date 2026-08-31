<template>
  <!-- Main header -->
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300',
      scrolled ? 'shadow-md border-b border-earth-200' : 'border-b border-earth-100',
    ]"
  >
    <!-- ============ MOBILE / TABLET (< lg) ============ -->
    <div class="lg:hidden px-4 pt-3 pb-3">
      <!-- Top row: hamburger — logo (centered) — cart -->
      <div class="relative flex items-center justify-between gap-2">
        <!-- Hamburger (left) -->
        <button
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
          class="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-full text-earth-700 hover:bg-earth-50 transition-all duration-200 flex-shrink-0"
        >
          <span
            :class="[
              'block w-4 h-[1.5px] bg-current transition-all duration-300',
              mobileOpen ? 'rotate-45 translate-y-[3px]' : '',
            ]"
          />
          <span
            :class="[
              'block w-4 h-[1.5px] bg-current transition-all duration-300',
              mobileOpen ? '-rotate-45 -translate-y-[3px]' : '',
            ]"
          />
        </button>

        <!-- Logo (absolutely centered so it stays centered regardless of side content width) -->
        <RouterLink
          to="/"
          class="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group"
        >
          <div
            class="w-8 h-8 bg-forest-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
          >
            <span class="text-white font-bold text-[11px] tracking-tight">OG</span>
          </div>
          <span class="text-forest-800 font-bold text-lg tracking-tight"> Orenag </span>
        </RouterLink>

        <!-- Right side: login (icon, only when logged out) + cart -->
        <div class="flex items-center gap-1 flex-shrink-0">
          <!-- Logged out: compact login icon.
               TODO(user): swap this for an <img> avatar/illustration if preferred —
               placeholder icon-only button for now per request. -->
          <RouterLink
            v-if="!isLoggedIn"
            to="/login"
            aria-label="Login or sign up"
            class="w-9 h-9 flex items-center justify-center rounded-full text-earth-700 hover:bg-earth-50 transition-all duration-200"
          >
            <svg
              class="w-[20px] h-[20px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.8"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </RouterLink>

          <!-- Logged in: account icon -->
          <RouterLink
            v-else
            to="/dashboard"
            :aria-label="`Dashboard — ${auth.firstName || 'Account'}`"
            class="w-9 h-9 flex items-center justify-center rounded-full text-earth-700 hover:bg-earth-50 transition-all duration-200"
          >
            <svg
              class="w-[20px] h-[20px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.8"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </RouterLink>

          <!-- Cart -->
          <button
            @click="cartOpen = true"
            aria-label="Open cart"
            class="relative w-9 h-9 flex items-center justify-center rounded-full text-earth-700 hover:bg-earth-50 transition-all duration-200"
          >
            <svg
              class="w-[20px] h-[20px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.8"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span
              v-if="cart.itemCount > 0"
              class="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-forest-700 text-white rounded-full text-[9px] font-bold flex items-center justify-center leading-none"
            >
              {{ cart.itemCount }}
            </span>
          </button>
        </div>
      </div>

      <!-- Persistent search row (always visible on mobile, like the reference) -->
      <form class="flex mt-3" @submit.prevent="handleSearch">
        <div
          class="flex w-full rounded-xl border-2 border-earth-200 overflow-hidden focus-within:border-forest-400 transition-colors"
        >
          <input
            v-model="searchQuery"
            type="search"
            placeholder="What are you cooking today?"
            class="flex-1 px-4 py-2 text-sm outline-none text-earth-900 placeholder:text-earth-400"
          />
          <button
            type="submit"
            class="bg-forest-700 text-white px-4 text-sm font-semibold hover:bg-forest-600 transition-colors"
          >
            Search
          </button>
        </div>
      </form>
    </div>

    <!-- ============ DESKTOP (lg+) ============ -->
    <div
      class="hidden lg:flex max-w-7xl mx-auto px-6 md:px-10 py-3.5 items-center gap-4 md:gap-8"
    >
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2 group flex-shrink-0">
        <div
          class="w-9 h-9 bg-forest-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
        >
          <span class="text-white font-bold text-xs tracking-tight">OG</span>
        </div>
        <span class="text-forest-800 font-bold text-xl tracking-tight"> Orenag </span>
      </RouterLink>

      <!-- Search -->
      <form class="flex flex-1 max-w-xl" @submit.prevent="handleSearch">
        <div
          class="flex w-full rounded-xl border-2 border-earth-200 overflow-hidden focus-within:border-forest-400 transition-colors"
        >
          <input
            v-model="searchQuery"
            type="search"
            placeholder="What are you cooking today?"
            class="flex-1 px-4 py-2 text-sm outline-none text-earth-900 placeholder:text-earth-400"
          />
          <button
            type="submit"
            class="bg-forest-700 text-white px-5 text-sm font-semibold hover:bg-forest-600 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      <!-- Right side -->
      <div class="flex items-center gap-1.5 flex-shrink-0">
        <!-- Logged in -->
        <template v-if="isLoggedIn">
          <RouterLink
            to="/dashboard"
            class="flex items-center gap-1.5 text-earth-700 text-sm font-medium py-2 px-3 rounded-full hover:bg-earth-50 transition-all duration-200"
            :aria-label="`Dashboard — ${auth.firstName || 'Account'}`"
          >
            <svg
              class="w-[18px] h-[18px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.8"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>{{ auth.firstName || "Account" }}</span>
          </RouterLink>
          <button
            @click="handleSignOut"
            class="text-earth-500 text-sm font-medium py-2 px-3 rounded-full hover:bg-earth-50 hover:text-earth-800 transition-all duration-200"
          >
            Sign Out
          </button>
        </template>

        <!-- Logged out -->
        <RouterLink
          v-else
          to="/login"
          class="flex items-center gap-1.5 text-earth-700 text-sm font-medium py-2 px-3 rounded-full hover:bg-earth-50 transition-all duration-200"
        >
          <svg
            class="w-[18px] h-[18px]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Login / Sign Up
        </RouterLink>

        <!-- Cart -->
        <button
          @click="cartOpen = true"
          aria-label="Open cart"
          class="relative flex items-center gap-1.5 text-earth-700 text-sm font-medium py-2 px-3 rounded-full hover:bg-earth-50 transition-all duration-200"
        >
          <span class="relative">
            <svg
              class="w-[18px] h-[18px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.8"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span
              v-if="cart.itemCount > 0"
              class="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-1 bg-forest-700 text-white rounded-full text-[9px] font-bold flex items-center justify-center leading-none"
            >
              {{ cart.itemCount }}
            </span>
          </span>
          <span>Cart</span>
        </button>
      </div>
    </div>

    <!-- Secondary nav row (desktop) -->
    <nav class="hidden lg:flex items-center gap-1 border-t border-earth-100">
      <div class="max-w-7xl mx-auto px-6 md:px-10 w-full flex items-center gap-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2.5 text-earth-700 hover:text-forest-700 transition-colors duration-200"
          active-class="text-forest-700"
        >
          {{ link.label }}
          <span
            v-if="link.badge"
            class="bg-red-600 text-white text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
          >
            {{ link.badge }}
          </span>
        </RouterLink>
      </div>
    </nav>

    <!-- Mobile menu (nav links + auth actions) -->
    <Transition name="mobile-menu">
      <div
        v-if="mobileOpen"
        class="lg:hidden bg-white border-t border-earth-200 px-6 py-5"
      >
        <nav class="flex flex-col gap-1 mb-4">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="flex items-center gap-2 text-sm px-4 py-3 rounded-xl text-earth-700 hover:bg-earth-50 transition-all duration-200"
            @click="mobileOpen = false"
          >
            {{ link.label }}
            <span
              v-if="link.badge"
              class="bg-red-600 text-white text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
            >
              {{ link.badge }}
            </span>
          </RouterLink>
        </nav>

        <div class="flex flex-col gap-3">
          <RouterLink
            v-if="isLoggedIn"
            to="/dashboard"
            class="text-center py-3 rounded-full bg-earth-50 text-earth-800 font-semibold text-sm hover:bg-earth-100 transition-all"
            @click="mobileOpen = false"
          >
            Dashboard
          </RouterLink>
          <RouterLink
            v-else
            to="/login"
            class="text-center py-3 rounded-full bg-earth-50 text-earth-800 font-semibold text-sm hover:bg-earth-100 transition-all"
            @click="mobileOpen = false"
          >
            Login / Sign Up
          </RouterLink>
          <button
            v-if="isLoggedIn"
            @click="handleSignOut"
            class="text-center py-3 rounded-full text-earth-500 font-medium text-sm hover:bg-earth-50 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </Transition>
  </header>

  <!-- Spacer so fixed header doesn't overlap page content -->
  <div class="h-[124px] lg:h-[136px]" />

  <!-- Cart drawer — owned here since the header is rendered on every page -->
  <CartDrawer v-model="cartOpen" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useCartStore } from "../../stores/cart";
import CartDrawer from "../ui/CartDrawer.vue";

const auth = useAuthStore();
const cart = useCartStore();
const router = useRouter();
const route = useRoute();
const isLoggedIn = computed(() => auth.isLoggedIn);

const scrolled = ref(false);
const mobileOpen = ref(false);
const cartOpen = ref(false);
const searchQuery = ref("");

const handleScroll = () => {
  scrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => window.removeEventListener("scroll", handleScroll));

watch(
  () => route.path,
  () => {
    mobileOpen.value = false;
  }
);

const handleSignOut = async () => {
  try {
    await auth.signOut();
    router.push("/");
  } catch (e) {
    console.error("Sign out failed:", e);
  }
};

// NOTE: reverses the previous "deliberately minimal nav" decision —
// About Us / Contact Us are back in the header per the new reference
// design. Check AppFooter.vue doesn't end up duplicating these once built.
// "Recipes" and "Deals" routes are assumed — confirm/add in the router.
const navLinks = [
  { label: "Shop Groceries", path: "/products" },
  { label: "Meal Kits", path: "/meal-kits", badge: "New" },
  { label: "Deals", path: "/deals" },
  { label: "Recipes", path: "/recipes" },
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/contact" },
];

// Assumes /products supports a `q` query param for search — wire up
// server/store-side filtering there if it doesn't yet.
function handleSearch() {
  if (!searchQuery.value.trim()) return;
  router.push({ path: "/products", query: { q: searchQuery.value.trim() } });
  mobileOpen.value = false;
}
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
