<template>
  <div class="min-h-screen flex flex-col bg-cream text-earth-900">
    <AppHeader v-if="!isAuthPage" />

    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter v-if="!isAuthPage" />

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'

const route = useRoute()

const isAuthPage = computed(() => route.meta.layout === 'auth')
</script>