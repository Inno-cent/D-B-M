// NEW FILE — src/stores/adminCatalog.ts
//
// Admin-only data layer for the catalog: reads EVERYTHING (hidden products,
// inactive variants/categories) and writes products, variants, categories,
// prices and images. Row-level security (catalog_schema.sql) is what really
// restricts these writes to admins; this store just does the work.
//
// Kept separate from stores/catalog.ts, which is the public, published-only
// view the storefront (and the prerender) uses.

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'

export const IMAGE_BUCKET = 'product-images'

export interface AdminCategory {
  slug: string
  label: string
  image_url: string | null
  sort_order: number
  is_active: boolean
}

export interface AdminProductRow {
  slug: string
  name: string
  icon: string
  image_url: string | null
  type: 'export' | 'local'
  categories: string[]
  family: string | null
  detail: string
  tagline: string
  description: string
  specs: { key: string; value: string }[]
  applications: string[]
  is_published: boolean
  sort_order: number
  updated_at: string | null
}

export interface AdminVariantRow {
  slug: string
  product_slug: string
  brand: string
  size: string
  image_url: string | null
  sort_order: number
  is_active: boolean
}

export interface AdminPriceRow {
  product_slug: string
  product_name: string
  price_ngn: number
  unit: string
  min_qty: number
  is_available: boolean
}

/** What the product form edits. Prices are attached to each sellable item. */
export interface ProductFormVariant {
  slug: string
  brand: string
  size: string
  image_url: string | null
  is_active: boolean
  isNew: boolean
  price_ngn: number
  unit: string
  min_qty: number
  is_available: boolean
}

export interface ProductForm {
  isNew: boolean
  slug: string
  name: string
  icon: string
  image_url: string | null
  type: 'export' | 'local'
  categories: string[]
  family: string
  detail: string
  tagline: string
  description: string
  specs: { key: string; value: string }[]
  applications: string[]
  is_published: boolean
  sort_order: number
  // Used when the product has no variants (a single sellable item):
  price_ngn: number
  unit: string
  min_qty: number
  is_available: boolean
  variants: ProductFormVariant[]
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Matches the existing convention: maize--5kg, veg-oil--power-oil-pure--1-4l */
export const suggestVariantSlug = (productSlug: string, brand: string, size: string) => {
  const b = slugify(brand)
  const sz = slugify(size)
  const parts = [productSlug]
  if (b && b !== productSlug) parts.push(b)
  if (sz) parts.push(sz)
  return parts.join('--')
}

/** The cart/order display name for a variant — same format the product page uses. */
export const variantDisplayName = (productName: string, brand: string, size: string) =>
  `${productName} — ${brand} (${size})`

const SLUG_RE = /^[a-z0-9]+(?:-{1,2}[a-z0-9]+)*$/

export const validateForm = (f: ProductForm): string | null => {
  if (!f.name.trim()) return 'Product name is required.'
  if (!SLUG_RE.test(f.slug)) return 'Slug may only use lowercase letters, numbers and hyphens.'
  const specsOk = f.specs.every((s) => (s.key.trim() === '') === (s.value.trim() === ''))
  if (!specsOk) return 'Each spec needs both a label and a value (or delete the empty row).'
  if (f.type === 'local') {
    if (f.variants.length > 0) {
      const seen = new Set<string>()
      for (const v of f.variants) {
        if (!v.brand.trim() || !v.size.trim()) return 'Every variant needs a brand and a size.'
        if (!SLUG_RE.test(v.slug)) return `Variant slug "${v.slug}" is not valid.`
        if (seen.has(v.slug)) return `Two variants share the slug "${v.slug}".`
        seen.add(v.slug)
        if (!(v.price_ngn > 0)) return `Set a price for ${v.brand} (${v.size}).`
        if (!v.unit.trim()) return `Set a unit for ${v.brand} (${v.size}).`
        if (!(v.min_qty >= 1)) return `Minimum quantity for ${v.brand} (${v.size}) must be at least 1.`
      }
    } else {
      if (!(f.price_ngn > 0)) return 'Set a price (or add variants and price those instead).'
      if (!f.unit.trim()) return 'Set a unit, e.g. kg, bag, piece.'
      if (!(f.min_qty >= 1)) return 'Minimum quantity must be at least 1.'
    }
  }
  return null
}

const friendly = (e: unknown, what: string): Error => {
  const err = e as { code?: string; message?: string }
  if (err?.code === '23505') return new Error(`${what}: that slug already exists. Choose a different one.`)
  if (err?.code === '42501' || /row-level security/i.test(err?.message ?? ''))
    return new Error(`${what}: not allowed. Are you signed in as an admin?`)
  return new Error(`${what}: ${err?.message ?? 'unknown error'}`)
}

// Shrink big photos before upload: max 1200px on the long edge, WebP.
const compressImage = async (file: File): Promise<{ blob: Blob; ext: string }> => {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.')
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return { blob: file, ext: file.type === 'image/gif' ? 'gif' : 'svg' }
  try {
    const bmp = await createImageBitmap(file)
    const scale = Math.min(1, 1200 / Math.max(bmp.width, bmp.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bmp.width * scale)
    canvas.height = Math.round(bmp.height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('no canvas')
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height)
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, 'image/webp', 0.86))
    if (blob && blob.size < file.size) return { blob, ext: 'webp' }
  } catch {
    /* fall through to the original file */
  }
  return { blob: file, ext: (file.name.split('.').pop() || 'jpg').toLowerCase() }
}

