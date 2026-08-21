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
import rice from '@/assets/rice.jpg'

// ================================================================
// DATA MODEL CHANGE (this revision):
//   category: string  ->  categories: string[]
//   + new optional `family` field (groups related forms of the same
//     conceptual product for cross-linking, e.g. fresh Tomato <->
//     Tomato Paste — Sachet <-> Tomato Paste — Pouch & Tin)
//   + new optional `variants` field (brand + size SKUs — each variant's
//     `slug` is what actually gets priced in product_prices and added
//     to the cart, same composite-slug pattern already used for meal
//     kits: parent product = one detail page, variant = one purchasable
//     line, zero changes needed to CartItem or checkout)
//
// Existing single-SKU products (the original 23) are unaffected in
// behavior — `categories` just wraps their old single value in an
// array, and they have no `variants`, so pricing/cart continue to key
// directly off their own `slug` exactly as before.
//
// ProductsView's sidebar filter and ShopByCategorySection need one
// small update to match this: `product.category === activeSlug`
// becomes `product.categories.includes(activeSlug)`.
// ================================================================

export interface ProductVariant {
  slug: string // unique — this is what's priced (product_prices.product_slug) and added to cart
  brand: string // brand + product line name, e.g. "Mama Gold Supreme Quality Thai Parboiled Rice"
  size: string // pack size, e.g. "5kg", "750ml", "Sachet"
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
    name: 'Rice',
    slug: 'rice',
    icon: '🌾',
    image: rice,
    type: 'local',
    categories: ['staples-grains'],
    family: 'rice',
    detail: '50kg bags · Min. 100 bags · Local supply · Bulk wholesale',
    tagline: 'Wholesale rice supply for Nigerian businesses and distributors.',
    description:
      'Quality parboiled and long-grain rice in 50kg bulk bags for wholesale distribution across Nigeria. Sourced from local mills and processors with consistent quality and competitive pricing. For smaller branded retail packs, see Parboiled Rice and Basmati Rice.',
    specs: [
      { key: 'Origin', value: 'Local Nigerian Mills' },
      { key: 'Type', value: 'Parboiled / Long Grain' },
      { key: 'Packaging', value: '50kg bags' },
      { key: 'Min. Order', value: '100 bags' },
      { key: 'Delivery', value: 'Lagos, Abuja, Kano' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Food Service', 'Hospitality', 'FMCG'],
  },
  {
    name: 'Palm Oil',
    slug: 'palm-oil',
    icon: '🫒',
    image: palmOilImg,
    type: 'local',
    categories: ['oils-fats'],
    detail: 'Min. 1,000 litres · South South',
    tagline: 'Bulk palm oil supply for Nigerian food processors and distributors.',
    description:
      'Red and refined palm oil in bulk quantities for food processing, cooking, and distribution across Nigeria. Sourced from mills in the South South and South East.',
    specs: [
      { key: 'Origin', value: 'Delta, Rivers, Cross River' },
      { key: 'Grade', value: 'Red / Refined' },
      { key: 'FFA Level', value: 'Max 5%' },
      { key: 'Min. Order', value: '1,000 litres' },
      { key: 'Packaging', value: 'Drums / Tanker' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Food Processing', 'Soap Making', 'Cooking', 'Distribution'],
  },
  {
    name: 'Maize',
    slug: 'maize',
    icon: '🌽',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80&fit=crop',
    type: 'local',
    categories: ['staples-grains'],
    detail: 'Dried · Min. 10 MT · Plateau, Kaduna',
    tagline: 'Dried yellow maize for feed, flour, and food processing.',
    description:
      'Dried yellow maize sourced from farms in Plateau, Kaduna, and Kano. Used for animal feed production, flour milling, and food processing across Nigeria.',
    specs: [
      { key: 'Origin', value: 'Plateau, Kaduna, Kano' },
      { key: 'Grade', value: 'Grade 1 (yellow)' },
      { key: 'Moisture', value: 'Max 13%' },
      { key: 'Min. Order', value: '10 Metric Tonnes' },
      { key: 'Packaging', value: '100kg jute bags' },
      { key: 'Peak Season', value: 'October – January' },
    ],
    applications: ['Animal Feed', 'Flour Milling', 'Food Processing', 'Starch Production'],
  },
  {
    name: 'Beans',
    slug: 'beans',
    icon: '🫘',
    image: beans,
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
    detail: 'Bulk · Min. 2 MT · Sokoto, Kebbi',
    tagline: 'Fresh Nigerian onions for wholesale markets and food industry.',
    description:
      'Large, pungent red onions from the Sokoto-Kebbi corridor — the largest onion producing zone in Nigeria. Supplied in bulk for wholesale markets, supermarkets, and food processing.',
    specs: [
      { key: 'Origin', value: 'Sokoto, Kebbi, Zamfara' },
      { key: 'Variety', value: 'Red bulb onion' },
      { key: 'Size', value: 'Medium to large' },
      { key: 'Min. Order', value: '2 Metric Tonnes' },
      { key: 'Packaging', value: '50kg mesh bags' },
      { key: 'Availability', value: 'Nov – Apr (peak)' },
    ],
    applications: ['Wholesale Markets', 'Food Processing', 'Supermarkets', 'Food Service'],
  },
  {
    name: 'Cassava',
    slug: 'cassava',
    icon: '🍠',
    image: cassava,
    type: 'local',
    categories: ['staples-grains'],
    detail: 'Fresh/Processed · Min. 5 MT · Oyo, Benue',
    tagline: 'Fresh cassava and processed cassava products for food and industrial use.',
    description:
      'Fresh cassava roots and processed products including cassava flour, starch, and chips sourced from Oyo, Benue, and Cross River. A major staple and industrial raw material.',
    specs: [
      { key: 'Origin', value: 'Oyo, Benue, Cross River' },
      { key: 'Type', value: 'Fresh roots / Chips / Flour' },
      { key: 'Starch Content', value: 'Min. 25%' },
      { key: 'Min. Order', value: '5 Metric Tonnes' },
      { key: 'Packaging', value: 'Bulk / 50kg bags' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Garri Production', 'Starch Industry', 'Animal Feed', 'Food Processing'],
  },
  {
    name: 'Garri',
    slug: 'garri',
    icon: '🍚',
    image: garri,
    type: 'local',
    categories: ['staples-grains'],
    detail: 'White/Yellow · Min. 2 MT · Nationwide',
    tagline: "Nigeria's most popular staple food, available in bulk wholesale.",
    description:
      'Garri is a widely consumed Nigerian staple made from fermented, dried cassava. Available in white and yellow varieties for retail distribution, food service, and export to diaspora markets.',
    specs: [
      { key: 'Origin', value: 'South West / South East' },
      { key: 'Variety', value: 'White / Yellow (toasted)' },
      { key: 'Moisture', value: 'Max 10%' },
      { key: 'Min. Order', value: '2 Metric Tonnes' },
      { key: 'Packaging', value: '25kg / 50kg bags' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Food Service', 'Export (Diaspora)', 'Hospitality'],
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
    image: okra,
    type: 'local',
    categories: ['soup-ingredients'],
    detail: 'Fresh · Min. 1 MT · Northern Nigeria',
    tagline: 'Fresh okra supplied in bulk for wholesale and food service.',
    description:
      'Freshly harvested Nigerian okra supplied in bulk quantities for local markets, supermarkets, food processors, and exporters.',
    specs: [
      { key: 'Origin', value: 'Kaduna, Kano, Plateau' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Crates / Bags' },
      { key: 'Min. Order', value: '1 Metric Tonne' },
      { key: 'Availability', value: 'Seasonal' },
      { key: 'Storage', value: 'Cool & Dry' },
    ],
    applications: ['Wholesale', 'Retail', 'Food Processing', 'Export'],
  },
  {
    name: 'Tomato',
    slug: 'tomato',
    icon: '🍅',
    image: tomato,
    type: 'local',
    categories: ['fresh-produce'],
    family: 'tomato',
    detail: 'Fresh · Min. 2 MT · Kaduna, Kano',
    tagline: 'Premium fresh tomatoes for wholesale supply.',
    description:
      'Fresh Nigerian tomatoes sourced directly from commercial farms for supermarkets, distributors, and food processors. For the processed/packaged forms, see Tomato Paste — Sachet and Tomato Paste — Pouch & Tin.',
    specs: [
      { key: 'Origin', value: 'Kaduna, Kano' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Crates' },
      { key: 'Min. Order', value: '2 Metric Tonnes' },
      { key: 'Availability', value: 'Seasonal' },
      { key: 'Storage', value: 'Cool Environment' },
    ],
    applications: ['Retail', 'Processing', 'Food Service', 'Wholesale'],
  },
  {
    name: 'Chili Pepper',
    slug: 'chili-pepper',
    icon: '🌶️',
    image: chili,
    type: 'local',
    categories: ['spices-seasonings'],
    detail: 'Fresh · Min. 1 MT',
    tagline: 'Fresh chili peppers for local and export markets.',
    description:
      'Premium quality fresh chili peppers supplied in bulk for food processing, restaurants, and export buyers.',
    specs: [
      { key: 'Origin', value: 'Kaduna, Kano' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Crates' },
      { key: 'Min. Order', value: '1 Metric Tonne' },
      { key: 'Availability', value: 'Seasonal' },
      { key: 'Storage', value: 'Refrigerated' },
    ],
    applications: ['Food Processing', 'Retail', 'Export', 'Restaurants'],
  },
  {
    name: 'Green Peas',
    slug: 'green-peas',
    icon: '🫛',
    image: greenpeas,
    type: 'local',
    categories: ['fresh-produce'],
    detail: 'Fresh · Min. 1 MT',
    tagline: 'Fresh green peas for wholesale supply.',
    description:
      'Fresh green peas sourced from local farms and supplied to retailers, processors, and food service businesses.',
    specs: [
      { key: 'Origin', value: 'Plateau, Kaduna' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Bags / Crates' },
      { key: 'Min. Order', value: '1 Metric Tonne' },
      { key: 'Availability', value: 'Seasonal' },
      { key: 'Storage', value: 'Cold Chain' },
    ],
    applications: ['Retail', 'Food Service', 'Processing', 'Export'],
  },
  {
    name: 'Carrot',
    slug: 'carrot',
    icon: '🥕',
    image: carrot,
    type: 'local',
    categories: ['fresh-produce'],
    detail: 'Fresh · Min. 2 MT',
    tagline: 'Farm-fresh carrots for wholesale buyers.',
    description:
      'Premium quality carrots supplied directly from Nigerian farms for supermarkets, distributors, and processors.',
    specs: [
      { key: 'Origin', value: 'Plateau, Kaduna' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Mesh Bags' },
      { key: 'Min. Order', value: '2 Metric Tonnes' },
      { key: 'Availability', value: 'Year-round' },
      { key: 'Storage', value: 'Cool Storage' },
    ],
    applications: ['Retail', 'Food Service', 'Processing', 'Export'],
  },
  {
    name: 'Fresh Pepper',
    slug: 'fresh-pepper',
    icon: '🌶️',
    image: freshpeppers,
    type: 'local',
    categories: ['spices-seasonings'],
    detail: 'Fresh · Min. 1 MT',
    tagline: 'Fresh peppers supplied in commercial quantities.',
    description:
      'High-quality fresh peppers sourced from Nigerian farms for wholesale distribution and food manufacturing.',
    specs: [
      { key: 'Origin', value: 'Kaduna, Kano' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Crates' },
      { key: 'Min. Order', value: '1 Metric Tonne' },
      { key: 'Availability', value: 'Seasonal' },
      { key: 'Storage', value: 'Cool Environment' },
    ],
    applications: ['Wholesale', 'Retail', 'Food Processing', 'Restaurants'],
  },
  {
    name: 'Green Pepper',
    slug: 'green-pepper',
    icon: '🫑',
    image: greenpepper,
    type: 'local',
    categories: ['fresh-produce'],
    detail: 'Fresh · Min. 1 MT',
    tagline: 'Premium green peppers for wholesale supply.',
    description:
      'Fresh green peppers harvested from commercial farms and supplied to food processors and distributors.',
    specs: [
      { key: 'Origin', value: 'Plateau, Kaduna' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Crates' },
      { key: 'Min. Order', value: '1 Metric Tonne' },
      { key: 'Availability', value: 'Seasonal' },
      { key: 'Storage', value: 'Refrigerated' },
    ],
    applications: ['Retail', 'Food Service', 'Processing', 'Export'],
  },
  {
    name: 'Dried Chili Pepper',
    slug: 'dried-chili-pepper',
    icon: '🌶️',
    image: driedchili,
    type: 'local',
    categories: ['spices-seasonings'],
    detail: 'Dried · Min. 1 MT',
    tagline: 'Sun-dried chili peppers for local and export markets.',
    description:
      'Premium dried chili peppers with long shelf life, ideal for spice manufacturers, wholesalers, and exporters.',
    specs: [
      { key: 'Origin', value: 'Kaduna, Kano' },
      { key: 'Type', value: 'Sun Dried' },
      { key: 'Packaging', value: '50kg Bags' },
      { key: 'Min. Order', value: '1 Metric Tonne' },
      { key: 'Availability', value: 'Year-round' },
      { key: 'Moisture', value: 'Max 12%' },
    ],
    applications: ['Spice Production', 'Export', 'Wholesale', 'Food Processing'],
  },
  {
    name: 'Spring Onions',
    slug: 'spring-onions',
    icon: '🧅',
    image: springonions,
    type: 'local',
    categories: ['fresh-produce'],
    detail: 'Fresh · Min. 500kg',
    tagline: 'Fresh spring onions supplied in bulk.',
    description:
      'Fresh spring onions for supermarkets, restaurants, hotels, and food processors requiring reliable wholesale supply.',
    specs: [
      { key: 'Origin', value: 'Plateau, Kaduna' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Bundles / Crates' },
      { key: 'Min. Order', value: '500kg' },
      { key: 'Availability', value: 'Year-round' },
      { key: 'Storage', value: 'Cold Chain' },
    ],
    applications: ['Retail', 'Restaurants', 'Hotels', 'Food Processing'],
  },
  {
    name: 'corn',
    slug: 'corn',
    icon: '🧅',
    image: corn,
    type: 'local',
    categories: ['fresh-produce'],
    family: 'corn',
    detail: 'Fresh · Min. 500kg',
    tagline: 'Fresh corn supplied in bulk.',
    description:
      'Fresh corn for supermarkets, restaurants, hotels, and food processors requiring reliable wholesale supply. For canned corn, see Canned Vegetables.',
    specs: [
      { key: 'Origin', value: 'Plateau, Kaduna' },
      { key: 'Type', value: 'Fresh' },
      { key: 'Packaging', value: 'Bundles / Crates' },
      { key: 'Min. Order', value: '500kg' },
      { key: 'Availability', value: 'Year-round' },
      { key: 'Storage', value: 'Cold Chain' },
    ],
    applications: ['Retail', 'Restaurants', 'Hotels', 'Food Processing'],
  },
  {
    name: 'Ginger',
    slug: 'ginger',
    icon: '🫚',
    image: GingerImg,
    type: 'export',
    categories: ['spices-seasonings', 'export-commodities'],
    family: 'ginger',
    detail: 'Dried/Split · Min. 5 MT · Kaduna, Nasarawa',
    tagline: 'Premium Nigerian ginger for export markets.',
    description:
      'Nigeria is one of the world\u2019s top ginger producers. Split, dried ginger sourced from Kaduna and Nasarawa for spice manufacturers and export buyers. For the retail powdered form, see Ginger Powder.',
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
    image: cocoaimg,
    type: 'export',
    categories: ['export-commodities'],
    detail: 'Grade 1 · Min. 10 MT · Ondo, Cross River',
    tagline: 'Fermented, sun-dried cocoa beans for international buyers.',
    description:
      'Grade 1 fermented and sun-dried cocoa beans sourced from Ondo, Cross River, and Osun — Nigeria\u2019s leading cocoa belt. Supplied to chocolate manufacturers and export buyers.',
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
    image: groundnut,
    type: 'export',
    categories: ['legumes-nuts', 'export-commodities'],
    detail: 'Raw/Shelled · Min. 10 MT · Kano, Jigawa',
    tagline: 'Quality Nigerian groundnuts for export and processing.',
    description:
      'Raw and shelled groundnuts sourced from Kano and Jigawa, historically one of Nigeria\u2019s largest export crops. Supplied for oil extraction, confectionery, and export.',
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
    image: soyabeans,
    type: 'export',
    categories: ['legumes-nuts', 'export-commodities'],
    detail: 'Grade 1 · Min. 10 MT · Benue, Kaduna',
    tagline: 'Non-GMO Nigerian soyabeans for export and processing.',
    description:
      'Non-GMO soyabeans sourced from Benue and Kaduna for oil extraction, animal feed production, and export to international buyers.',
    specs: [
      { key: 'Origin', value: 'Benue, Kaduna' },
      { key: 'Type', value: 'Non-GMO' },
      { key: 'Moisture', value: 'Max 13%' },
      { key: 'Min. Order', value: '10 Metric Tonnes' },
      { key: 'Packaging', value: '50kg bags / Bulk' },
      { key: 'Availability', value: 'Oct – Jan (peak)' },
    ],
    applications: ['Oil Extraction', 'Animal Feed', 'Export', 'Food Processing'],
  },
  {
    name: 'Shea Butter',
    slug: 'shea-butter',
    icon: '✨',
    image: SBIMG,
    type: 'export',
    categories: ['oils-fats', 'export-commodities'],
    detail: 'Raw/Refined · Min. 1,000kg · Niger, Kwara',
    tagline: 'Raw and refined shea butter for cosmetic and food export markets.',
    description:
      'Raw and refined shea butter sourced from Niger and Kwara states, hand-processed by women\u2019s cooperatives. Supplied to cosmetic manufacturers and food-grade fat buyers internationally.',
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
  // master_product_catalog.md. Supersedes the earlier flat (non-variant)
  // branded grocery entries added in a prior revision — those slugs
  // (semovita, spaghetti, tomato-paste, corned-beef, powdered-milk,
  // sugar, salt, sweet-corn-canned, green-beans-canned,
  // local-rice-branded, imported-long-grain-rice, seasoning-cubes,
  // vegetable-oil, curry-powder, thyme, chicken-seasoning,
  // ground-pepper, ground-ginger, garlic-powder, coconut-milk) are
  // REMOVED here and replaced by the variant-based versions below,
  // which carry real brand/size data instead of generic placeholders.
  // ================================================================

  {
    name: 'Parboiled Rice',
    slug: 'rice-parboiled',
    icon: '🌾',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Parboiled+Rice',
    type: 'local',
    categories: ['staples-grains'],
    family: 'rice',
    detail: 'Branded parboiled rice · 5kg – 50kg · Multiple brands',
    tagline: 'Branded parboiled rice in the sizes Nigerian households and traders buy most.',
    description:
      'Parboiled rice from the leading Nigerian and imported brands, in retail and semi-wholesale pack sizes. Choose a brand and size below. For bulk 50kg wholesale sacks, see the main Rice listing.',
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
      },
      {
        slug: 'rice-parboiled--mama-gold--5kg',
        brand: 'Mama Gold Supreme Quality Thai Parboiled Rice',
        size: '5kg',
      },
      {
        slug: 'rice-parboiled--mamas-pride--5kg',
        brand: "Mama's Pride Parboiled Rice",
        size: '5kg',
      },
      {
        slug: 'rice-parboiled--my-choice--50kg',
        brand: 'My Choice Silver Indian Long Grain Parboiled Rice',
        size: '50kg',
      },
    ],
  },
  {
    name: 'Basmati Rice',
    slug: 'rice-basmati',
    icon: '🌾',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Basmati+Rice',
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
      },
      {
        slug: 'rice-basmati--aeroplane--5kg',
        brand: 'Aeroplane La-Taste Indian Basmati Rice',
        size: '5kg',
      },
      {
        slug: 'rice-basmati--golden-grain--5kg',
        brand: 'Golden Grain 1121 XXXL Golden Sella Basmati Rice',
        size: '5kg',
      },
      {
        slug: 'rice-basmati--maharani-mini-dubar--10kg',
        brand: 'Maharani Mini Dubar Basmati Rice',
        size: '10kg',
      },
      {
        slug: 'rice-basmati--maharani-parboiled--1kg',
        brand: 'Maharani Parboiled Basmati Long Grain Rice',
        size: '1kg',
      },
      {
        slug: 'rice-basmati--tropical-sun--5kg',
        brand: 'Tropical Sun Golden Sella Pure Basmati Rice',
        size: '5kg',
      },
      {
        slug: 'rice-basmati--tropical-sun--10kg',
        brand: 'Tropical Sun Golden Sella Pure Basmati Rice',
        size: '10kg',
      },
    ],
  },
  {
    name: 'Semovita',
    slug: 'semovita',
    icon: '🍲',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Semovita',
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
      { slug: 'semovita--golden-penny--1kg', brand: 'Golden Penny Semovita', size: '1kg' },
      { slug: 'semovita--golden-penny--2kg', brand: 'Golden Penny Semovita', size: '2kg' },
    ],
  },
  {
    name: 'Semolina',
    slug: 'semolina',
    icon: '🍲',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Semolina',
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
      { slug: 'semolina--honeywell--900g', brand: 'Honeywell Semolina', size: '900g' },
      { slug: 'semolina--honeywell--1-8kg', brand: 'Honeywell Semolina', size: '1.8kg' },
      { slug: 'semolina--mama-gold--5kg', brand: 'Mama Gold Pure White Semolina', size: '5kg' },
    ],
  },
  {
    name: 'Spaghetti',
    slug: 'spaghetti',
    icon: '🍝',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Spaghetti',
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
      { slug: 'spaghetti--crown-premium--500g', brand: 'Crown Premium Spaghetti', size: '500g' },
      { slug: 'spaghetti--dangote--500g', brand: 'Dangote Pasta Spaghetti Standard', size: '500g' },
      {
        slug: 'spaghetti--golden-penny-spaghettini--500g',
        brand: 'Golden Penny Spaghettini',
        size: '500g',
      },
    ],
  },
  {
    name: 'Powdered Milk',
    slug: 'milk-powder',
    icon: '🥛',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Powdered+Milk',
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
      },
      {
        slug: 'milk-powder--dano-cool-cow--2kg',
        brand: 'Dano Cool Cow Instant Filled Milk Powder',
        size: '2kg',
      },
      {
        slug: 'milk-powder--dano-full-cream--350g',
        brand: 'Dano Full Cream Milk Powder',
        size: '350g',
      },
      {
        slug: 'milk-powder--peak-full-cream--850g',
        brand: 'Peak Full Cream Instant Milk Powder',
        size: '850g',
      },
      {
        slug: 'milk-powder--peak-instant-tin--400g',
        brand: 'Peak Instant Full Cream Milk Powder (Tin)',
        size: '400g',
      },
      {
        slug: 'milk-powder--peak-value-pack--350g',
        brand: 'Peak Milk Powder (Value Pack Pouch)',
        size: '350g',
      },
      {
        slug: 'milk-powder--three-crowns-instant--350g',
        brand: 'Three Crowns Instant Filled Milk Powder',
        size: '350g',
      },
    ],
  },
  {
    name: 'Evaporated Milk',
    slug: 'milk-evaporated',
    icon: '🥛',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Evaporated+Milk',
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
      },
    ],
  },
  {
    name: 'Sugar',
    slug: 'sugar',
    icon: '🍬',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Sugar',
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
      },
      { slug: 'sugar--dangote--1kg', brand: 'Dangote Refined Granulated White Sugar', size: '1kg' },
      {
        slug: 'sugar--golden-penny--250g',
        brand: 'Golden Penny Premium White Granulated Sugar',
        size: '250g',
      },
      {
        slug: 'sugar--golden-penny--1kg',
        brand: 'Golden Penny Premium White Granulated Sugar',
        size: '1kg',
      },
      {
        slug: 'sugar--st-louis-cube--500g',
        brand: 'St. Louis Cube Sugar (90-cube box)',
        size: '500g',
      },
    ],
  },
  {
    name: 'Salt',
    slug: 'salt',
    icon: '🧂',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Salt',
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
      { slug: 'salt--annapurna-sea--1kg', brand: 'Annapurna Premium Sea Salt', size: '1kg' },
      {
        slug: 'salt--annapurna-iodated--250g',
        brand: 'Annapurna Refined Iodated Salt',
        size: '250g',
      },
      {
        slug: 'salt--annapurna-iodated--500g',
        brand: 'Annapurna Refined Iodated Salt',
        size: '500g',
      },
      { slug: 'salt--dangote--500g', brand: 'Dangote Refined & Iodized Salt', size: '500g' },
      { slug: 'salt--dangote--1kg', brand: 'Dangote Refined & Iodized Salt', size: '1kg' },
      { slug: 'salt--mr-chef--500g', brand: 'Mr. Chef Refined & Iodized Salt', size: '500g' },
      { slug: 'salt--mr-chef--1kg', brand: 'Mr. Chef Refined & Iodized Salt', size: '1kg' },
    ],
  },
  {
    name: 'Tomato Paste — Sachet',
    slug: 'tomato-paste-sachet',
    icon: '🫙',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Tomato+Sachet',
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
      },
      {
        slug: 'tomato-paste-sachet--gino-magic--70g',
        brand: 'Gino Magic Peppe & Onion Tomato Seasoning Mix',
        size: '70g',
      },
      { slug: 'tomato-paste-sachet--gino--70g', brand: 'Gino Tomato Mix (Sachet)', size: '70g' },
      {
        slug: 'tomato-paste-sachet--sonia-pouch--210g',
        brand: 'Sonia Tomato Mix (Pouch)',
        size: '210g',
      },
      {
        slug: 'tomato-paste-sachet--tasty-tom--70g',
        brand: 'Tasty Tom Tomato Mix (Sachet)',
        size: '70g',
      },
    ],
  },
  {
    name: 'Tomato Paste — Pouch & Tin',
    slug: 'tomato-paste-tin',
    icon: '🥫',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Tomato+Tin',
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
      },
      {
        slug: 'tomato-paste-tin--de-rica--400g',
        brand: 'De Rica Tomato Paste (Tin)',
        size: '400g',
      },
      { slug: 'tomato-paste-tin--gino--400g', brand: 'Gino Tomato Mix (Tin/Can)', size: '400g' },
      {
        slug: 'tomato-paste-tin--tasty-tom-pouch--210g',
        brand: 'Tasty Tom Enriched Tomato Mix (Pouch)',
        size: '210g',
      },
    ],
  },
  {
    name: 'Corned Beef',
    slug: 'corned-beef',
    icon: '🥫',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Corned+Beef',
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
      },
      {
        slug: 'corned-beef--exeter-tapered--340g',
        brand: 'Exeter Corned Beef (Tapered Can)',
        size: '340g',
      },
      {
        slug: 'corned-beef--fray-bentos-round--200g',
        brand: 'Fray Bentos Corned Beef (Round Can)',
        size: '200g',
      },
      {
        slug: 'corned-beef--fray-bentos-tapered--340g',
        brand: 'Fray Bentos Corned Beef (Tapered Can)',
        size: '340g',
      },
      {
        slug: 'corned-beef--ox-palm-round--326g',
        brand: 'Ox & Palm Corned Beef (Round Can)',
        size: '326g',
      },
      {
        slug: 'corned-beef--ox-palm-tall--326g',
        brand: 'Ox & Palm Corned Beef (Tall Can)',
        size: '326g',
      },
    ],
  },
  {
    name: 'Vegetable Oil',
    slug: 'vegetable-oil',
    icon: '🛢️',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Vegetable+Oil',
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
      },
      { slug: 'veg-oil--power-oil-pure--1l', brand: 'Power Oil Pure Vegetable Oil', size: '1L' },
      {
        slug: 'veg-oil--power-oil-pure--1-4l',
        brand: 'Power Oil Pure Vegetable Oil',
        size: '1.4L',
      },
      { slug: 'veg-oil--power-oil-pure--2l', brand: 'Power Oil Pure Vegetable Oil', size: '2L' },
      { slug: 'veg-oil--power-oil-pure--3l', brand: 'Power Oil Pure Vegetable Oil', size: '3L' },
      {
        slug: 'veg-oil--power-oil-palm-olein--4-5l',
        brand: 'Power Oil Refined Palm Olein Vegetable Oil',
        size: '4.5L',
      },
      {
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
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Curry+Powder',
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
      },
      {
        slug: 'curry-powder--sonia--pack',
        brand: 'Sonia Curry Powder (Buy 10 Get 1 Free Pack)',
        size: 'Pack',
      },
      { slug: 'curry-powder--tiger--sachet', brand: 'Tiger Curry Powder', size: 'Standard Sachet' },
    ],
  },
  {
    name: 'Thyme Leaves',
    slug: 'thyme',
    icon: '🌿',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Thyme',
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
      { slug: 'thyme--gino--sachet', brand: 'Gino Herbs & Spices Dried Thyme', size: 'Sachet' },
      { slug: 'thyme--sonia--sachet', brand: 'Sonia Thyme Leaves', size: 'Sachet' },
      {
        slug: 'thyme--spice-supreme--42g',
        brand: 'Spice Supreme Thyme Leaves',
        size: '1.5oz (42g)',
      },
    ],
  },
  {
    name: 'Pepper Powder',
    slug: 'pepper-powder',
    icon: '🌶️',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Pepper+Powder',
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
      },
      {
        slug: 'pepper-powder--gino--3-sachet-strip',
        brand: 'Gino Herbs & Spices Red Hot Pepper Powder',
        size: '3-Sachet Strip',
      },
      {
        slug: 'pepper-powder--sonia--sachet',
        brand: 'Sonia Chilli Pepper Powder (Hot Pepper)',
        size: 'Sachet',
      },
    ],
  },
  {
    name: 'Ginger Powder',
    slug: 'ginger-powder',
    icon: '🫘',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Ginger+Powder',
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
      { slug: 'ginger-powder--sonia--sachet', brand: 'Sonia Ginger Powder', size: 'Sachet' },
    ],
  },
  {
    name: 'Garlic Powder',
    slug: 'garlic-powder',
    icon: '🧄',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Garlic+Powder',
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
      },
    ],
  },
  {
    name: 'Seasoning Cubes',
    slug: 'seasoning-cubes',
    icon: '🧂',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Seasoning+Cubes',
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
      },
      {
        slug: 'seasoning-cubes--maggi-stock--480g',
        brand: 'Maggi Chicken Stock Cubes (24 x 20g)',
        size: '480g',
      },
    ],
  },
  {
    name: 'Chicken Seasoning Powder',
    slug: 'chicken-seasoning-powder',
    icon: '🧂',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Chicken+Seasoning',
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
      },
    ],
  },
  {
    name: 'Coconut Milk & Cream',
    slug: 'coconut-milk-cream',
    icon: '🥥',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Coconut+Milk',
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
      },
      { slug: 'coconut--sunripe-milk--400ml', brand: 'Sunripe Coconut Milk', size: '400ml' },
    ],
  },
  {
    name: 'Canned Vegetables',
    slug: 'canned-vegetables',
    icon: '🥫',
    image: 'https://placehold.co/600x600/f5f0e6/6b5637?text=Canned+Veg',
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
      },
      {
        slug: 'canned-veg--del-monte-sweet-corn--410g',
        brand: 'Del Monte Golden Sweet Corn (Can)',
        size: '410g',
      },
      {
        slug: 'canned-veg--farrows-marrowfat-peas--300g',
        brand: "Farrow's Giant Marrowfat Peas (Can)",
        size: '300g',
      },
      {
        slug: 'canned-veg--green-giant-green-beans--398ml',
        brand: 'Green Giant Cut Green Beans (Can)',
        size: '398ml (14fl oz)',
      },
      {
        slug: 'canned-veg--sunripe-sweetcorn--400g',
        brand: 'Sunripe Whole Sweetcorn (Can)',
        size: '400g',
      },
    ],
  },
]
