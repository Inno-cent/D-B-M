// Generates public/sitemap.xml from scripts/static-routes.mjs.
//
// Run manually with `node scripts/generate-sitemap.mjs`, or wire it
// into package.json, e.g.:
//   "prebuild": "node scripts/generate-sitemap.mjs"
// so the sitemap regenerates every time you run `npm run build`.
//
// Re-run this whenever PRODUCT_SLUGS / MEAL_KIT_SLUGS / BLOG_SLUGS in
// static-routes.mjs change (or better: once product/meal-kit/blog data
// moves to Supabase, replace the imports below with real DB queries).

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  STATIC_ROUTES,
  PRODUCT_SLUGS,
  MEAL_KIT_SLUGS,
  BLOG_SLUGS,
} from './static-routes.mjs'

const SITE_URL = 'https://orenag.com'
const today = new Date().toISOString().slice(0, 10)

/** @typedef {{ path: string, priority: number, changefreq: string }} SitemapEntry */

/** @type {SitemapEntry[]} */
const entries = [
  ...STATIC_ROUTES,
  ...PRODUCT_SLUGS.map((slug) => ({
    path: `/products/${slug}`,
    priority: 0.8,
    changefreq: 'weekly',
  })),
  ...MEAL_KIT_SLUGS.map((slug) => ({
    path: `/meal-kits/${slug}`,
    priority: 0.8,
    changefreq: 'weekly',
  })),
  ...BLOG_SLUGS.map((slug) => ({
    path: `/blog/${slug}`,
    priority: 0.6,
    changefreq: 'monthly',
  })),
]

const urlset = entries
  .map(
    (e) => `  <url>
    <loc>${SITE_URL}${e.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
  </url>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`

const outPath = fileURLToPath(new URL('../public/sitemap.xml', import.meta.url))
writeFileSync(outPath, xml, 'utf-8')
console.log(`✓ Wrote ${entries.length} URLs to public/sitemap.xml`)
