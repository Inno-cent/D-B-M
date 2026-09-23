import type { Router } from 'vue-router'
import { watch } from 'vue'
import { useAuthStore } from '../stores/auth'

export function setupAuthGuard(router: Router) {
  router.beforeEach(async (to) => {
    const auth = useAuthStore()

    // During the SSG build there's no logged-in user — auth.init() is
    // only ever called client-side (see main.ts), so auth.loading would
    // stay `true` forever here and every one of the ~70 prerendered
    // routes would burn the 5s fallback timeout below for nothing.
    // Treat every SSG pass as logged-out, which is the correct state
    // for a crawler to see anyway and matches the guard's own
    // fallback behavior on the client.
    if (import.meta.env.SSR) {
      if (to.meta.requiresAuth) return { name: 'login', query: { redirect: to.fullPath } }
      if (to.meta.requiresAdmin) return { name: 'home' }
      return
    }

    if (auth.loading) {
      await new Promise<void>((resolve) => {
        // Safety net only. auth.init() is now called in main.ts before
        // the app mounts/navigates (see main.ts), so this should
        // resolve almost immediately — the 5s cap just guards against
        // a genuinely stalled network call rather than being the
        // primary mechanism, which is what it was before.
        const timeout = setTimeout(() => {
          stop()
          resolve()
        }, 5000)
        const stop = watch(
          () => auth.loading,
          (val) => {
            if (!val) {
              clearTimeout(timeout)
              stop()
              resolve()
            }
          },
          { immediate: true },
        )
      })
    }

    if (to.meta.requiresAuth && !auth.isLoggedIn)
      return { name: 'login', query: { redirect: to.fullPath } }
    if (to.meta.guestOnly && auth.isLoggedIn) return { name: 'dashboard' }
    if (to.meta.requiresAdmin && !auth.isAdmin) return { name: 'home' }
  })
}1