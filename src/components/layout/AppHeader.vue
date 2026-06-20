<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      headerSolid
        ? 'bg-forest-900/96 backdrop-blur-xl shadow-xl shadow-forest-900/20 py-3'
        : 'bg-transparent py-5',
    ]"
  >
    <div class="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center gap-3 group">
        <div
          class="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-forest-900/20"
        >
          <span class="text-forest-700 font-bold text-sm">PG</span>
        </div>
        <div>
          <span class="text-white font-bold text-base block leading-none"
            >PRENA GLOBAL</span
          >
          <!-- <span class="text-forest-300 text-xs leading-none">Brokerage</span> -->
        </div>
      </RouterLink>

      <nav class="hidden lg:flex items-center gap-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="text-sm px-4 py-2 rounded-lg text-forest-200 hover:text-white hover:bg-white/10 transition-all duration-200"
          active-class="text-white bg-white/10 font-medium"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Right side -->
      <div class="flex items-center gap-3">

        <!-- Cart icon — always visible, logged in or not -->
        <button
          @click="cartOpen = true"
          aria-label="Open cart"
          class="relative w-9 h-9 flex items-center justify-center rounded-xl
                 border-2 border-white/20 hover:border-white/50 hover:bg-white/10
                 transition-all duration-200"
        >
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span
            v-if="cart.itemCount > 0"
            class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1
                   bg-harvest text-forest-900 rounded-full text-[10px] font-bold
                   flex items-center justify-center leading-none"
          >
            {{ cart.itemCount }}
          </span>
        </button>

        <!-- Logged in -->
        <template v-if="isLoggedIn">
          <RouterLink
            to="/dashboard"
            class="hidden sm:inline-flex items-center gap-2 border-2 border-white/20 text-white text-xs py-2.5 px-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white/40 transition-all duration-200"
          >
            <svg
              class="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {{ auth.firstName || "Dashboard" }}
          </RouterLink>
          <button
            @click="handleSignOut"
            class="hidden sm:inline-flex text-forest-300 text-xs py-2.5 px-3 rounded-xl hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
          >
            Sign Out
          </button>
        </template>

        <!-- Logged out -->
        <template v-else>
          <RouterLink
            to="/login"
            class="hidden sm:inline-flex text-forest-200 text-xs py-2.5 px-4 rounded-xl hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
          >
            Sign In
          </RouterLink>
          <RouterLink
            to="/request-quote"
            class="hidden sm:inline-flex btn-harvest text-xs py-2.5 px-5"
          >
            Request a Quote
          </RouterLink>
        </template>

        <!-- Mobile hamburger -->
        <button
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
          class="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-white/20 hover:border-white/50 transition-all duration-200"
        >
          <span
            :class="[
              'block w-4 h-0.5 bg-white transition-all duration-300',
              mobileOpen ? 'rotate-45 translate-y-2' : '',
            ]"
          />
          <span
            :class="[
              'block w-4 h-0.5 bg-white transition-all duration-200',
              mobileOpen ? 'opacity-0' : 'opacity-100',
            ]"
          />
          <span
            :class="[
              'block w-4 h-0.5 bg-white transition-all duration-300',
              mobileOpen ? '-rotate-45 -translate-y-2' : '',
            ]"
          />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div
        v-if="mobileOpen"
        class="lg:hidden bg-forest-900/98 backdrop-blur-xl border-t border-white/10 px-6 py-5"
      >
        <nav class="flex flex-col gap-1 mb-4">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="text-sm px-4 py-3 rounded-xl text-forest-200 hover:text-white hover:bg-white/10 transition-all duration-200"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </RouterLink>
          <RouterLink
            to="/cart"
            class="flex items-center justify-between text-sm px-4 py-3 rounded-xl
                   text-forest-200 hover:text-white hover:bg-white/10 transition-all duration-200"
            @click="mobileOpen = false"
          >
            <span>Cart</span>
            <span v-if="cart.itemCount > 0"
              class="bg-harvest text-forest-900 rounded-full text-xs font-bold
                     min-w-[20px] h-5 px-1.5 flex items-center justify-center">
              {{ cart.itemCount }}
            </span>
          </RouterLink>
        </nav>
        <div class="flex flex-col gap-3">
          <RouterLink
            v-if="isLoggedIn"
            to="/dashboard"
            class="btn-outline border-white/20 text-white text-center justify-center hover:bg-white/10 hover:border-white/40 hover:text-white py-3"
            @click="mobileOpen = false"
          >
            Dashboard
          </RouterLink>
          <template v-else>
            <RouterLink
              to="/login"
              class="text-center py-3 border-2 border-white/20 rounded-xl text-white font-semibold text-sm hover:bg-white/10 transition-all"
              @click="mobileOpen = false"
            >
              Sign In
            </RouterLink>
            <RouterLink
              to="/request-quote"
              class="btn-harvest w-full justify-center py-3 text-center block"
              @click="mobileOpen = false"
            >
              Request a Quote
            </RouterLink>
          </template>
        </div>
      </div>
    </Transition>
  </header>

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

// True when the header should show a solid background.
// On the home route ('/') we defer to scroll position.
// On all other routes the background is always solid.
const isHomePage = computed(() => route.path === "/");

const headerSolid = computed(() => (isHomePage.value ? scrolled.value : true));

const handleScroll = () => {
  scrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  // Initialise on mount so refreshing mid-page on home works correctly
  handleScroll();
});

onUnmounted(() => window.removeEventListener("scroll", handleScroll));

// When navigating away from home, close any open mobile menu
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

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "How It Works", path: "/how-it-works" },
  // { label: "Suppliers", path: "/supplier-network" },
  { label: "Blog", path: "/blog" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];
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