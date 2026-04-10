<template>
  <div class="min-h-screen flex flex-col bg-cream text-earth-900">

    <!-- Auth loading screen -->
    <Transition name="fade">
      <div v-if="authLoading"
        class="fixed inset-0 bg-cream flex items-center justify-center z-[100]">
        <div class="text-center">
          <div class="w-12 h-12 border-4 border-earth-200 border-t-forest-600
                      rounded-full animate-spin mx-auto mb-4" />
          <p class="text-earth-400 text-sm font-medium">Loading...</p>
        </div>
      </div>
    </Transition>

    <template v-if="!authLoading">
      <AppHeader />
      <main class="flex-1">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
      <AppFooter />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import { useAuthStore } from './stores/auth'

const route = useRoute()

const auth        = useAuthStore()
const authLoading = computed(() => auth.loading)
const isAuthPage = computed(() => route.meta.layout === 'auth')

</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>