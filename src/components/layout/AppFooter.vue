<template>
  <footer class="bg-forest-900 text-forest-300">
    <div class="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

        <div class="lg:col-span-2">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span class="text-forest-700 font-bold text-sm">DM</span>
            </div>
            <div>
              <span class="text-white font-bold block leading-none text-base">DualMarket</span>
              <span class="text-forest-400 text-xs">Brokerage</span>
            </div>
          </div>
          <p class="text-sm text-forest-400 leading-relaxed max-w-xs mb-6">
            Connecting international buyers and Nigerian businesses with verified, quality-assured suppliers since 2024.
          </p>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span class="text-xs text-forest-500">Actively sourcing · Lagos, Nigeria</span>
          </div>
        </div>

        <div>
          <h4 class="text-white font-semibold text-sm mb-5">Navigate</h4>
          <ul class="space-y-3">
            <li v-for="link in navLinks" :key="link.path">
              <RouterLink
                :to="link.path"
                class="text-sm text-forest-400 hover:text-white transition-colors duration-200"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-semibold text-sm mb-5">Products</h4>
          <ul class="space-y-3">
            <li v-for="p in footerProducts" :key="p.slug">
              <RouterLink
                :to="`/products/${p.slug}`"
                class="text-sm text-forest-400 hover:text-white
                       transition-colors duration-200 flex items-center gap-2"
              >
                <span>{{ p.icon }}</span>{{ p.name }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-forest-800 pt-8
                  flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-xs text-forest-600">
          © {{ new Date().getFullYear() }} DualMarket Brokerage. All rights reserved.
        </p>
        <RouterLink
          to="/request-quote"
          class="text-xs text-harvest font-semibold hover:text-white transition-colors"
        >
          Get a Quote →
        </RouterLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const navLinks = [
  { label: 'Products',         path: '/products' },
  { label: 'How It Works',     path: '/how-it-works' },
  { label: 'Supplier Network', path: '/supplier-network' },
  { label: 'Request a Quote',  path: '/request-quote' },
  { label: 'Blog',             path: '/blog' },
  { label: 'About',            path: '/about' },
  { label: 'Contact',          path: '/contact' },
]
const footerProducts = [
  { name: 'Sesame Seeds',    slug: 'sesame-seeds',    icon: '🌿' },
  { name: 'Hibiscus Flower', slug: 'hibiscus-flower', icon: '🌺' },
  { name: 'Ginger',          slug: 'ginger',          icon: '🫚' },
  { name: 'Cashew Nuts',     slug: 'cashew-nuts',     icon: '🥜' },
  { name: 'Palm Oil',        slug: 'palm-oil',        icon: '🫒' },
  { name: 'Shea Butter',     slug: 'shea-butter',     icon: '✨' },
]
</script>