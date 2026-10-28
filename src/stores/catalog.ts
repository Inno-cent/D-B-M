// NEW FILE — src/stores/catalog.ts
//
// The storefront's single source of truth for products + categories, now
// loaded from Supabase instead of src/data/products.ts / categories.ts.
//
// The exported Product / ProductVariant / Category shapes are IDENTICAL to
// the old data-file interfaces, so components keep working unchanged apart
// from where they import from.
//
// How it loads:
//   • SSG build  — main.ts awaits load() before each page renders, so the
//                  prerendered HTML contains real product data (SEO), then
//                  embeds the result in the page as initial state.
//   • Browser    — main.ts hydrates from that embedded state (no flash, no
//                  extra request), then refresh() quietly re-fetches so names,
//                  images and descriptions are current even if the site hasn't
//                  been republished since an admin edit.
//   • npm run dev — no embedded state, so main.ts awaits load() before mount.

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export interface ProductVariant {
  slug: string
  brand: string
  size: string
  image?: string
}

export interface Product {
  name: string
  slug: string
  icon: string
  image: string
  type: 'export' | 'local'
  categories: string[]
  family?: string
  detail: string
  tagline: string
  description: string
  specs: { key: string; value: string }[]
  applications: string[]
  variants?: ProductVariant[]
}

export interface Category {
  slug: string
  label: string
  image: string
}

export const NO_IMAGE = 'https://placehold.co/600x600/f5f0e8/8a7f6c?text=No+image'

interface CatalogSnapshot {
  products: Product[]
  categories: Category[]
}

// During `vite-ssg build` every route renders in the same Node process, so
// fetch once and reuse instead of hitting Supabase ~70 times.
let ssrCache: Promise<CatalogSnapshot> | null = null

const fetchCatalog = async (): Promise<CatalogSnapshot> => {
  const [cats, prods, vars] = await Promise.all([
    supabase
      .from('categories')
      .select('slug,label,image_url,sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('products')
      .select(
        'slug,name,icon,image_url,type,categories,family,detail,tagline,description,specs,applications,sort_order',
      )
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('product_variants')
      .select('slug,product_slug,brand,size,image_url,sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
  ])
  if (cats.error) throw cats.error
  if (prods.error) throw prods.error
  if (vars.error) throw vars.error

  const variantsByProduct = new Map<string, ProductVariant[]>()
  for (const v of vars.data ?? []) {
    const list = variantsByProduct.get(v.product_slug) ?? []
    list.push({
      slug: v.slug,
      brand: v.brand,
      size: v.size,
      ...(v.image_url ? { image: v.image_url } : {}),
    })
    variantsByProduct.set(v.product_slug, list)
  }

  const products: Product[] = (prods.data ?? []).map((p) => {
    const variants = variantsByProduct.get(p.slug)
    return {
      name: p.name,
      slug: p.slug,
      icon: p.icon ?? '',
      image: p.image_url || NO_IMAGE,
      type: p.type === 'export' ? 'export' : 'local',
      categories: p.categories ?? [],
      ...(p.family ? { family: p.family } : {}),
      detail: p.detail ?? '',
      tagline: p.tagline ?? '',
      description: p.description ?? '',
      specs: Array.isArray(p.specs) ? p.specs : [],
      applications: p.applications ?? [],
      ...(variants && variants.length ? { variants } : {}),
    }
  })

  const categories: Category[] = (cats.data ?? []).map((c) => ({
    slug: c.slug,
    label: c.label,
    image: c.image_url || NO_IMAGE,
  }))

  return { products, categories }
}

export const useCatalogStore = defineStore('catalog', () => {
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const loaded = ref(false)
  const error = ref<string | null>(null)

  const apply = (snap: CatalogSnapshot) => {
    products.value = snap.products
    categories.value = snap.categories
    loaded.value = true
    error.value = null
  }

  /** Fetch (build + dev). Throws on failure so a broken build fails loudly. */
  const load = async () => {
    const snap = await (import.meta.env.SSR
      ? (ssrCache ??= fetchCatalog())
      : fetchCatalog())
    apply(snap)
  }

  /** Background re-fetch in the browser. Never throws; keeps old data on failure. */
  const refresh = async () => {
    try {
      apply(await fetchCatalog())
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to refresh catalog'
    }
  }

  const serialize = (): CatalogSnapshot => ({
    products: products.value,
    categories: categories.value,
  })

  const hydrate = (snap: CatalogSnapshot) => apply(snap)

  const productBySlug = (slug: string) => products.value.find((p) => p.slug === slug)

  return { products, categories, loaded, error, load, refresh, serialize, hydrate, productBySlug }
})
