```vue
<template>
  <!-- Main header -->
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300',
      scrolled ? 'shadow-md border-b border-earth-200' : 'border-b border-earth-100',
    ]"
  >
    <!-- ========================================================= -->
    <!-- MOBILE / TABLET (< lg) -->
    <!-- ========================================================= -->
    <div class="lg:hidden px-4 pt-3 pb-3">
      <!-- Top row: hamburger — logo — account/cart -->
      <div class="relative flex items-center justify-between gap-2">
        <!-- Hamburger -->
        <button
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
          :aria-expanded="mobileOpen"
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

        <!-- ===================================================== -->
        <!-- LOGO -->
        <!-- ===================================================== -->
        <RouterLink
          to="/"
          class="absolute left-1/2 -translate-x-1/2 flex items-center group"
          aria-label="Orenag Home"
        >
          <img
            :src="logoUrl"
            alt="Orenag"
            class="h-12 w-auto max-w-[140px] object-contain object-center group-hover:scale-105 transition-transform duration-200"
          />
        </RouterLink>

        <!-- Right side -->
        <div class="flex items-center gap-1 flex-shrink-0">
          <!-- Logged out -->
          <RouterLink
            v-if="!isLoggedIn"
            to="/login"
            aria-label="Login or sign up"
            class="w-9 h-9 flex items-center justify-center rounded-full text-earth-700 hover:bg-earth-50 transition-all duration-200"
          >
            <!-- Profile icon -->
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

          <!-- Logged in -->
          <RouterLink
            v-else
            to="/dashboard"
            :aria-label="`Dashboard — ${auth.firstName || 'Account'}`"
            class="w-9 h-9 flex items-center justify-center rounded-full text-earth-700 hover:bg-earth-50 transition-all duration-200"
          >
            <!-- Profile icon -->
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

      <!-- ===================================================== -->
      <!-- MOBILE SEARCH -->
      <!-- ===================================================== -->
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

    <!-- ========================================================= -->
    <!-- DESKTOP (lg+) -->
    <!-- ========================================================= -->
    <div
      class="hidden lg:flex max-w-7xl mx-auto px-6 md:px-10 py-3.5 items-center gap-4 md:gap-8"
    >
      <!-- ======================================================= -->
      <!-- DESKTOP LOGO -->
      <!-- ======================================================= -->
      <RouterLink
        to="/"
        class="flex items-center group flex-shrink-0"
        aria-label="Orenag Home"
      >
        <img
          :src="logoUrl"
          alt="Orenag"
          class="h-14 w-auto max-w-[150px] object-contain object-center group-hover:scale-105 transition-transform duration-200"
        />
      </RouterLink>

      <!-- ======================================================= -->
      <!-- DESKTOP SEARCH -->
      <!-- ======================================================= -->
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

      <!-- ======================================================= -->
      <!-- DESKTOP RIGHT SIDE -->
      <!-- ======================================================= -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <!-- Logged in -->
        <template v-if="isLoggedIn">
          <!-- ================================================= -->
          <!-- PROFILE / DASHBOARD -->
          <!-- ================================================= -->
          <RouterLink
            to="/dashboard"
            :aria-label="`Dashboard — ${auth.firstName || 'Account'}`"
            class="group flex items-center gap-2 text-earth-700 text-sm font-medium py-1.5 px-2 rounded-full hover:bg-earth-50 transition-all duration-200"
          >
            <!-- Stylish profile icon -->
            <span
              class="w-9 h-9 flex items-center justify-center rounded-full border border-earth-200 bg-earth-50 text-earth-700 group-hover:border-forest-300 group-hover:bg-forest-50 group-hover:text-forest-700 transition-all duration-200"
            >
              <svg
                class="w-[19px] h-[19px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" stroke-width="1.6" />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.6"
                  d="M8.5 17.5a4.5 4.5 0 017 0M15 9a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </span>

            <span class="max-w-[100px] truncate">
              {{ auth.firstName || "Account" }}
            </span>
          </RouterLink>

          <!-- ================================================= -->
          <!-- SIGN OUT -->
          <!-- ================================================= -->
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
          aria-label="Login or sign up"
          class="group flex items-center gap-2 text-earth-700 text-sm font-medium py-1.5 px-2 rounded-full hover:bg-earth-50 transition-all duration-200"
        >
          <!-- Stylish profile icon -->
          <span
            class="w-9 h-9 flex items-center justify-center rounded-full border border-earth-200 bg-earth-50 text-earth-700 group-hover:border-forest-300 group-hover:bg-forest-50 group-hover:text-forest-700 transition-all duration-200"
          >
            <svg
              class="w-[19px] h-[19px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="9" stroke-width="1.6" />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.6"
                d="M8.5 17.5a4.5 4.5 0 017 0M15 9a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </span>

          <span>Login / Sign Up</span>
        </RouterLink>

        <!-- ================================================= -->
        <!-- CART -->
        <!-- ================================================= -->
        <button
          @click="cartOpen = true"
          aria-label="Open cart"
          class="relative flex items-center gap-2 text-earth-700 text-sm font-medium py-1.5 px-2 rounded-full hover:bg-earth-50 transition-all duration-200"
        >
          <span
            class="relative w-9 h-9 flex items-center justify-center rounded-full border border-earth-200 bg-earth-50 text-earth-700"
          >
            <svg
              class="w-[19px] h-[19px]"
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
          </span>

          <span>Cart</span>
        </button>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- SECONDARY NAVIGATION - DESKTOP -->
    <!-- ========================================================= -->
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

    <!-- ========================================================= -->
    <!-- MOBILE MENU -->
    <!-- ========================================================= -->
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
          <!-- Logged in -->
          <RouterLink
            v-if="isLoggedIn"
            to="/dashboard"
            class="text-center py-3 rounded-full bg-earth-50 text-earth-800 font-semibold text-sm hover:bg-earth-100 transition-all"
            @click="mobileOpen = false"
          >
            Dashboard
          </RouterLink>

          <!-- Logged out -->
          <RouterLink
            v-else
            to="/login"
            class="text-center py-3 rounded-full bg-earth-50 text-earth-800 font-semibold text-sm hover:bg-earth-100 transition-all"
            @click="mobileOpen = false"
          >
            Login / Sign Up
          </RouterLink>

          <!-- Sign out -->
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

  <!-- =========================================================== -->
  <!-- HEADER SPACER -->
  <!-- =========================================================== -->
  <div class="h-[124px] lg:h-[136px]" />

  <!-- =========================================================== -->
  <!-- CART DRAWER -->
  <!-- =========================================================== -->
  <CartDrawer v-model="cartOpen" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useCartStore } from "../../stores/cart";
import CartDrawer from "../ui/CartDrawer.vue";

/**
 * |--------------------------------------------------------------------------
 * | Logo
 * |--------------------------------------------------------------------------
 * |
 * | Make sure this file exists at:
 * |
 * | src/assets/logo-main.png
 * |
 * |--------------------------------------------------------------------------
 */
import logoUrl from "@/assets/logo-main.png";

/**
 * |--------------------------------------------------------------------------
 * | Stores
 * |--------------------------------------------------------------------------
 */
const auth = useAuthStore();
const cart = useCartStore();

/**
 * |--------------------------------------------------------------------------
 * | Router
 * |--------------------------------------------------------------------------
 */
const router = useRouter();
const route = useRoute();

/**
 * |--------------------------------------------------------------------------
 * | Authentication
 * |--------------------------------------------------------------------------
 */
const isLoggedIn = computed(() => auth.isLoggedIn);

/**
 * |--------------------------------------------------------------------------
 * | Header state
 * |--------------------------------------------------------------------------
 */
const scrolled = ref(false);
const mobileOpen = ref(false);
const cartOpen = ref(false);
const searchQuery = ref("");

/**
 * |--------------------------------------------------------------------------
 * | Handle scroll
 * |--------------------------------------------------------------------------
 */
const handleScroll = () => {
  scrolled.value = window.scrollY > 20;
};

/**
 * |--------------------------------------------------------------------------
 * | Lifecycle
 * |--------------------------------------------------------------------------
 */
onMounted(() => {
  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

/**
 * |--------------------------------------------------------------------------
 * | Close mobile menu when route changes
 * |--------------------------------------------------------------------------
 */
watch(
  () => route.path,
  () => {
    mobileOpen.value = false;
  }
);

/**
 * |--------------------------------------------------------------------------
 * | Sign out
 * |--------------------------------------------------------------------------
 */
const handleSignOut = async () => {
  try {
    await auth.signOut();
    mobileOpen.value = false;
    router.push("/");
  } catch (e) {
    console.error("Sign out failed:", e);
  }
};

/**
 * |--------------------------------------------------------------------------
 * | Navigation links
 * |--------------------------------------------------------------------------
 */
const navLinks = [
  {
    label: "Shop Groceries",
    path: "/products",
  },
  {
    label: "Meal Kits",
    path: "/meal-kits",
    badge: "New",
  },
  {
    label: "Deals",
    path: "/deals",
  },
  {
    label: "Recipes",
    path: "/recipes",
  },
  {
    label: "About Us",
    path: "/about",
  },
  {
    label: "Contact Us",
    path: "/contact",
  },
];

/**
 * |--------------------------------------------------------------------------
 * | Search
 * |--------------------------------------------------------------------------
 */
function handleSearch() {
  const query = searchQuery.value.trim();

  if (!query) {
    return;
  }

  router.push({
    path: "/products",
    query: {
      q: query,
    },
  });

  mobileOpen.value = false;
}
</script>

<style scoped>
/**
 * |--------------------------------------------------------------------------
 * | Mobile menu animation
 * |--------------------------------------------------------------------------
 */

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/**
 * |--------------------------------------------------------------------------
 * | Logo rendering
 * |--------------------------------------------------------------------------
 *
 * | Ensures the transparent PNG keeps its proportions and does not
 * | stretch or distort inside the header.
 * |--------------------------------------------------------------------------
 */

img {
  display: block;
}
</style>