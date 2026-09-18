// Plain-JS route list shared by vite.config.ts (prerendering) and
// scripts/generate-sitemap.mjs (sitemap.xml). Deliberately NOT importing
// from src/data/*.ts here: those files import image assets, which only
// resolve inside Vite's own module graph — importing them from a plain
// Node script (or from vite.config.ts's own bundling step) would break.
// So the product/meal-kit/blog slugs below are copied out by hand.
// If you add/remove a product, meal kit, or blog post, update the
// matching array here too.

// Top-level product slugs from src/data/products.ts (`products[].slug`
// only — NOT the nested `variants[].slug` values, since variants aren't
// separate routes, just price/cart line items on the parent's page).
export const PRODUCT_SLUGS = [
  'palm-oil', 'maize', 'beans', 'onions', 'cassava', 'garri', 'wheat',
  'okra', 'tomato', 'chili-pepper', 'green-peas', 'carrot', 'fresh-pepper',
  'green-pepper', 'spring-onions', 'corn', 'ginger', 'cocoa-beans',
  'groundnut', 'soyabeans', 'shea-butter', 'rice-parboiled', 'rice-basmati',
  'semovita', 'semolina', 'spaghetti', 'milk-powder', 'milk-evaporated',
  'sugar', 'salt', 'tomato-paste-sachet', 'tomato-paste-tin', 'corned-beef',
  'vegetable-oil', 'curry-powder', 'thyme', 'pepper-powder',
  'ginger-powder', 'garlic-powder', 'seasoning-cubes',
  'chicken-seasoning-powder', 'coconut-milk-cream', 'canned-vegetables',
]

// From src/data/mealKits.ts
export const MEAL_KIT_SLUGS = [
  'jollof-rice-kit', 'egusi-soup-kit', 'fried-rice-kit', 'pepper-soup-kit',
  'efo-riro-kit',
]

// From the `posts` array hardcoded in src/views/BlogView.vue, plus the
// featured post linked from the hero. NOTE: BlogPostView.vue currently
// has no real content store of its own — it derives a title from the
// slug — so these pages exist as routes but are thin. Move this list to
// a real data file (or Supabase) once blog content is fleshed out, and
// generate this array from that source instead.
export const BLOG_SLUGS = [
  'importing-sesame-seeds-nigeria',
  'hibiscus-export-standards',
  'wholesale-palm-oil-nigeria',
  'fob-vs-cif',
  'ginger-supply-season',
  'export-documentation',
  'maize-sourcing-nigeria',
]

// Static (non-dynamic) routes worth prerendering/listing in the
// sitemap. Excludes auth, dashboard, checkout, orders, admin, cart,
// and not-found — those are either gated, per-user, or noindexed.
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

export function allPrerenderRoutes() {
  return [
    ...STATIC_ROUTES.map((r) => r.path),
    ...PRODUCT_SLUGS.map((s) => `/products/${s}`),
    ...MEAL_KIT_SLUGS.map((s) => `/meal-kits/${s}`),
    ...BLOG_SLUGS.map((s) => `/blog/${s}`),
  ]
}
