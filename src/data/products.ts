import palmOilImg from '@/assets/PO600.png'
import GingerImg from '@/assets/GR600.png'
import cocoaimg from '@/assets/cocoa.png'
import groundnut from '@/assets/groundnut.png'
import beans from '@/assets/beans.png'
import cassava from '@/assets/cassava.jpg'
import soyabeans from '@/assets/soyabeans.jpg'
import garri from '@/assets/garri.jpg'
import SBIMG from '@/assets/SB600.png'
import springonions from '@/assets/springonions.jpg'
import carrot from '@/assets/carrot.jpg'
import chili from '@/assets/chili.jpg'
import driedchili from '@/assets/driedchili.jpg'
import freshpeppers from '@/assets/freshpeppers.jpg'
import greenpepper from '@/assets/greenpepper.jpg'
import greenpeas from '@/assets/greenpeas.jpg'
import okra from '@/assets/okra.jpg'
import tomato from '@/assets/tomato.jpg'
import corn from '@/assets/corn.jpg'

import { getProductImageUrl } from '@/lib/supabase'

// ================================================================
// DATA MODEL CHANGE (this revision):
//   category: string  ->  categories: string[]
//   + optional `family` field (groups related forms of the same
//     conceptual product for cross-linking, e.g. fresh Tomato <->
//     Tomato Paste — Sachet <-> Tomato Paste — Pouch & Tin)
//   + optional `variants` field (brand + size SKUs — each variant's
//     `slug` is what actually gets priced in product_prices and added
//     to the cart, same composite-slug pattern already used for meal
//     kits: parent product = one detail page, variant = one purchasable
//     line, zero changes needed to CartItem or checkout)
//   + `ProductVariant.image` (optional) — each brand+size variant can
//     carry its own photo, so the detail page swaps the shown image
//     when a different brand or size is picked.
//
// NEW this revision:
//   - Maize, Garri, Soyabeans, and Palm Oil converted from single-SKU
//     bulk-MT/litre products into size-variant products (no brand yet
//     — `variant.brand` just repeats the product name as a placeholder
//     until real brands are added; `variant.size` carries the actual
//     kg/litre option). Soyabeans also switches `type` from 'export'
//     to 'local' since it's now directly purchasable.
//   - Onions, Cassava, Carrot, Green Pepper, Chili Pepper, Dried Chili
//     Pepper, Fresh Pepper, Green Peas, Spring Onions, Okra, Tomato,
//     and corn switch to per-piece retail pricing (see the paired SQL
//     file — price is set there, not here). Their `detail` line and
//     "Min. Order" spec are updated to say "Sold per piece" instead of
//     the old bulk-MT wholesale copy, since that copy would otherwise
//     contradict the new pricing model.
//   - Every grouped/variant product's top-level `image` (previously a
//     generic placehold.co box, e.g. "Basmati Rice") now points at one
//     of its real variant photos instead, so product grids and
//     "related products" thumbnails (which read `product.image`
//     directly, not the selected variant) show a real sample photo
//     rather than a gray placeholder. The detail page itself already
//     showed a real photo on load via `displayImage` defaulting to the
//     first variant — this fixes the other places that still read
//     `product.image` directly.
//
// NEW this revision:
//   - No more `type: 'export'` products. Ginger, Cocoa Beans, Groundnut,
//     and Shea Butter (the last remaining export/quote-only items)
//     switch to `type: 'local'`, same as everything else in the
//     catalog. `'export'` is no longer used anywhere in products.ts,
//     but the `'export' | 'local'` union on `Product.type` is left in
//     place in case a future product needs it. The `export-commodities`
//     category tag is removed from all four (kept for Groundnut/Shea
//     Butter's other category, dropped entirely for Ginger since
//     'spices-seasonings' already covers it). Cocoa Beans had no
//     non-export category, so it now joins `legumes-nuts`. The
//     `export-commodities` category itself is removed from
//     categories.ts — see that file. Their real per-tonne/per-kg
//     prices still need seeding (see the paired SQL) — placeholder
//     ₦1,000 convention, same as the other pending variants.
// ================================================================

export interface ProductVariant {
  slug: string // unique — this is what's priced (product_prices.product_slug) and added to cart
  brand: string // brand + product line name. For not-yet-branded bulk items (Maize, Garri, Soyabeans, Palm Oil) this just repeats the product name until real brands are added.
  size: string // pack size, e.g. "5kg", "1L", "Sachet"
  // Optional — this variant's own photo (Supabase Storage via
  // getProductImageUrl). When present, selecting this variant on the
  // detail page swaps the shown image to this. When absent (no photo
  // taken yet), the detail page keeps showing the parent product's
  // placeholder image instead.
  image?: string
}

export interface Product {
  name: string
  slug: string
  icon: string
  image: string
  type: 'export' | 'local'
  // Matches slug(s) in data/categories.ts. A product can belong to more
  // than one category (e.g. Tomato Paste — Sachet is both a pantry
  // essential and a seasoning/cooking base).
  categories: string[]
  // Optional — groups related forms of the same conceptual product so
  // the UI can cross-link them (e.g. "Also available as: ..."). Forms
  // with genuinely different units/specs stay separate Product entries
  // rather than being merged into one record with multiple categories.
  family?: string
  detail: string
  tagline: string
  description: string
  specs: { key: string; value: string }[]
  applications: string[]
  // Optional — brand + size SKUs. When present, the product detail page
  // should show a brand/size picker; each variant is priced and added
  // to cart independently via its own slug. When absent, the product's
  // own top-level `slug` is priced/cartable directly, as before.
  variants?: ProductVariant[]
}

