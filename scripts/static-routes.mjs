// Route list shared by vite.config.ts (prerendering) and
// scripts/generate-sitemap.mjs (sitemap.xml).
//
// CHANGED: product slugs are no longer copied here by hand — they are
// fetched from Supabase (published products only) every time you build, so
// adding/hiding a product in the admin and republishing is all it takes.
// Meal-kit and blog slugs are still hand-maintained below.
//
// This file stays plain JS and deliberately does NOT import from src/ (those
// files import image assets that only resolve inside Vite's module graph).

import dotenv from 'dotenv'

// Same variables the app itself uses. On Vercel they come from the project
// environment; locally we read .env.local / .env.
if (!process.env.VITE_SUPABASE_URL) {
  dotenv.config({ path: '.env.local', quiet: true })
  dotenv.config({ path: '.env', quiet: true })
}

let cached = null

/**
 * Published products straight from Supabase's REST API (anon key — the
 * "published only" row-level-security policy applies, so hidden products can
 * never leak into the sitemap or the prerender list).
 * Fails the build loudly rather than silently shipping a site with no products.
 * @returns {Promise<{ slug: string, updated_at: string | null }[]>}
 */
export function fetchPublishedProducts() {
  if (cached) return cached
  cached = (async () => {
    const url = process.env.VITE_SUPABASE_URL
    const key = process.env.VITE_SUPABASE_ANON_KEY
    if (!url || !key) {
      throw new Error(
        'static-routes: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set, ' +
          'so product pages cannot be listed. Set them in .env.local (local) or in ' +
          'the Vercel project environment variables (deploys).',
      )
    }
    const res = await fetch(
      `${url}/rest/v1/products?select=slug,updated_at&is_published=eq.true&order=sort_order.asc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    )
    if (!res.ok) {
      throw new Error(`static-routes: Supabase returned ${res.status} ${await res.text()}`)
    }
    const rows = await res.json()
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error(
        'static-routes: Supabase returned 0 published products. Run supabase/catalog_seed.sql ' +
          'or publish at least one product before building.',
      )
    }
    return rows
  })()
  return cached
}

/** @returns {Promise<string[]>} */
export async function fetchProductSlugs() {
  return (await fetchPublishedProducts()).map((r) => r.slug)
}

// From src/data/mealKits.ts (meal kits are still static — update by hand)
export const MEAL_KIT_SLUGS = [
  'jollof-rice-kit', 'egusi-soup-kit', 'fried-rice-kit', 'pepper-soup-kit',
  'efo-riro-kit',
]

// From the `posts` array hardcoded in src/views/BlogView.vue, plus the
// featured post linked from the hero.
export const BLOG_SLUGS = [
  'importing-sesame-seeds-nigeria',
  'hibiscus-export-standards',
  'wholesale-palm-oil-nigeria',
  'fob-vs-cif',
  'ginger-supply-season',
  'export-documentation',
  'maize-sourcing-nigeria',
]

// Static (non-dynamic) routes worth prerendering/listing in the sitemap.
// Excludes auth, dashboard, checkout, orders, admin, cart, not-found.
export const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/products', priority: 0.9, changefreq: 'daily' },
  { path: '/meal-kits', priority: 0.9, changefreq: 'weekly' },
  { path: '/deals', priority: 0.5, changefreq: 'daily' },
  { path: '/recipes', priority: 0.5, changefreq: 'weekly' },
  { path: '/how-it-works', priority: 0.7, changefreq: 'monthly' },
  { path: '/supplier-network', priority: 0.7, changefreq: 'monthly' },
  { path: '/request-quote', priority: 0.8, changefreq: 'monthly' },
  { path: '/blog', priority: 0.7, changefreq: 'weekly' },
  { path: '/about', priority: 0.6, changefreq: 'monthly' },
  { path: '/contact', priority: 0.6, changefreq: 'monthly' },
  { path: '/terms', priority: 0.3, changefreq: 'yearly' },
  { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
]

/** @returns {Promise<string[]>} */
export async function allPrerenderRoutes() {
  const productSlugs = await fetchProductSlugs()
  return [
    ...STATIC_ROUTES.map((r) => r.path),
    ...productSlugs.map((s) => `/products/${s}`),
    ...MEAL_KIT_SLUGS.map((s) => `/meal-kits/${s}`),
    ...BLOG_SLUGS.map((s) => `/blog/${s}`),
  ]
}
