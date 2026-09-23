import { fileURLToPath, URL } from 'node:url'
import { createRequire } from 'node:module'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { allPrerenderRoutes } from './scripts/static-routes.mjs'

// vite-plugin-prerender's own dist/index.mjs is broken as of v1.0.8 — it
// `import`s at the top but calls raw `require(...)` further down, which
// only works in CommonJS. Since this project's package.json has
// "type": "module", Vite loads vite.config.ts as ESM and Node's ESM
// loader has no `require`, so `import Prerender from 'vite-plugin-prerender'`
// crashes with "require is not defined in ES module scope". Loading the
// package's dist/index.cjs directly via createRequire sidesteps their
// broken .mjs file entirely and works fine.
const require = createRequire(import.meta.url)
const Prerender = require('vite-plugin-prerender')

// vite-plugin-prerender depends on a VERY old, unmaintained
// @prerenderer/renderer-puppeteer@0.2.0, which in turn bundles
// Puppeteer 1.20.0 (from 2019) and its own long-stale Chromium build.
// That old Chromium binary is dynamically linked against system
// libraries (libnss3, libatk, etc.) that Vercel's minimal build
// container doesn't ship, so it fails to launch there with
// "Unable to start Puppeteer" even though it works fine on a normal
// dev machine. @sparticuz/chromium ships a Chromium build compiled
// specifically for serverless/CI containers like Vercel's and AWS
// Lambda's, with no missing-library issues — we hand its binary to
// the same old Puppeteer client instead of letting it use its own.
// Only kicks in when VERCEL is set (i.e. an actual Vercel build), so
// local dev keeps using Puppeteer's own bundled Chromium as before.
async function getPrerenderLaunchOverrides() {
  if (!process.env.VERCEL) return {}
  const { default: chromium } = await import('@sparticuz/chromium')
  return {
    executablePath: await chromium.executablePath(),
    args: chromium.args,
  }
}

// https://vite.dev/config/
export default defineConfig(async ({ command }) => {
  const prerenderLaunchOverrides =
    command === 'build' ? await getPrerenderLaunchOverrides() : {}

  return {
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
      // Prerendering only matters for the production build — running it
      // in `vite dev` would spin up a headless Chromium on every save.
      // vite-plugin-prerender renders each route in a real browser after
      // `vite build` finishes and writes the resulting HTML (with the
      // useHead()-generated title/meta/canonical/JSON-LD already baked
      // in) to dist/<route>/index.html, so crawlers that don't execute
      // JS still see full per-page SEO tags.
      //
      // Only static + known dynamic-by-slug routes are listed (see
      // scripts/static-routes.mjs) — routes gated by auth
      // (dashboard/checkout/orders/admin) or that are inherently
      // per-user (cart) are deliberately left out since there's nothing
      // useful to prerender for a logged-out crawler there.
      command === 'build' &&
        Prerender({
          staticDir: fileURLToPath(new URL('./dist', import.meta.url)),
          routes: allPrerenderRoutes(),
          renderer: new Prerender.PuppeteerRenderer({
            renderAfterDocumentEvent: 'app-rendered',
            maxConcurrentRoutes: 4,
            headless: true,
            // FIX: this old renderer has no default timeout for
            // renderAfterDocumentEvent, so if the 'app-rendered' signal
            // is ever missed (e.g. the Puppeteer 1.20.0 <-> modern
            // Chromium CDP version skew when running on Vercel with
            // @sparticuz/chromium), the page just hangs forever and
            // stalls the whole maxConcurrentRoutes:4 queue behind it —
            // which is what was silently eating the full 45-minute
            // Vercel build cap. Capping each route at 30s turns that
            // into a loud "route X failed after timeout" per route
            // instead of one silent full-build death.
            timeout: 30000,
            // Spread AFTER headless/timeout so executablePath/args
            // (when on Vercel) take effect; this old renderer passes
            // every one of these options straight through to
            // puppeteer.launch().
            ...prerenderLaunchOverrides,
          }),
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  }
})