export const products: Product[] = [
  {
    name: 'Palm Oil',
    slug: 'palm-oil',
    icon: '🫒',
    // NOTE: reported as not displaying — check the exact filename/case
    // of the uploaded file in the Storage bucket against 'palm-oil.png'.
    image: getProductImageUrl('PO600', 'png'),
    type: 'local',
    categories: ['oils-fats'],
    detail: 'Red palm oil · Multiple litre sizes · South South',
    tagline:
      'Palm oil in the litre sizes households and small businesses buy most — specific brands coming soon.',
    description:
      'Red and refined palm oil in retail litre sizes for households and small food businesses across Nigeria. Sourced from mills in the South South and South East. Choose a size below; branded lines will be added as they become available.',
    specs: [
      { key: 'Origin', value: 'Delta, Rivers, Cross River' },
      { key: 'Grade', value: 'Red / Refined' },
      { key: 'FFA Level', value: 'Max 5%' },
      { key: 'Sizes available', value: '1L, 2L, 10L, 25L' },
      { key: 'Packaging', value: 'Bottle / Jerrycan' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Cooking', 'Food Processing', 'Soap Making', 'Distribution'],
    variants: [
      { slug: 'palm-oil--1l', brand: 'Palm Oil', size: '1L' },
      { slug: 'palm-oil--2l', brand: 'Palm Oil', size: '2L' },
      { slug: 'palm-oil--10l', brand: 'Palm Oil', size: '10L' },
      { slug: 'palm-oil--25l', brand: 'Palm Oil', size: '25L' },
    ],
  },
  {
    name: 'Maize',
    slug: 'maize',
    icon: '🌽',
    image: getProductImageUrl('corn', 'jpg'),
    type: 'local',
    categories: ['staples-grains'],
    detail: 'Dried · Multiple sizes · Plateau, Kaduna',
    tagline: 'Dried yellow maize for feed, flour, and food processing.',
    description:
      'Dried yellow maize sourced from farms in Plateau, Kaduna, and Kano. Used for animal feed production, flour milling, and food processing across Nigeria. Choose a bag size below.',
    specs: [
      { key: 'Origin', value: 'Plateau, Kaduna, Kano' },
      { key: 'Grade', value: 'Grade 1 (yellow)' },
      { key: 'Moisture', value: 'Max 13%' },
      { key: 'Sizes available', value: '5kg, 10kg, 15kg, 20kg, 50kg' },
      { key: 'Packaging', value: 'Jute bags' },
      { key: 'Peak Season', value: 'October – January' },
    ],
    applications: ['Animal Feed', 'Flour Milling', 'Food Processing', 'Starch Production'],
    variants: [
      { slug: 'maize--5kg', brand: 'Maize', size: '5kg' },
      { slug: 'maize--10kg', brand: 'Maize', size: '10kg' },
      { slug: 'maize--15kg', brand: 'Maize', size: '15kg' },
      { slug: 'maize--20kg', brand: 'Maize', size: '20kg' },
      { slug: 'maize--50kg', brand: 'Maize', size: '50kg' },
    ],
  },
  {
    name: 'Beans',
    slug: 'beans',
    icon: '🫘',
    image: getProductImageUrl('beans', 'png'),
    type: 'local',
    categories: ['legumes-nuts'],
    detail: 'Brown/White · Min. 5 MT · Ogun, Kwara',
    tagline: 'Quality Nigerian beans for wholesale food supply and distribution.',
    description:
      'Brown and white honey beans sourced from Ogun, Kwara, and Osun states. A staple protein source across Nigeria. Available in bulk for wholesale distribution and food processing.',
    specs: [
      { key: 'Origin', value: 'Ogun, Kwara, Osun' },
      { key: 'Variety', value: 'Brown / White Honey' },
      { key: 'Moisture', value: 'Max 12%' },
      { key: 'Min. Order', value: '5 Metric Tonnes' },
      { key: 'Packaging', value: '100kg jute bags' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Food Processing', 'Food Service', 'FMCG'],
  },
  {
    name: 'Onions',
    slug: 'onions',
    icon: '🧅',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80&fit=crop',
    type: 'local',
    categories: ['fresh-produce'],
    detail: 'Fresh · Sold per piece · Sokoto, Kebbi',
    tagline: 'Fresh Nigerian onions, sold individually.',
    description:
      'Large, pungent red onions from the Sokoto-Kebbi corridor — the largest onion producing zone in Nigeria. Sold per piece.',
    specs: [
      { key: 'Origin', value: 'Sokoto, Kebbi, Zamfara' },
      { key: 'Variety', value: 'Red bulb onion' },
      { key: 'Size', value: 'Medium to large' },
      { key: 'Min. Order', value: '1 piece' },
      { key: 'Packaging', value: 'Sold loose' },
      { key: 'Availability', value: 'Nov – Apr (peak)' },
    ],
    applications: ['Household', 'Food Service', 'Retail'],
  },
  {
    name: 'Cassava',
    slug: 'cassava',
    icon: '🍠',
    image: getProductImageUrl('cassava', 'jpg'),
    type: 'local',
    categories: ['staples-grains'],
    detail: 'Fresh · Sold per piece · Oyo, Benue',
    tagline: 'Fresh cassava tubers, sold individually.',
    description: 'Fresh cassava tubers sourced from Oyo, Benue, and Cross River. Sold per piece.',
    specs: [
      { key: 'Origin', value: 'Oyo, Benue, Cross River' },
      { key: 'Type', value: 'Fresh root' },
      { key: 'Starch Content', value: 'Min. 25%' },
      { key: 'Min. Order', value: '1 piece' },
      { key: 'Packaging', value: 'Sold loose' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Household', 'Garri Production', 'Food Processing'],
  },
  {
    name: 'Garri',
    slug: 'garri',
    icon: '🍚',
    // NOTE: reported as not displaying — check the exact filename/case
    // of the uploaded file in the Storage bucket against 'garri.jpg'.
    image: getProductImageUrl('garri', 'jpg'),
    type: 'local',
    categories: ['staples-grains'],
    detail: 'White/Yellow · Multiple sizes · Nationwide',
    tagline: "Nigeria's most popular staple food, in the bag sizes households buy most.",
    description:
      'Garri is a widely consumed Nigerian staple made from fermented, dried cassava. Available in white and yellow varieties. Choose a bag size below.',
    specs: [
      { key: 'Origin', value: 'South West / South East' },
      { key: 'Variety', value: 'White / Yellow (toasted)' },
      { key: 'Moisture', value: 'Max 10%' },
      { key: 'Sizes available', value: '5kg, 10kg, 15kg, 20kg, 50kg' },
      { key: 'Packaging', value: 'Bags' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Household', 'Food Service', 'Retail Distribution'],
    variants: [
      { slug: 'garri--5kg', brand: 'Garri', size: '5kg' },
      { slug: 'garri--10kg', brand: 'Garri', size: '10kg' },
      { slug: 'garri--15kg', brand: 'Garri', size: '15kg' },
      { slug: 'garri--20kg', brand: 'Garri', size: '20kg' },
      { slug: 'garri--50kg', brand: 'Garri', size: '50kg' },
    ],
  },
  {
    name: 'Wheat',
    slug: 'wheat',
    icon: '🌾',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80&fit=crop',
    type: 'local',
    categories: ['staples-grains'],
    detail: 'Hard Red · Min. 20 MT · Imported/Local',
    tagline: 'Wheat grain supply for flour mills and food manufacturers.',
    description:
      'Hard red wheat for flour milling and food manufacturing. Available from domestic sources in Borno and imported stock. Suitable for bread flour, pastry flour, and noodle production.',
    specs: [
      { key: 'Origin', value: 'Borno / Imported stock' },
      { key: 'Type', value: 'Hard Red Wheat' },
      { key: 'Protein', value: 'Min. 11%' },
      { key: 'Min. Order', value: '20 Metric Tonnes' },
      { key: 'Packaging', value: '50kg bags / Bulk' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Flour Milling', 'Bread Production', 'Noodles', 'Pastry Manufacturing'],
  },
  {
    name: 'Okra',
    slug: 'okra',
    icon: '🥬',
    image: getProductImageUrl('okra', 'jpg'),
    type: 'local',
    categories: ['soup-ingredients'],
    detail: 'Fresh · Sold per piece · Northern Nigeria',
    tagline: 'Fresh okra, sold individually.',
    description: 'Freshly harvested Nigerian okra, sold per piece for households and food service.',
    specs: [
      { key: 'Origin', value: 'Kaduna, Kano, Plateau' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Sold loose' },
      { key: 'Min. Order', value: '1 piece' },
      { key: 'Availability', value: 'Seasonal' },
      { key: 'Storage', value: 'Cool & Dry' },
    ],
    applications: ['Household', 'Retail', 'Food Service'],
  },
  {
    name: 'Tomato',
    slug: 'tomato',
    icon: '🍅',
    image: getProductImageUrl('tomato', 'jpg'),
    type: 'local',
    categories: ['fresh-produce'],
    family: 'tomato',
    detail: 'Fresh · Sold per piece · Kaduna, Kano',
    tagline: 'Fresh tomatoes, sold individually.',
    description:
      'Fresh Nigerian tomatoes, sold per piece. For the processed/packaged forms, see Tomato Paste — Sachet and Tomato Paste — Pouch & Tin.',
    specs: [
      { key: 'Origin', value: 'Kaduna, Kano' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Sold loose' },
      { key: 'Min. Order', value: '1 piece' },
      { key: 'Availability', value: 'Seasonal' },
      { key: 'Storage', value: 'Cool Environment' },
    ],
    applications: ['Household', 'Food Service', 'Retail'],
  },
  {
    name: 'Chili Pepper',
    slug: 'chili-pepper',
    icon: '🌶️',
    image: getProductImageUrl('chili', 'jpg'),
    type: 'local',
    categories: ['spices-seasonings'],
    detail: 'Fresh · Sold per piece',
    tagline: 'Fresh chili peppers, sold individually.',
    description:
      'Premium quality fresh chili peppers, sold per piece for households, restaurants, and small food businesses.',
    specs: [
      { key: 'Origin', value: 'Kaduna, Kano' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Sold loose' },
      { key: 'Min. Order', value: '1 piece' },
      { key: 'Availability', value: 'Seasonal' },
      { key: 'Storage', value: 'Refrigerated' },
    ],
    applications: ['Household', 'Retail', 'Restaurants'],
  },
  {
    name: 'Green Peas',
    slug: 'green-peas',
    icon: '🫛',
    image: getProductImageUrl('greenpeas', 'jpg'),
    type: 'local',
    categories: ['fresh-produce'],
    detail: 'Fresh · Sold per piece',
    tagline: 'Fresh green peas, sold individually.',
    description:
      'Fresh green peas sourced from local farms, sold per piece to households and food service businesses.',
    specs: [
      { key: 'Origin', value: 'Plateau, Kaduna' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Sold loose' },
      { key: 'Min. Order', value: '1 piece' },
      { key: 'Availability', value: 'Seasonal' },
      { key: 'Storage', value: 'Cold Chain' },
    ],
    applications: ['Household', 'Food Service', 'Retail'],
  },
  {
    name: 'Carrot',
    slug: 'carrot',
    icon: '🥕',
    image: getProductImageUrl('carrot', 'jpg'),
    type: 'local',
    categories: ['fresh-produce'],
    detail: 'Fresh · Sold per piece',
    tagline: 'Farm-fresh carrots, sold individually.',
    description: 'Premium quality carrots supplied directly from Nigerian farms, sold per piece.',
    specs: [
      { key: 'Origin', value: 'Plateau, Kaduna' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Sold loose' },
      { key: 'Min. Order', value: '1 piece' },
      { key: 'Availability', value: 'Year-round' },
      { key: 'Storage', value: 'Cool Storage' },
    ],
    applications: ['Household', 'Food Service', 'Retail'],
  },
  {
    name: 'Fresh Pepper',
    slug: 'fresh-pepper',
    icon: '🌶️',
    image: getProductImageUrl('freshpeppers', 'jpg'),
    type: 'local',
    categories: ['spices-seasonings'],
    detail: 'Fresh · Sold per piece',
    tagline: 'Fresh peppers, sold individually.',
    description: 'High-quality fresh peppers sourced from Nigerian farms, sold per piece.',
    specs: [
      { key: 'Origin', value: 'Kaduna, Kano' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Sold loose' },
      { key: 'Min. Order', value: '1 piece' },
      { key: 'Availability', value: 'Seasonal' },
      { key: 'Storage', value: 'Cool Environment' },
    ],
    applications: ['Household', 'Retail', 'Restaurants'],
  },
  {
    name: 'Green Pepper',
    slug: 'green-pepper',
    icon: '🫑',
    image: getProductImageUrl('greenpepper', 'jpg'),
    type: 'local',
    categories: ['fresh-produce'],
    detail: 'Fresh · Sold per piece',
    // Treated as the "bell pepper" item requested — there's no separate
    // bell-pepper product in the catalog, so this is the closest match.
    // Flag if a distinct bell-pepper listing was actually meant.
    tagline: 'Premium green peppers (bell peppers), sold individually.',
    description: 'Fresh green peppers harvested from commercial farms, sold per piece.',
    specs: [
      { key: 'Origin', value: 'Plateau, Kaduna' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Sold loose' },
      { key: 'Min. Order', value: '1 piece' },
      { key: 'Availability', value: 'Seasonal' },
      { key: 'Storage', value: 'Refrigerated' },
    ],
    applications: ['Household', 'Food Service', 'Retail'],
  },
  // {
  //   name: 'Dried Chili Pepper',
  //   slug: 'dried-chili-pepper',
  //   icon: '🌶️',
  //   image: getProductImageUrl('driedchili', 'jpg'),
  //   type: 'local',
  //   categories: ['spices-seasonings'],
  //   detail: 'Dried · Sold per piece',
  //   tagline: 'Sun-dried chili peppers, sold individually.',
  //   description: 'Premium dried chili peppers with long shelf life, sold per piece.',
  //   specs: [
  //     { key: 'Origin', value: 'Kaduna, Kano' },
  //     { key: 'Type', value: 'Sun Dried' },
  //     { key: 'Packaging', value: 'Sold loose' },
  //     { key: 'Min. Order', value: '1 piece' },
  //     { key: 'Availability', value: 'Year-round' },
  //     { key: 'Moisture', value: 'Max 12%' },
  //   ],
  //   applications: ['Household', 'Retail', 'Food Processing'],
  // },
  {
    name: 'Spring Onions',
    slug: 'spring-onions',
    icon: '🧅',
    image: getProductImageUrl('springonions', 'jpg'),
    type: 'local',
    categories: ['fresh-produce'],
    detail: 'Fresh · Sold per piece',
    tagline: 'Fresh spring onions, sold individually.',
    description: 'Fresh spring onions for households, restaurants, and hotels, sold per piece.',
    specs: [
      { key: 'Origin', value: 'Plateau, Kaduna' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Sold loose' },
      { key: 'Min. Order', value: '1 piece' },
      { key: 'Availability', value: 'Year-round' },
      { key: 'Storage', value: 'Cold Chain' },
    ],
    applications: ['Household', 'Restaurants', 'Hotels'],
  },
  {
    name: 'corn',
    slug: 'corn',
    icon: '🌽',
    image: getProductImageUrl('corn', 'jpg'),
    type: 'local',
    categories: ['fresh-produce'],
    family: 'corn',
    detail: 'Fresh · Sold per piece',
    tagline: 'Fresh corn, sold individually.',
    description:
      'Fresh corn for households, restaurants, and hotels, sold per piece. For canned corn, see Canned Vegetables.',
    specs: [
      { key: 'Origin', value: 'Plateau, Kaduna' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Sold loose' },
      { key: 'Min. Order', value: '1 piece' },
      { key: 'Availability', value: 'Year-round' },
      { key: 'Storage', value: 'Cold Chain' },
    ],
    applications: ['Household', 'Restaurants', 'Hotels'],
  },
  {
    name: 'Ginger',
    slug: 'ginger',
    icon: '🫚',
    // FIXED (earlier revision): was `GingergetProductImageUrl(...)` —
    // not a real function, would throw at build/runtime. Corrected to
    // the same `getProductImageUrl` helper every other product uses.
    image: getProductImageUrl('ginger', 'png'),
    // CHANGED: was 'export' (quote-only) — now directly purchasable,
    // same as every other local product.
    type: 'local',
    categories: ['spices-seasonings'],
    family: 'ginger',
    detail: 'Dried/Split · Min. 5 MT · Kaduna, Nasarawa',
    tagline: 'Premium Nigerian ginger, in bulk bag sizes.',
    description:
      'Nigeria is one of the world\u2019s top ginger producers. Split, dried ginger sourced from Kaduna and Nasarawa for spice manufacturers and bulk buyers. For the retail powdered form, see Ginger Powder.',
    specs: [
      { key: 'Origin', value: 'Kaduna, Nasarawa' },
      { key: 'Type', value: 'Dried / Split' },
      { key: 'Moisture', value: 'Max 12%' },
      { key: 'Min. Order', value: '5 Metric Tonnes' },
      { key: 'Packaging', value: '25kg / 50kg bags' },
      { key: 'Availability', value: 'Dec – Mar (peak)' },
    ],
    applications: ['Spice Export', 'Pharmaceutical', 'Food Processing', 'Beverage Industry'],
  },
  {
    name: 'Cocoa Beans',
    slug: 'cocoa-beans',
    icon: '🍫',
    image: getProductImageUrl('cocoa', 'png'),
    // CHANGED: was 'export' (quote-only) — now directly purchasable,
    // same as every other local product.
    type: 'local',
    categories: ['legumes-nuts'],
    detail: 'Grade 1 · Min. 10 MT · Ondo, Cross River',
    tagline: 'Fermented, sun-dried cocoa beans in bulk bag sizes.',
    description:
      'Grade 1 fermented and sun-dried cocoa beans sourced from Ondo, Cross River, and Osun — Nigeria\u2019s leading cocoa belt. Supplied to chocolate manufacturers and bulk buyers.',
    specs: [
      { key: 'Origin', value: 'Ondo, Cross River, Osun' },
      { key: 'Grade', value: 'Grade 1' },
      { key: 'Moisture', value: 'Max 8%' },
      { key: 'Min. Order', value: '10 Metric Tonnes' },
      { key: 'Packaging', value: '62.5kg jute bags' },
      { key: 'Peak Season', value: 'Oct – Mar' },
    ],
    applications: ['Chocolate Manufacturing', 'Cocoa Butter Production', 'Export', 'Confectionery'],
  },
  {
    name: 'Groundnut',
    slug: 'groundnut',
    icon: '🥜',
    image: getProductImageUrl('groundnut', 'png'),
    // CHANGED: was 'export' (quote-only) — now directly purchasable,
    // same as every other local product.
    type: 'local',
    categories: ['legumes-nuts'],
    detail: 'Raw/Shelled · Min. 10 MT · Kano, Jigawa',
    tagline: 'Quality Nigerian groundnuts, in bulk bag sizes.',
    description:
      'Raw and shelled groundnuts sourced from Kano and Jigawa, historically one of Nigeria\u2019s largest export crops. Supplied for oil extraction, confectionery, and bulk food processing.',
    specs: [
      { key: 'Origin', value: 'Kano, Jigawa' },
      { key: 'Type', value: 'Raw / Shelled' },
      { key: 'Moisture', value: 'Max 8%' },
      { key: 'Min. Order', value: '10 Metric Tonnes' },
      { key: 'Packaging', value: '50kg bags' },
      { key: 'Availability', value: 'Nov – Feb (peak)' },
    ],
    applications: ['Oil Extraction', 'Confectionery', 'Export', 'Food Processing'],
  },
  {
    name: 'Soyabeans',
    slug: 'soyabeans',
    icon: '🌱',
    image: getProductImageUrl('soyabeans', 'jpg'),
    // CHANGED: was 'export' (quote-only) — now directly purchasable
    // with size variants, same as Maize/Garri.
    type: 'local',
    categories: ['legumes-nuts'],
    detail: 'Grade 1 · Multiple sizes · Benue, Kaduna',
    tagline: 'Non-GMO Nigerian soyabeans, in the bag sizes you need.',
    description:
      'Non-GMO soyabeans sourced from Benue and Kaduna for oil extraction, animal feed production, and food processing. Choose a bag size below.',
    specs: [
      { key: 'Origin', value: 'Benue, Kaduna' },
      { key: 'Type', value: 'Non-GMO' },
      { key: 'Moisture', value: 'Max 13%' },
      { key: 'Sizes available', value: '5kg, 10kg, 15kg, 20kg, 50kg' },
      { key: 'Packaging', value: 'Bags' },
      { key: 'Availability', value: 'Oct – Jan (peak)' },
    ],
    applications: ['Oil Extraction', 'Animal Feed', 'Food Processing', 'Household'],
    variants: [
      { slug: 'soyabeans--5kg', brand: 'Soyabeans', size: '5kg' },
      { slug: 'soyabeans--10kg', brand: 'Soyabeans', size: '10kg' },
      { slug: 'soyabeans--15kg', brand: 'Soyabeans', size: '15kg' },
      { slug: 'soyabeans--20kg', brand: 'Soyabeans', size: '20kg' },
      { slug: 'soyabeans--50kg', brand: 'Soyabeans', size: '50kg' },
    ],
  },
  {
    name: 'Shea Butter',
    slug: 'shea-butter',
    icon: '✨',
    image: getProductImageUrl('shea-butter', 'png'),
    // CHANGED: was 'export' (quote-only) — now directly purchasable,
    // same as every other local product.
    type: 'local',
    categories: ['oils-fats'],
    detail: 'Raw/Refined · Min. 1,000kg · Niger, Kwara',
    tagline: 'Raw and refined shea butter for cosmetic and food-grade buyers.',
    description:
      'Raw and refined shea butter sourced from Niger and Kwara states, hand-processed by women\u2019s cooperatives. Supplied to cosmetic manufacturers and food-grade fat buyers.',
    specs: [
      { key: 'Origin', value: 'Niger, Kwara' },
      { key: 'Grade', value: 'Raw / Refined' },
      { key: 'FFA Level', value: 'Max 1%' },
      { key: 'Min. Order', value: '1,000kg' },
      { key: 'Packaging', value: '25kg pails / Drums' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Cosmetics', 'Skincare', 'Food Grade Fat', 'Export'],
  },

  // ================================================================
  // Branded grocery products with brand+size variants — sourced from
  // master_product_catalog.md. Each variant carries its own `image`
  // where a real photo exists. The parent product's own `image` (used
  // by grid cards and "related products" thumbnails, which read
  // product.image directly rather than the selected variant) now
  // points at one representative variant's real photo instead of a
  // placehold.co box.
  // ================================================================

  {
    name: 'Parboiled Rice',
    slug: 'rice-parboiled',
    icon: '🌾',
    image: getProductImageUrl('IMG_7284', 'PNG'),
    type: 'local',
    categories: ['staples-grains'],
    family: 'rice',
    detail: 'Branded parboiled rice · 5kg – 50kg · Multiple brands',
    tagline: 'Branded parboiled rice in the sizes Nigerian households and traders buy most.',
    description:
      'Parboiled rice from the leading Nigerian and imported brands, in retail and semi-wholesale pack sizes. Choose a brand and size below.',
    specs: [
      { key: 'Form', value: 'Parboiled, milled' },
      { key: 'Sizes available', value: '5kg, 50kg' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'Food Service', 'FMCG'],
    variants: [
      {
        slug: 'rice-parboiled--big-bull--5kg',
        brand: 'Big Bull Gold Premium Milled Parboiled Rice',
        size: '5kg',
        image: getProductImageUrl('IMG_7284', 'PNG'),
      },
      {
        slug: 'rice-parboiled--mama-gold--5kg',
        brand: 'Mama Gold Supreme Quality Thai Parboiled Rice',
        size: '5kg',
        image: getProductImageUrl('IMG_7286', 'PNG'),
      },
      {
        slug: 'rice-parboiled--mamas-pride--5kg',
        brand: "Mama's Pride Parboiled Rice",
        size: '5kg',
        image: getProductImageUrl('IMG_7296', 'PNG'),
      },
      {
        slug: 'rice-parboiled--my-choice--50kg',
        brand: 'My Choice Silver Indian Long Grain Parboiled Rice',
        size: '50kg',
        image: getProductImageUrl('IMG_7283', 'PNG'),
      },
    ],
  },
  {
    name: 'Basmati Rice',
    slug: 'rice-basmati',
    icon: '🌾',
    image: getProductImageUrl('IMG_7304', 'PNG'),
    type: 'local',
    categories: ['staples-grains'],
    family: 'rice',
    detail: 'Branded basmati rice · 1kg – 10kg · Multiple brands',
    tagline: 'Long-grain basmati rice from the leading imported brands sold in Nigeria.',
    description:
      'Basmati rice from the leading imported brands, in the pack sizes Nigerian retailers and households buy most. Choose a brand and size below.',
    specs: [
      { key: 'Form', value: 'Basmati, long grain' },
      { key: 'Sizes available', value: '1kg, 5kg, 10kg' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'Food Service', 'FMCG'],
    variants: [
      {
        slug: 'rice-basmati--aeroplane--1kg',
        brand: 'Aeroplane La-Taste Indian Basmati Rice',
        size: '1kg',
        image: getProductImageUrl('IMG_7304', 'PNG'),
      },
      {
        slug: 'rice-basmati--aeroplane--5kg',
        brand: 'Aeroplane La-Taste Indian Basmati Rice',
        size: '5kg',
        image: getProductImageUrl('IMG_7303', 'PNG'),
      },
      {
        slug: 'rice-basmati--golden-grain--5kg',
        brand: 'Golden Grain 1121 XXXL Golden Sella Basmati Rice',
        size: '5kg',
        image: getProductImageUrl('IMG_7302', 'PNG'),
      },
      {
        slug: 'rice-basmati--maharani-mini-dubar--10kg',
        brand: 'Maharani Mini Dubar Basmati Rice',
        size: '10kg',
        image: getProductImageUrl('IMG_7307', 'PNG'),
      },
      {
        slug: 'rice-basmati--maharani-parboiled--1kg',
        brand: 'Maharani Parboiled Basmati Long Grain Rice',
        size: '1kg',
        image: getProductImageUrl('IMG_7306', 'PNG'),
      },
      {
        // NOTE: your description list gave IMG_7301 and IMG_7305 the exact
        // same text ("Tropical Sun Golden Sella Pure Basmati Rice bag")
        // with no size distinguishing them — mapped here as 5kg by
        // position. Worth a quick visual check that this one is really
        // the 5kg bag and not the 10kg.
        slug: 'rice-basmati--tropical-sun--5kg',
        brand: 'Tropical Sun Golden Sella Pure Basmati Rice',
        size: '5kg',
        image: getProductImageUrl('IMG_7301', 'PNG'),
      },
      {
        // Same caveat as above — verify this is the 10kg bag, not the 5kg.
        slug: 'rice-basmati--tropical-sun--10kg',
        brand: 'Tropical Sun Golden Sella Pure Basmati Rice',
        size: '10kg',
        image: getProductImageUrl('IMG_7305', 'PNG'),
      },
    ],
  },
  {
    name: 'Semovita',
    slug: 'semovita',
    icon: '🍲',
    image: getProductImageUrl('IMG_7231.JPG', 'jpeg'),
    type: 'local',
    categories: ['staples-grains'],
    family: 'semovita',
    detail: '1kg, 2kg · Fast-moving',
    tagline: 'Wheat-based swallow staple, a household favorite across Nigeria.',
    description:
      'Semovita is a fast-moving wheat-based swallow product stocked in most Nigerian households. Choose a size below.',
    specs: [
      { key: 'Form', value: 'Wheat-based swallow' },
      { key: 'Sizes available', value: '1kg, 2kg' },
      { key: 'Notes', value: 'Fast-moving' },
    ],
    applications: ['Retail Distribution', 'Household', 'FMCG'],
    variants: [
      {
        slug: 'semovita--golden-penny--1kg',
        brand: 'Golden Penny Semovita',
        size: '1kg',
        image: getProductImageUrl('IMG_7231.JPG', 'jpeg'),
      },
      {
        slug: 'semovita--golden-penny--2kg',
        brand: 'Golden Penny Semovita',
        size: '2kg',
        image: getProductImageUrl('IMG_7232.JPG', 'jpeg'),
      },
    ],
  },
  {
    name: 'Semolina',
    slug: 'semolina',
    icon: '🍲',
    image: getProductImageUrl('IMG_7229.JPG', 'jpeg'),
    type: 'local',
    categories: ['staples-grains'],
    family: 'semovita',
    detail: '900g – 5kg · Multiple brands',
    tagline: 'Wheat semolina in household and bulk retail pack sizes.',
    description:
      'Semolina in the household and bulk sizes Nigerian kitchens buy most. Choose a brand and size below.',
    specs: [
      { key: 'Form', value: 'Wheat semolina' },
      { key: 'Sizes available', value: '900g, 1.8kg, 5kg' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'FMCG'],
    variants: [
      {
        slug: 'semolina--honeywell--900g',
        brand: 'Honeywell Semolina',
        size: '900g',
        image: getProductImageUrl('IMG_7229.JPG', 'jpeg'),
      },
      {
        slug: 'semolina--honeywell--1-8kg',
        brand: 'Honeywell Semolina',
        size: '1.8kg',
        image: getProductImageUrl('IMG_7230.JPG', 'jpeg'),
      },
      {
        slug: 'semolina--mama-gold--5kg',
        brand: 'Mama Gold Pure White Semolina',
        size: '5kg',
        image: getProductImageUrl('IMG_7285', 'PNG'),
      },
    ],
  },
  {
    name: 'Spaghetti',
    slug: 'spaghetti',
    icon: '🍝',
    image: getProductImageUrl('IMG_7234', 'PNG'),
    type: 'local',
    categories: ['staples-grains'],
    family: 'pasta',
    detail: '500g · Multiple brands',
    tagline: 'Everyday pasta staple in the standard retail pack size.',
    description:
      'Spaghetti in the standard 500g retail pack, from leading Nigerian brands. Choose a brand below.',
    specs: [
      { key: 'Form', value: 'Dry pasta' },
      { key: 'Sizes available', value: '500g' },
      { key: 'Notes', value: 'Carton: 20 packs x 500g' },
    ],
    applications: ['Retail Distribution', 'Household', 'FMCG'],
    variants: [
      {
        slug: 'spaghetti--crown-premium--500g',
        brand: 'Crown Premium Spaghetti',
        size: '500g',
        image: getProductImageUrl('IMG_7234', 'PNG'),
      },
      {
        slug: 'spaghetti--dangote--500g',
        brand: 'Dangote Pasta Spaghetti Standard',
        size: '500g',
        image: getProductImageUrl('IMG_7235', 'PNG'),
      },
      {
        slug: 'spaghetti--golden-penny-spaghettini--500g',
        brand: 'Golden Penny Spaghettini',
        size: '500g',
        image: getProductImageUrl('IMG_7233.JPG', 'jpeg'),
      },
    ],
  },
  {
    name: 'Powdered Milk',
    slug: 'milk-powder',
    icon: '🥛',
    image: getProductImageUrl('IMG_7259', 'PNG'),
    type: 'local',
    categories: ['dairy'],
    family: 'milk',
    detail: '350g – 2kg · Multiple brands',
    tagline: 'Powdered milk in the household sizes Nigerian kitchens restock most.',
    description:
      'Powdered milk from the leading brands sold across Nigeria, in pouch, tin, and bag formats. Choose a brand and size below. For evaporated (canned liquid) milk, see Evaporated Milk.',
    specs: [
      { key: 'Form', value: 'Powdered' },
      { key: 'Sizes available', value: '350g, 400g, 850g, 2kg' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'FMCG'],
    variants: [
      {
        slug: 'milk-powder--dano-cool-cow--350g',
        brand: 'Dano Cool Cow Instant Filled Milk Powder',
        size: '350g',
        image: getProductImageUrl('IMG_7259', 'PNG'),
      },
      {
        slug: 'milk-powder--dano-cool-cow--2kg',
        brand: 'Dano Cool Cow Instant Filled Milk Powder',
        size: '2kg',
        image: getProductImageUrl('IMG_7261', 'PNG'),
      },
      {
        slug: 'milk-powder--dano-full-cream--350g',
        brand: 'Dano Full Cream Milk Powder',
        size: '350g',
        image: getProductImageUrl('IMG_7260', 'PNG'),
      },
      {
        slug: 'milk-powder--peak-full-cream--850g',
        brand: 'Peak Full Cream Instant Milk Powder',
        size: '850g',
        image: getProductImageUrl('IMG_7253', 'PNG'),
      },
      {
        slug: 'milk-powder--peak-instant-tin--400g',
        brand: 'Peak Instant Full Cream Milk Powder (Tin)',
        size: '400g',
        image: getProductImageUrl('IMG_7254', 'PNG'),
      },
      {
        slug: 'milk-powder--peak-value-pack--350g',
        brand: 'Peak Milk Powder (Value Pack Pouch)',
        size: '350g',
        image: getProductImageUrl('IMG_7255', 'PNG'),
      },
      {
        slug: 'milk-powder--three-crowns-instant--350g',
        brand: 'Three Crowns Instant Filled Milk Powder',
        size: '350g',
        image: getProductImageUrl('IMG_7256', 'PNG'),
      },
    ],
  },
  {
    name: 'Evaporated Milk',
    slug: 'milk-evaporated',
    icon: '🥛',
    image: getProductImageUrl('IMG_7258', 'PNG'),
    type: 'local',
    categories: ['dairy'],
    family: 'milk',
    detail: '160g · Canned',
    tagline: 'Canned evaporated milk in the standard retail tin.',
    description:
      'Evaporated (liquid, canned) milk in the standard tin size. For powdered milk, see Powdered Milk.',
    specs: [
      { key: 'Form', value: 'Evaporated, canned' },
      { key: 'Sizes available', value: '160g' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'Food Service'],
    variants: [
      {
        slug: 'milk-evaporated--three-crowns--160g',
        brand: 'Three Crowns Filled Evaporated Milk (Can)',
        size: '160g',
        image: getProductImageUrl('IMG_7258', 'PNG'),
      },
    ],
  },
  {
    name: 'Sugar',
    slug: 'sugar',
    icon: '🍬',
    image: getProductImageUrl('IMG_7264', 'PNG'),
    type: 'local',
    categories: ['pantry-essentials'],
    family: 'sugar',
    detail: '250g – 1kg · Multiple brands',
    tagline: 'Household-size granulated sugar from leading Nigerian brands.',
    description:
      'Granulated sugar in the household pack sizes Nigerian kitchens buy most. Choose a brand and size below.',
    specs: [
      { key: 'Form', value: 'Granulated / Cube' },
      { key: 'Sizes available', value: '250g, 500g, 1kg' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'FMCG'],
    variants: [
      {
        slug: 'sugar--dangote--250g',
        brand: 'Dangote Refined Granulated White Sugar',
        size: '250g',
        image: getProductImageUrl('IMG_7264', 'PNG'),
      },
      {
        slug: 'sugar--dangote--1kg',
        brand: 'Dangote Refined Granulated White Sugar',
        size: '1kg',
        image: getProductImageUrl('IMG_7263', 'PNG'),
      },
      {
        slug: 'sugar--golden-penny--250g',
        brand: 'Golden Penny Premium White Granulated Sugar',
        size: '250g',
        image: getProductImageUrl('IMG_7266', 'PNG'),
      },
      {
        slug: 'sugar--golden-penny--1kg',
        brand: 'Golden Penny Premium White Granulated Sugar',
        size: '1kg',
        image: getProductImageUrl('IMG_7265', 'PNG'),
      },
      {
        slug: 'sugar--st-louis-cube--500g',
        brand: 'St. Louis Cube Sugar (90-cube box)',
        size: '500g',
        image: getProductImageUrl('IMG_7267', 'PNG'),
      },
    ],
  },
  {
    name: 'Salt',
    slug: 'salt',
    icon: '🧂',
    image: getProductImageUrl('IMG_7272', 'PNG'),
    type: 'local',
    categories: ['pantry-essentials'],
    family: 'salt',
    detail: '250g – 1kg · Multiple brands',
    tagline: 'Household table salt in standard retail pack sizes.',
    description:
      'Iodized table salt from the leading Nigerian brands, in the household pack sizes bought most. Choose a brand and size below.',
    specs: [
      { key: 'Form', value: 'Refined / Iodized' },
      { key: 'Sizes available', value: '250g, 500g, 1kg' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'FMCG'],
    variants: [
      {
        slug: 'salt--annapurna-sea--1kg',
        brand: 'Annapurna Premium Sea Salt',
        size: '1kg',
        image: getProductImageUrl('IMG_7272', 'PNG'),
      },
      {
        slug: 'salt--annapurna-iodated--250g',
        brand: 'Annapurna Refined Iodated Salt',
        size: '250g',
        image: getProductImageUrl('IMG_7275', 'PNG'),
      },
      {
        slug: 'salt--annapurna-iodated--500g',
        brand: 'Annapurna Refined Iodated Salt',
        size: '500g',
        image: getProductImageUrl('IMG_7273', 'PNG'),
      },
      {
        slug: 'salt--dangote--500g',
        brand: 'Dangote Refined & Iodized Salt',
        size: '500g',
        image: getProductImageUrl('IMG_7268', 'PNG'),
      },
      {
        slug: 'salt--dangote--1kg',
        brand: 'Dangote Refined & Iodized Salt',
        size: '1kg',
        image: getProductImageUrl('IMG_7269', 'PNG'),
      },
      {
        slug: 'salt--mr-chef--500g',
        brand: 'Mr. Chef Refined & Iodized Salt',
        size: '500g',
        image: getProductImageUrl('IMG_7271', 'PNG'),
      },
      {
        slug: 'salt--mr-chef--1kg',
        brand: 'Mr. Chef Refined & Iodized Salt',
        size: '1kg',
        image: getProductImageUrl('IMG_7270', 'PNG'),
      },
    ],
  },
  {
    name: 'Tomato Paste — Sachet',
    slug: 'tomato-paste-sachet',
    icon: '🫙',
    image: getProductImageUrl('IMG_7241', 'PNG'),
    type: 'local',
    categories: ['pantry-essentials', 'spices-seasonings'],
    family: 'tomato',
    detail: '70g – 210g sachets · Multiple brands',
    tagline: 'Sachet tomato paste — the small everyday cooking-base format.',
    description:
      'Tomato paste in single-use sachet and pouch sizes, the most common format for everyday Nigerian cooking. Choose a brand below. For the larger tin/pouch format, see Tomato Paste — Pouch & Tin.',
    specs: [
      { key: 'Form', value: 'Sachet / Pouch' },
      { key: 'Sizes available', value: '70g, 210g' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'Food Service'],
    variants: [
      {
        slug: 'tomato-paste-sachet--de-rica--70g',
        brand: 'De Rica Tomato Mix (Sachet)',
        size: '70g',
        image: getProductImageUrl('IMG_7241', 'PNG'),
      },
      {
        slug: 'tomato-paste-sachet--gino-magic--70g',
        brand: 'Gino Magic Peppe & Onion Tomato Seasoning Mix',
        size: '70g',
        image: getProductImageUrl('IMG_7237', 'PNG'),
      },
      {
        slug: 'tomato-paste-sachet--gino--70g',
        brand: 'Gino Tomato Mix (Sachet)',
        size: '70g',
        image: getProductImageUrl('IMG_7236', 'PNG'),
      },
      {
        slug: 'tomato-paste-sachet--sonia-pouch--210g',
        brand: 'Sonia Tomato Mix (Pouch)',
        size: '210g',
        image: getProductImageUrl('IMG_7243', 'PNG'),
      },
      {
        slug: 'tomato-paste-sachet--tasty-tom--70g',
        brand: 'Tasty Tom Tomato Mix (Sachet)',
        size: '70g',
        image: getProductImageUrl('IMG_7242', 'PNG'),
      },
    ],
  },
  {
    name: 'Tomato Paste — Pouch & Tin',
    slug: 'tomato-paste-tin',
    icon: '🥫',
    image: getProductImageUrl('IMG_7240', 'PNG'),
    type: 'local',
    categories: ['canned-goods'],
    family: 'tomato',
    detail: '210g – 400g · Multiple brands',
    tagline: 'Larger-format tomato paste in tins and pouches for bigger batches.',
    description:
      'Tomato paste in larger tin and pouch sizes for bigger cooking batches and food service use. Choose a brand below. For single-use sachets, see Tomato Paste — Sachet.',
    specs: [
      { key: 'Form', value: 'Tin / Pouch' },
      { key: 'Sizes available', value: '210g, 400g' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'Food Service'],
    variants: [
      {
        slug: 'tomato-paste-tin--de-rica-pouch--210g',
        brand: 'De Rica Tomato Mix (Pouch)',
        size: '210g',
        image: getProductImageUrl('IMG_7240', 'PNG'),
      },
      {
        slug: 'tomato-paste-tin--de-rica--400g',
        brand: 'De Rica Tomato Paste (Tin)',
        size: '400g',
        image: getProductImageUrl('IMG_7239', 'PNG'),
      },
      {
        // NOTE: description list for this file said "70g tin / 210g tin"
        // — neither matches this variant's 400g size. Worth a visual
        // check that IMG_7238 is really the 400g Gino tin.
        slug: 'tomato-paste-tin--gino--400g',
        brand: 'Gino Tomato Mix (Tin/Can)',
        size: '400g',
        image: getProductImageUrl('IMG_7238', 'PNG'),
      },
      {
        slug: 'tomato-paste-tin--tasty-tom-pouch--210g',
        brand: 'Tasty Tom Enriched Tomato Mix (Pouch)',
        size: '210g',
        image: getProductImageUrl('IMG_7244', 'PNG'),
      },
    ],
  },
  {
    name: 'Corned Beef',
    slug: 'corned-beef',
    icon: '🥫',
    image: getProductImageUrl('IMG_7246', 'PNG'),
    type: 'local',
    categories: ['canned-goods'],
    family: 'corned-beef',
    detail: '200g – 340g · Multiple brands',
    tagline: 'Canned corned beef in round and tapered tins.',
    description:
      'Canned corned beef from established brands, in the standard round and tapered tin sizes. Choose a brand and size below.',
    specs: [
      { key: 'Form', value: 'Canned' },
      { key: 'Sizes available', value: '200g, 326g, 340g' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'Food Service'],
    variants: [
      {
        slug: 'corned-beef--exeter-round--200g',
        brand: 'Exeter Corned Beef (Round Can)',
        size: '200g',
        image: getProductImageUrl('IMG_7246', 'PNG'),
      },
      {
        slug: 'corned-beef--exeter-tapered--340g',
        brand: 'Exeter Corned Beef (Tapered Can)',
        size: '340g',
        image: getProductImageUrl('IMG_7245', 'PNG'),
      },
      {
        slug: 'corned-beef--fray-bentos-round--200g',
        // NOTE: description for IMG_7252 said "150g tin", which doesn't
        // match this variant's 200g size — worth a visual check that
        // this is really the Fray Bentos 200g round can and not a
        // separate 150g product you haven't catalogued yet.
        brand: 'Fray Bentos Corned Beef (Round Can)',
        size: '200g',
        image: getProductImageUrl('IMG_7252', 'PNG'),
      },
      {
        slug: 'corned-beef--fray-bentos-tapered--340g',
        brand: 'Fray Bentos Corned Beef (Tapered Can)',
        size: '340g',
        image: getProductImageUrl('IMG_7251', 'PNG'),
      },
      {
        slug: 'corned-beef--ox-palm-round--326g',
        brand: 'Ox & Palm Corned Beef (Round Can)',
        size: '326g',
        image: getProductImageUrl('IMG_7247', 'PNG'),
      },
      {
        slug: 'corned-beef--ox-palm-tall--326g',
        brand: 'Ox & Palm Corned Beef (Tall Can)',
        size: '326g',
        image: getProductImageUrl('IMG_7248', 'PNG'),
      },
    ],
  },
  {
    name: 'Vegetable Oil',
    slug: 'vegetable-oil',
    icon: '🛢️',
    image: getProductImageUrl('IMG_7319', 'PNG'),
    type: 'local',
    categories: ['oils-fats'],
    family: 'vegetable-oil',
    detail: '750ml – 5L · Power Oil',
    tagline: 'The core cooking oil stocked in every Nigerian kitchen.',
    description:
      'Vegetable and palm olein cooking oil across the full range of household and food-service pack sizes. Choose a size below.',
    specs: [
      { key: 'Form', value: 'Vegetable / Palm Olein' },
      { key: 'Sizes available', value: '750ml – 5L' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'Food Service'],
    variants: [
      {
        slug: 'veg-oil--power-oil-pure--750ml',
        brand: 'Power Oil Pure Vegetable Oil',
        size: '750ml',
        image: getProductImageUrl('IMG_7319', 'PNG'),
      },
      {
        slug: 'veg-oil--power-oil-pure--1l',
        brand: 'Power Oil Pure Vegetable Oil',
        size: '1L',
        image: getProductImageUrl('IMG_7320', 'PNG'),
      },
      {
        // No photo yet — no `image` field, falls back to the parent
        // product's placeholder image on the detail page.
        slug: 'veg-oil--power-oil-pure--1-4l',
        brand: 'Power Oil Pure Vegetable Oil',
        size: '1.4L',
      },
      {
        // No photo yet — same fallback as above.
        slug: 'veg-oil--power-oil-pure--2l',
        brand: 'Power Oil Pure Vegetable Oil',
        size: '2L',
      },
      {
        slug: 'veg-oil--power-oil-pure--3l',
        brand: 'Power Oil Pure Vegetable Oil',
        size: '3L',
        image: getProductImageUrl('IMG_7321', 'PNG'),
      },
      {
        slug: 'veg-oil--power-oil-palm-olein--4-5l',
        brand: 'Power Oil Refined Palm Olein Vegetable Oil',
        size: '4.5L',
        image: getProductImageUrl('IMG_7322', 'PNG'),
      },
      {
        // No photo yet — same fallback as above.
        slug: 'veg-oil--power-oil-palm-olein--5l',
        brand: 'Power Oil Refined Palm Olein Vegetable Oil',
        size: '5L',
      },
    ],
  },
  {
    name: 'Curry Powder',
    slug: 'curry-powder',
    icon: '🧂',
    image: getProductImageUrl('IMG_7323', 'PNG'),
    type: 'local',
    categories: ['spices-seasonings'],
    family: 'curry-powder',
    detail: 'Sachet · Multiple brands',
    tagline: 'A recipe-essential seasoning in standard sachet packs.',
    description:
      'Curry powder from the leading Nigerian brands, a recipe essential across Nigerian cooking. Choose a brand below.',
    specs: [
      { key: 'Form', value: 'Sachet' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'Food Service'],
    variants: [
      {
        slug: 'curry-powder--gino--sachet',
        brand: 'Gino Herbs & Spices Curry Powder',
        size: 'Sachet Pack',
        image: getProductImageUrl('IMG_7323', 'PNG'),
      },
      {
        slug: 'curry-powder--sonia--pack',
        brand: 'Sonia Curry Powder (Buy 10 Get 1 Free Pack)',
        size: 'Pack',
        image: getProductImageUrl('IMG_7324', 'PNG'),
      },
      {
        slug: 'curry-powder--tiger--sachet',
        brand: 'Tiger Curry Powder',
        size: 'Standard Sachet',
        image: getProductImageUrl('IMG_7325', 'PNG'),
      },
    ],
  },
  {
    name: 'Thyme Leaves',
    slug: 'thyme',
    icon: '🌿',
    image: getProductImageUrl('IMG_7326', 'PNG'),
    type: 'local',
    categories: ['spices-seasonings'],
    family: 'thyme',
    detail: 'Sachet – 42g · Multiple brands',
    tagline: 'A recipe-essential dried herb in standard retail sizes.',
    description:
      'Dried thyme leaves from the leading Nigerian brands, a recipe essential across Nigerian cooking. Choose a brand below.',
    specs: [
      { key: 'Form', value: 'Dried, Sachet' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'Food Service'],
    variants: [
      {
        slug: 'thyme--gino--sachet',
        brand: 'Gino Herbs & Spices Dried Thyme',
        size: 'Sachet',
        image: getProductImageUrl('IMG_7326', 'PNG'),
      },
      {
        slug: 'thyme--sonia--sachet',
        brand: 'Sonia Thyme Leaves',
        size: 'Sachet',
        image: getProductImageUrl('IMG_7328', 'PNG'),
      },
      {
        slug: 'thyme--spice-supreme--42g',
        brand: 'Spice Supreme Thyme Leaves',
        size: '1.5oz (42g)',
        image: getProductImageUrl('IMG_7327', 'PNG'),
      },
    ],
  },
  {
    name: 'Pepper Powder',
    slug: 'pepper-powder',
    icon: '🌶️',
    image: getProductImageUrl('IMG_7331', 'PNG'),
    type: 'local',
    categories: ['spices-seasonings'],
    family: 'pepper-powder',
    detail: 'Sachet · Multiple brands',
    tagline: 'Ground hot pepper powder in standard sachet packs.',
    description:
      'Ground hot pepper (chilli) powder from the leading Nigerian brands. Choose a brand below.',
    specs: [
      { key: 'Form', value: 'Ground, Sachet' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'Food Service'],
    variants: [
      {
        slug: 'pepper-powder--gino--sachet',
        brand: 'Gino Herbs & Spices Red Hot Pepper Powder',
        size: 'Sachet',
        image: getProductImageUrl('IMG_7331', 'PNG'),
      },
      {
        slug: 'pepper-powder--gino--3-sachet-strip',
        brand: 'Gino Herbs & Spices Red Hot Pepper Powder',
        size: '3-Sachet Strip',
        image: getProductImageUrl('IMG_7332', 'PNG'),
      },
      {
        slug: 'pepper-powder--sonia--sachet',
        brand: 'Sonia Chilli Pepper Powder (Hot Pepper)',
        size: 'Sachet',
        image: getProductImageUrl('IMG_7333', 'PNG'),
      },
    ],
  },
  {
    name: 'Ginger Powder',
    slug: 'ginger-powder',
    icon: '🫘',
    image: getProductImageUrl('IMG_7334', 'PNG'),
    type: 'local',
    categories: ['spices-seasonings'],
    family: 'ginger',
    detail: 'Sachet',
    tagline: 'Ground ginger in the standard sachet size.',
    description:
      'Ground ginger powder, a recipe essential across Nigerian cooking. For fresh/dried export-grade ginger, see the Ginger listing.',
    specs: [
      { key: 'Form', value: 'Ground, Sachet' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'Food Service'],
    variants: [
      {
        slug: 'ginger-powder--sonia--sachet',
        brand: 'Sonia Ginger Powder',
        size: 'Sachet',
        image: getProductImageUrl('IMG_7334', 'PNG'),
      },
    ],
  },
  {
    name: 'Garlic Powder',
    slug: 'garlic-powder',
    icon: '🧄',
    image: getProductImageUrl('IMG_7335', 'PNG'),
    type: 'local',
    categories: ['spices-seasonings'],
    detail: '50g',
    tagline: 'Ground garlic in the standard retail size.',
    description: 'Ground garlic powder, a recipe essential across Nigerian cooking.',
    specs: [
      { key: 'Form', value: 'Ground' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'Food Service'],
    variants: [
      {
        slug: 'garlic-powder--spice-supreme--50g',
        brand: 'Spice Supreme Garlic Powder',
        size: '1.75oz (50g)',
        image: getProductImageUrl('IMG_7335', 'PNG'),
      },
    ],
  },
  {
    name: 'Seasoning Cubes',
    slug: 'seasoning-cubes',
    icon: '🧂',
    image: getProductImageUrl('IMG_7309', 'PNG'),
    type: 'local',
    categories: ['spices-seasonings'],
    family: 'seasoning-cubes',
    detail: '360g – 480g · Multiple brands',
    tagline: 'The everyday seasoning cube every Nigerian kitchen restocks.',
    description:
      'Bouillon seasoning cubes in standard retail counts, from the brands with the highest household turnover in Nigeria. Choose a brand below.',
    specs: [
      { key: 'Form', value: 'Cubes' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'Food Service'],
    variants: [
      {
        slug: 'seasoning-cubes--knorr-chicken--360g',
        brand: 'Knorr Chicken Seasoning Cubes (45 x 8g)',
        size: '360g',
        image: getProductImageUrl('IMG_7309', 'PNG'),
      },
      {
        slug: 'seasoning-cubes--maggi-stock--480g',
        brand: 'Maggi Chicken Stock Cubes (24 x 20g)',
        size: '480g',
        image: getProductImageUrl('IMG_7308', 'PNG'),
      },
    ],
  },
  {
    name: 'Chicken Seasoning Powder',
    slug: 'chicken-seasoning-powder',
    icon: '🧂',
    image: getProductImageUrl('IMG_7329', 'PNG'),
    type: 'local',
    categories: ['spices-seasonings'],
    detail: '400g',
    tagline: 'Chicken-flavoured seasoning powder in the standard retail size.',
    description:
      'Chicken-flavoured seasoning powder, from the brands with the highest household turnover in Nigeria.',
    specs: [
      { key: 'Form', value: 'Powder' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'Food Service'],
    variants: [
      {
        slug: 'chicken-seasoning-powder--maggi--400g',
        brand: 'Maggi Chicken Flavour Seasoning Powder',
        size: '400g',
        image: getProductImageUrl('IMG_7329', 'PNG'),
      },
    ],
  },
  {
    name: 'Coconut Milk & Cream',
    slug: 'coconut-milk-cream',
    icon: '🥥',
    image: getProductImageUrl('IMG_7336', 'PNG'),
    type: 'local',
    categories: ['canned-goods'],
    family: 'coconut',
    detail: '400ml · Multiple brands',
    tagline: 'Canned coconut milk and cream for coconut rice and specialty recipes.',
    description:
      'Coconut milk and coconut cream in the standard 400ml tin, used for coconut rice and other specialty Nigerian recipes. Choose a brand below.',
    specs: [
      { key: 'Form', value: 'Canned' },
      { key: 'Sizes available', value: '400ml' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'Food Service'],
    variants: [
      {
        slug: 'coconut--garden-supreme-cream--400ml',
        brand: 'Garden Supreme Coconut Cream',
        size: '400ml',
        image: getProductImageUrl('IMG_7336', 'PNG'),
      },
      {
        slug: 'coconut--sunripe-milk--400ml',
        brand: 'Sunripe Coconut Milk',
        size: '400ml',
        image: getProductImageUrl('IMG_7337', 'PNG'),
      },
    ],
  },
  {
    name: 'Canned Vegetables',
    slug: 'canned-vegetables',
    icon: '🥫',
    image: getProductImageUrl('IMG_7282', 'PNG'),
    type: 'local',
    categories: ['canned-goods'],
    family: 'canned-vegetables',
    detail: '300g – 411g · Multiple brands',
    tagline: 'Canned corn, green beans, and peas in standard retail tins.',
    description:
      'Canned sweet corn, green beans, and marrowfat peas from the leading imported and local canned-goods brands. Choose an item below. For fresh corn, see the corn listing.',
    specs: [
      { key: 'Form', value: 'Canned' },
      { key: 'Sizes available', value: '300g – 411g' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Household', 'Food Service'],
    variants: [
      {
        slug: 'canned-veg--allens-green-beans--411g',
        brand: 'Allens Blue Lake Green Beans (Can)',
        size: '411g (14.5oz)',
        image: getProductImageUrl('IMG_7282', 'PNG'),
      },
      {
        slug: 'canned-veg--del-monte-sweet-corn--410g',
        brand: 'Del Monte Golden Sweet Corn (Can)',
        size: '410g',
        image: getProductImageUrl('IMG_7277', 'PNG'),
      },
      {
        slug: 'canned-veg--farrows-marrowfat-peas--300g',
        brand: "Farrow's Giant Marrowfat Peas (Can)",
        size: '300g',
        image: getProductImageUrl('IMG_7281', 'PNG'),
      },
      {
        slug: 'canned-veg--green-giant-green-beans--398ml',
        brand: 'Green Giant Cut Green Beans (Can)',
        size: '398ml (14fl oz)',
        image: getProductImageUrl('IMG_7279', 'PNG'),
      },
      {
        slug: 'canned-veg--sunripe-sweetcorn--400g',
        brand: 'Sunripe Whole Sweetcorn (Can)',
        size: '400g',
        image: getProductImageUrl('IMG_7278', 'PNG'),
      },
    ],
  },
]
