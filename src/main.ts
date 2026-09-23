import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import { Toaster } from 'vue-sonner'
import App from './App.vue'
import { routes } from './router/routes'
import { setupAuthGuard } from './router/guards'
import { useAuthStore } from './stores/auth'
import './assets/css/main.css'

// vite-ssg requires `export const createApp` instead of the old
// createApp(App).mount('#app') pattern. It creates one app instance per
// route during the SSG build (server-rendering each with Vue's real
// renderToString — no headless browser involved) and one instance for
// the client on hydration; this setup callback runs for both.
export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior() {
      return { top: 0 }
    },
  },
  ({ app, router, isClient }) => {
    const pinia = createPinia()
    app.use(pinia)
    app.use(createHead())
    app.component('Toaster', Toaster)

    setupAuthGuard(router)

    // Auth only makes sense client-side — there's no logged-in user
    // during the SSG render pass, and a crawler should see the
    // logged-out page anyway (guards.ts treats SSR as logged-out too).
    // Calling this here, before the router resolves any navigation,
    // also fixes the old deadlock: auth.init() used to live in
    // App.vue's onMounted, which can't run until the router guard's
    // own "wait for auth.loading" check has already passed — meaning
    // every navigation burned the guard's 5s fallback timeout for
    // nothing.
    //
    // IMPORTANT: remove the onMounted(() => auth.init()) call in
    // App.vue now that this is the entry point — auth.init() subscribes
    // a new supabase.auth.onAuthStateChange listener every time it
    // runs, so calling it twice (here and in App.vue) would leave two
    // listeners firing on every auth event, not a harmless no-op.
    if (isClient) {
      useAuthStore(pinia).init()
    }
  },
)