/**
 * useSeo — shared SEO composable for OrenAg.
 *
 * Wraps @vueuse/head's `useHead` and fills in sensible site-wide
 * defaults (title suffix, canonical base URL, OG/Twitter tags) so every
 * view only has to supply what's actually different about that page.
 *
 * Usage (static page):
 *   useSeo({
 *     title: 'About Us',
 *     description: 'Learn how OrenAg connects...',
 *     path: '/about',
 *   })
 *
 * Usage (dynamic page — pass a getter/computed so it re-runs on route change):
 *   useSeo(() => ({
 *     title: product.value?.name ?? 'Product',
 *     description: product.value?.description,
 *     path: `/products/${product.value?.slug ?? ''}`,
 *     image: product.value?.image,
 *     type: 'product',
 *     jsonLd: product.value ? buildProductJsonLd(product.value) : undefined,
 *   }))
 */
import { useHead } from '@vueuse/head'
import { computed, unref, type MaybeRef } from 'vue'

// ── Site-wide constants ──────────────────────────────────────────
// NOTE: social links are placeholders — swap in the real profile URLs
// once they exist. Remove any that never will.
export const SITE_NAME = 'OrenAg'
export const SITE_URL = 'https://orenag.com'
export const DEFAULT_DESCRIPTION =
  'OrenAg connects international buyers and Nigerian businesses with verified suppliers of agricultural commodities, wholesale groceries, and meal kits.'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`
export const TWITTER_HANDLE = '@orenag'
export const SOCIAL_LINKS = [
  'https://x.com/orenag',
  'https://facebook.com/orenag',
  'https://instagram.com/orenag',
  'https://linkedin.com/company/orenag',
]

export type SeoOgType = 'website' | 'article' | 'product'

export interface SeoOptions {
  /** Page title. The site name is appended automatically unless it's already present. */
  title: string
  description?: string
  /** Path relative to the domain root, e.g. '/products/palm-oil'. Used to build the canonical URL and og:url. */
  path?: string
  /** Absolute image URL for OG/Twitter cards. Falls back to DEFAULT_OG_IMAGE. */
  image?: string
  type?: SeoOgType
  /** Set true for auth/admin/cart/checkout/thin placeholder pages. */
  noindex?: boolean
  keywords?: string
  /** One JSON-LD object, or several (e.g. Product + BreadcrumbList). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  /** ISO 8601 — for article/blog pages. */
  publishedTime?: string
  modifiedTime?: string
}

export function useSeo(options: MaybeRef<SeoOptions> | (() => SeoOptions)) {
  const resolved = computed<SeoOptions>(() =>
    typeof options === 'function' ? (options as () => SeoOptions)() : unref(options),
  )

  useHead(
    computed(() => {
      const o = resolved.value
      const canonicalUrl = `${SITE_URL}${o.path ?? ''}`
      const description = o.description?.trim() || DEFAULT_DESCRIPTION
      const image = o.image || DEFAULT_OG_IMAGE
      const title = o.title.includes(SITE_NAME) ? o.title : `${o.title} | ${SITE_NAME}`
      const robotsContent = o.noindex ? 'noindex, nofollow' : 'index, follow'

      const jsonLdList = o.jsonLd ? (Array.isArray(o.jsonLd) ? o.jsonLd : [o.jsonLd]) : []

      return {
        title,
        meta: [
          { name: 'description', content: description },
          { name: 'robots', content: robotsContent },
          ...(o.keywords ? [{ name: 'keywords', content: o.keywords }] : []),

          // Open Graph
          { property: 'og:title', content: title },
          { property: 'og:description', content: description },
          { property: 'og:type', content: o.type ?? 'website' },
          { property: 'og:url', content: canonicalUrl },
          { property: 'og:image', content: image },
          { property: 'og:site_name', content: SITE_NAME },
          { property: 'og:locale', content: 'en_NG' },
          ...(o.publishedTime
            ? [{ property: 'article:published_time', content: o.publishedTime }]
            : []),
          ...(o.modifiedTime
            ? [{ property: 'article:modified_time', content: o.modifiedTime }]
            : []),

          // Twitter
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:site', content: TWITTER_HANDLE },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: description },
          { name: 'twitter:image', content: image },
        ],
        link: [{ rel: 'canonical', href: canonicalUrl }],
        script: jsonLdList.map((data) => ({
          type: 'application/ld+json',
          children: JSON.stringify(data),
        })),
      }
    }),
  )
}
