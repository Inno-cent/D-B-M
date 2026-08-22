import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// ── Storage helpers ───────────────────────────────────────────

const STORAGE_BASE = `${supabaseUrl}/storage/v1/object/public/product-images`

/**
 * Get the public URL for a product image by slug.
 * Example: getProductImageUrl('rice') →
 * https://your-ref.supabase.co/storage/v1/object/public/product-images/rice.jpg
 */
export const getProductImageUrl = (slug: string, ext = 'jpg'): string => {
  return `${STORAGE_BASE}/${slug}.${ext}`
}

/**
 * Get image URL with a cache-busting timestamp.
 * Use this after uploading a new image so the browser
 * doesn't serve the old cached version.
 */
export const getProductImageUrlFresh = (slug: string, ext = 'jpg'): string => {
  return `${STORAGE_BASE}/${slug}.${ext}?t=${Date.now()}`
}

/**
 * Get the full public URL for any file in the product-images bucket.
 * Use this when the filename doesn't follow the slug pattern.
 */
export const getStorageUrl = (filename: string): string => {
  return `${STORAGE_BASE}/${filename}`
}
