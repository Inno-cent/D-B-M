<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      headerSolid
        ? 'bg-forest-900/95 backdrop-blur-xl shadow-lg shadow-forest-900/10 py-3.5'
        : 'bg-transparent py-6',
    ]"
  >
    <div class="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between gap-8">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5 group flex-shrink-0">
        <div
          class="w-9 h-9 bg-white rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
        >
          <span class="text-forest-700 font-bold text-xs tracking-tight">OG</span>
        </div>
        <span class="text-white font-semibold text-[15px] tracking-tight">
          Orena Global
        </span>
      </RouterLink>

      <!-- Center nav — deliberately minimal: the two paths into the business,
           nothing else. About / Blog / Contact live in the footer. -->
      <nav class="hidden lg:flex items-center gap-1 flex-1 justify-center">
        <RouterLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="text-[13px] font-medium px-4 py-2 rounded-full text-forest-200 hover:text-white transition-colors duration-200"
          active-class="text-white"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Right side -->
      <div class="flex items-center gap-1.5 flex-shrink-0">
        <!-- Cart — icon only, no border, badge does the talking -->
        <button
          @click="cartOpen = true"
          aria-label="Open cart"
          class="relative w-9 h-9 flex items-center justify-center rounded-full text-forest-200 hover:text-white hover:bg-white/10 transition-all duration-200"
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
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span
            v-if="cart.itemCount > 0"
            class="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-1 bg-harvest text-forest-900 rounded-full text-[9px] font-bold flex items-center justify-center leading-none"
          >
            {{ cart.itemCount }}
          </span>
        </button>

        <!-- Logged in -->
        <template v-if="isLoggedIn">
          <RouterLink
            to="/dashboard"
            class="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-forest-200 hover:text-white hover:bg-white/10 transition-all duration-200"
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
          </RouterLink>
          <button
            @click="handleSignOut"
            class="hidden sm:inline-flex text-forest-300 text-[13px] font-medium py-2 px-3 rounded-full hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            Sign Out
          </button>
        </template>

        <!-- Logged out -->
        <template v-else>
          <RouterLink
            to="/login"
            class="hidden sm:inline-flex text-forest-200 text-[13px] font-medium py-2 px-3.5 rounded-full hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            Sign In
          </RouterLink>
        </template>

        <!-- Primary CTA — the one bold element in the header -->
        <RouterLink
          to="/products"
          class="hidden sm:inline-flex bg-white text-forest-800 text-[13px] font-semibold py-2 px-4 rounded-full hover:bg-cream transition-all duration-200"
        >
          Shop Now
        </RouterLink>

        <!-- Mobile hamburger -->
        <button
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
          class="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-full text-forest-200 hover:text-white hover:bg-white/10 transition-all duration-200"
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
            class="flex items-center justify-between text-sm px-4 py-3 rounded-xl text-forest-200 hover:text-white hover:bg-white/10 transition-all duration-200"
            @click="mobileOpen = false"
          >
            <span>Cart</span>
            <span
              v-if="cart.itemCount > 0"
              class="bg-harvest text-forest-900 rounded-full text-xs font-bold min-w-[20px] h-5 px-1.5 flex items-center justify-center"
            >
              {{ cart.itemCount }}
            </span>
          </RouterLink>
        </nav>
        <div class="flex flex-col gap-3">
          <RouterLink
            v-if="isLoggedIn"
            to="/dashboard"
            class="text-center py-3 rounded-full bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-all"
            @click="mobileOpen = false"
          >
            Dashboard
          </RouterLink>
          <template v-else>
            <RouterLink
              to="/login"
              class="text-center py-3 rounded-full bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-all"
              @click="mobileOpen = false"
            >
              Sign In
            </RouterLink>
          </template>
          <RouterLink
            to="/products"
            class="text-center py-3 rounded-full bg-white text-forest-800 font-semibold text-sm hover:bg-cream transition-all"
            @click="mobileOpen = false"
          >
            Shop Now
          </RouterLink>
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

const isHomePage = computed(() => route.path === "/");
const headerSolid = computed(() => (isHomePage.value ? scrolled.value : true));

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

// Deliberately minimal — Products and How It Works are the two real paths
// into the business (buy local / request export quote). Everything else
// (Blog, About, Contact) lives in the footer.
const navLinks = [
  { label: "Products", path: "/products" },
  { label: "How It Works", path: "/how-it-works" },
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
