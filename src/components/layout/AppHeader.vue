<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      scrolled
        ? 'bg-forest-900/96 backdrop-blur-xl shadow-xl shadow-forest-900/20 py-3'
        : 'bg-transparent py-5'
    ]"
  >
    <div class="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">

      <RouterLink to="/" class="flex items-center gap-3 group">
        <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center
                    group-hover:scale-110 transition-transform duration-200
                    shadow-lg shadow-forest-900/20">
          <span class="text-forest-700 font-bold text-sm">DM</span>
        </div>
        <div>
          <span class="text-white font-bold text-base block leading-none">DualMarket</span>
          <span class="text-forest-300 text-xs leading-none">Brokerage</span>
        </div>
      </RouterLink>

      <nav class="hidden lg:flex items-center gap-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="text-sm px-4 py-2 rounded-lg text-forest-200
                 hover:text-white hover:bg-white/10
                 transition-all duration-200"
          active-class="text-white bg-white/10 font-medium"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-3">
        <RouterLink
          to="/request-quote"
          class="hidden sm:inline-flex btn-harvest text-xs py-2.5 px-5"
        >
          Request a Quote
        </RouterLink>

        <button
          @click="mobileOpen = !mobileOpen"
          class="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5
                 rounded-xl border-2 border-white/20 hover:border-white/50
                 transition-all duration-200"
        >
          <span :class="['block w-4 h-0.5 bg-white transition-all duration-300',
            mobileOpen ? 'rotate-45 translate-y-2' : '']" />
          <span :class="['block w-4 h-0.5 bg-white transition-all duration-200',
            mobileOpen ? 'opacity-0' : 'opacity-100']" />
          <span :class="['block w-4 h-0.5 bg-white transition-all duration-300',
            mobileOpen ? '-rotate-45 -translate-y-2' : '']" />
        </button>
      </div>
    </div>

    <Transition name="mobile-menu">
      <div
        v-if="mobileOpen"
        class="lg:hidden bg-forest-900/98 backdrop-blur-xl
               border-t border-white/10 px-6 py-5"
      >
        <nav class="flex flex-col gap-1 mb-4">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="text-sm px-4 py-3 rounded-xl text-forest-200
                   hover:text-white hover:bg-white/10 transition-all duration-200"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
        <RouterLink
          to="/request-quote"
          class="btn-harvest w-full justify-center py-3 block text-center"
          @click="mobileOpen = false"
        >
          Request a Quote
        </RouterLink>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled    = ref(false)
const mobileOpen  = ref(false)

const handler = () => { scrolled.value = window.scrollY > 20 }
onMounted(()   => window.addEventListener('scroll', handler, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handler))

const navLinks = [
  { label: 'Home',          path: '/' },
  { label: 'Products',      path: '/products' },
  { label: 'How It Works',  path: '/how-it-works' },
  { label: 'Suppliers',     path: '/supplier-network' },
  { label: 'Blog',          path: '/blog' },
  { label: 'About',         path: '/about' },
  { label: 'Contact',       path: '/contact' },
]
</script>

<style scoped>
.mobile-menu-enter-active, .mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.mobile-menu-enter-from, .mobile-menu-leave-to {
  opacity: 0; transform: translateY(-8px);
}
</style>