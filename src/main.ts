import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import router from './router'
import { Toaster } from 'vue-sonner';
import './assets/css/main.css'

const app = createApp(App)
const head = createHead()
app.use(createPinia())
app.use(head)
app.component('Toaster', Toaster);
app.use(router)

router.isReady().then(() => {
  app.mount('#app')
  // Tell vite-plugin-prerender's headless-browser renderer (see
  // vite.config.ts, renderAfterDocumentEvent: 'app-rendered') that the
  // route has resolved and it's safe to snapshot the HTML.
  //
  // IMPORTANT: the renderer attaches its event listener via
  // page.evaluate() *after* page navigation finishes — which is often
  // after this code already ran and dispatched the event once. A
  // listener attached after the event already fired would never see
  // it, and the renderer would then wait forever (this is exactly what
  // caused every prerendered route to hang until Vercel's 45-minute
  // build timeout killed the whole build). The renderer has a built-in
  // check for exactly this race — window.__PRERENDER_STATUS
  // .__DOCUMENT_EVENT_RESOLVED — so we set that flag too, not just the
  // event, guaranteeing the renderer sees "already done" even if it
  // missed the live event. Harmless no-op outside of the prerender
  // build step.
  ;(window as any).__PRERENDER_STATUS = { __DOCUMENT_EVENT_RESOLVED: true }
  document.dispatchEvent(new Event('app-rendered'))
})