export const useAdminCatalogStore = defineStore('adminCatalog', () => {
  const products = ref<AdminProductRow[]>([])
  const variants = ref<AdminVariantRow[]>([])
  const categories = ref<AdminCategory[]>([])
  const prices = ref<AdminPriceRow[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const [p, v, c, pr] = await Promise.all([
        supabase.from('products').select('*').order('sort_order', { ascending: true }),
        supabase.from('product_variants').select('*').order('sort_order', { ascending: true }),
        supabase.from('categories').select('*').order('sort_order', { ascending: true }),
        supabase
          .from('product_prices')
          .select('product_slug,product_name,price_ngn,unit,min_qty,is_available'),
      ])
      for (const r of [p, v, c, pr]) if (r.error) throw r.error
      products.value = (p.data ?? []) as AdminProductRow[]
      variants.value = (v.data ?? []) as AdminVariantRow[]
      categories.value = (c.data ?? []) as AdminCategory[]
      prices.value = (pr.data ?? []).map((r) => ({ ...r, price_ngn: Number(r.price_ngn) })) as AdminPriceRow[]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load the catalog'
    } finally {
      loading.value = false
    }
  }

  // ── Form <-> rows ───────────────────────────────────────────────
  const blankForm = (): ProductForm => ({
    isNew: true,
    slug: '',
    name: '',
    icon: '🛒',
    image_url: null,
    type: 'local',
    categories: [],
    family: '',
    detail: '',
    tagline: '',
    description: '',
    specs: [],
    applications: [],
    is_published: true,
    sort_order: (products.value.reduce((m, p) => Math.max(m, p.sort_order), 0) || 0) + 10,
    price_ngn: 0,
    unit: 'kg',
    min_qty: 1,
    is_available: true,
    variants: [],
  })

  const formFor = (slug: string): ProductForm | null => {
    const p = products.value.find((x) => x.slug === slug)
    if (!p) return null
    const priceOf = (s: string) => prices.value.find((r) => r.product_slug === s)
    const own = priceOf(p.slug)
    return {
      isNew: false,
      slug: p.slug,
      name: p.name,
      icon: p.icon,
      image_url: p.image_url,
      type: p.type,
      categories: [...p.categories],
      family: p.family ?? '',
      detail: p.detail,
      tagline: p.tagline,
      description: p.description,
      specs: p.specs.map((s) => ({ ...s })),
      applications: [...p.applications],
      is_published: p.is_published,
      sort_order: p.sort_order,
      price_ngn: own?.price_ngn ?? 0,
      unit: own?.unit ?? 'kg',
      min_qty: own?.min_qty ?? 1,
      is_available: own?.is_available ?? true,
      variants: variants.value
        .filter((v) => v.product_slug === p.slug)
        .map((v) => {
          const pr = priceOf(v.slug)
          return {
            slug: v.slug,
            brand: v.brand,
            size: v.size,
            image_url: v.image_url,
            is_active: v.is_active,
            isNew: false,
            price_ngn: pr?.price_ngn ?? 0,
            unit: pr?.unit ?? 'kg',
            min_qty: pr?.min_qty ?? 1,
            is_available: pr?.is_available ?? true,
          }
        }),
    }
  }

  // ── Save a product (+ variants + prices) ────────────────────────
  const saveProduct = async (f: ProductForm) => {
    const problem = validateForm(f)
    if (problem) throw new Error(problem)
    const auth = useAuthStore()

    const row = {
      name: f.name.trim(),
      icon: f.icon.trim(),
      image_url: f.image_url,
      type: f.type,
      categories: f.categories,
      family: f.family.trim() || null,
      detail: f.detail.trim(),
      tagline: f.tagline.trim(),
      description: f.description.trim(),
      specs: f.specs.filter((s) => s.key.trim() && s.value.trim()).map((s) => ({ key: s.key.trim(), value: s.value.trim() })),
      applications: f.applications.map((a) => a.trim()).filter(Boolean),
      is_published: f.is_published,
      sort_order: f.sort_order,
    }

    // 1) the product
    if (f.isNew) {
      const { error: e } = await supabase.from('products').insert({ slug: f.slug, ...row })
      if (e) throw friendly(e, 'Could not create the product')
    } else {
      const { error: e } = await supabase.from('products').update(row).eq('slug', f.slug)
      if (e) throw friendly(e, 'Could not save the product')
    }

    // 2) variants
    const variantRows = f.variants.map((v, i) => ({
      slug: v.slug,
      product_slug: f.slug,
      brand: v.brand.trim(),
      size: v.size.trim(),
      image_url: v.image_url,
      sort_order: (i + 1) * 10,
      is_active: v.is_active,
    }))
    for (const v of f.variants) {
      const r = variantRows.find((x) => x.slug === v.slug)!
      const { error: e } = v.isNew
        ? await supabase.from('product_variants').insert(r)
        : await supabase
            .from('product_variants')
            .update({ brand: r.brand, size: r.size, image_url: r.image_url, sort_order: r.sort_order, is_active: r.is_active })
            .eq('slug', v.slug)
      if (e) throw friendly(e, `Could not save variant ${v.slug}`)
    }

    // 3) prices (only for sellable local items, and only when new or changed)
    if (f.type === 'local') {
      const wanted: AdminPriceRow[] =
        f.variants.length > 0
          ? f.variants.map((v) => ({
              product_slug: v.slug,
              product_name: variantDisplayName(f.name.trim(), v.brand.trim(), v.size.trim()),
              price_ngn: v.price_ngn,
              unit: v.unit.trim(),
              min_qty: v.min_qty,
              is_available: v.is_available,
            }))
          : [
              {
                product_slug: f.slug,
                product_name: f.name.trim(),
                price_ngn: f.price_ngn,
                unit: f.unit.trim(),
                min_qty: f.min_qty,
                is_available: f.is_available,
              },
            ]
      for (const w of wanted) {
        const cur = prices.value.find((p) => p.product_slug === w.product_slug)
        const same =
          cur &&
          cur.product_name === w.product_name &&
          cur.price_ngn === w.price_ngn &&
          cur.unit === w.unit &&
          cur.min_qty === w.min_qty &&
          cur.is_available === w.is_available
        if (same) continue
        const { error: e } = await supabase
          .from('product_prices')
          .upsert({ ...w, updated_by: auth.user?.id ?? null }, { onConflict: 'product_slug' })
        if (e) throw friendly(e, `Saved the product, but could not save the price for ${w.product_slug}`)
      }
    }

    await fetchAll()
  }

  const setPublished = async (slug: string, is_published: boolean) => {
    const { error: e } = await supabase.from('products').update({ is_published }).eq('slug', slug)
    if (e) throw friendly(e, 'Could not update the product')
    const p = products.value.find((x) => x.slug === slug)
    if (p) p.is_published = is_published
  }

  // ── Categories ──────────────────────────────────────────────────
  const saveCategory = async (c: AdminCategory, isNew: boolean) => {
    const payload = { label: c.label.trim(), image_url: c.image_url, sort_order: c.sort_order, is_active: c.is_active }
    if (!payload.label) throw new Error('Category name is required.')
    if (isNew) {
      if (!SLUG_RE.test(c.slug)) throw new Error('Slug may only use lowercase letters, numbers and hyphens.')
      const { error: e } = await supabase.from('categories').insert({ slug: c.slug, ...payload })
      if (e) throw friendly(e, 'Could not create the category')
    } else {
      const { error: e } = await supabase.from('categories').update(payload).eq('slug', c.slug)
      if (e) throw friendly(e, 'Could not save the category')
    }
    await fetchAll()
  }

  const productsInCategory = (slug: string) => products.value.filter((p) => p.categories.includes(slug)).length

  const deleteCategory = async (slug: string) => {
    const n = productsInCategory(slug)
    if (n > 0) throw new Error(`${n} product(s) still use this category. Remove it from them first, or just hide the category.`)
    const { error: e } = await supabase.from('categories').delete().eq('slug', slug)
    if (e) throw friendly(e, 'Could not delete the category')
    await fetchAll()
  }

  // ── Images ──────────────────────────────────────────────────────
  /** Resizes + uploads to the product-images bucket; returns its public URL. */
  const uploadImage = async (file: File, baseName: string): Promise<string> => {
    const { blob, ext } = await compressImage(file)
    const path = `catalog/${slugify(baseName) || 'image'}-${Date.now()}.${ext}`
    const { error: e } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, blob, { contentType: blob.type || undefined, cacheControl: '31536000', upsert: false })
    if (e) throw friendly(e, 'Image upload failed')
    return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl
  }

  // ── Publish (redeploy so prerendered pages pick up the edits) ───
  const publishSite = async () => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) throw new Error('You are signed out. Sign in again.')
    const res = await fetch('/api/publish-site', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body.error || 'Could not start the publish.')
  }

  return {
    products, variants, categories, prices, loading, error,
    fetchAll, blankForm, formFor, saveProduct, setPublished,
    saveCategory, deleteCategory, productsInCategory,
    uploadImage, publishSite,
  }
})
