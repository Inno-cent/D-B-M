// Generates public/sitemap.xml. Runs automatically before every build
// ("prebuild" in package.json).
//
// CHANGED: product URLs now come from Supabase (published products only,
// with each product's real last-modified date) instead of a hand-copied list.

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  STATIC_ROUTES,
  MEAL_KIT_SLUGS,
  BLOG_SLUGS,
  fetchPublishedProducts,
} from './static-routes.mjs'

const SITE_URL = 'https://orenag.com'
const today = new Date().toISOString().slice(0, 10)

const products = await fetchPublishedProducts()

/** @typedef {{ path: string, priority: number, changefreq: string, lastmod?: string }} SitemapEntry */

/** @type {SitemapEntry[]} */
const entries = [
  ...STATIC_ROUTES,
  ...products.map((p) => ({
    path: `/products/${p.slug}`,
    priority: 0.8,
    changefreq: 'weekly',
    lastmod: p.updated_at ? p.updated_at.slice(0, 10) : undefined,
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
    <lastmod>${e.lastmod ?? today}</lastmod>
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
