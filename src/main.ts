import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import { Toaster } from 'vue-sonner'
import App from './App.vue'
import { routes } from './router/routes'
import { setupAuthGuard } from './router/guards'
import { useAuthStore } from './stores/auth'
import { useCatalogStore } from './stores/catalog'
import './assets/css/main.css'


export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior() {
      return { top: 0 }
    },
  },
  async ({ app, router, isClient, initialState }) => {
    const pinia = createPinia()
    app.use(pinia)
    app.use(createHead())
    app.component('Toaster', Toaster)

    setupAuthGuard(router)

    const catalog = useCatalogStore(pinia)

    if (!isClient) {
      await catalog.load()
      initialState.catalog = catalog.serialize()
      return
    }

    // Auth only makes sense client-side — there's no logged-in user
    // during the SSG render pass, and a crawler should see the
    // logged-out page anyway (guards.ts treats SSR as logged-out too).
    // IMPORTANT: remove the onMounted(() => auth.init()) call in
    // App.vue — calling it twice would register two
    // supabase.auth.onAuthStateChange listeners.
    useAuthStore(pinia).init()

    if (initialState.catalog) {
      catalog.hydrate(initialState.catalog)
      // Pick up admin edits made since the last publish. Deferred until the
      // page has finished hydrating so it can't cause a hydration mismatch.
      const refreshLater = () => setTimeout(() => catalog.refresh(), 0)
      if (document.readyState === 'complete') refreshLater()
      else window.addEventListener('load', refreshLater, { once: true })
    } else {
      // No embedded data (dev server, or a route that wasn't prerendered):
      // fetch before mounting so views never see an empty catalog.
      try {
        await catalog.load()
      } catch (e) {
        console.error('Could not load the product catalog', e)
      }
    }
  },
)
