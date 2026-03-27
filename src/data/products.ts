export interface Product {
  name: string
  slug: string
  icon: string
  type: 'export' | 'local'
  detail: string
  tagline: string
  description: string
  specs: { key: string; value: string }[]
  applications: string[]
}

export const products: Product[] = [
  {
    name: 'Sesame Seeds', slug: 'sesame-seeds', icon: '🌿', type: 'export',
    detail: 'Grade A · Min. 25 MT · Jigawa, Borno',
    tagline: 'Premium grade Nigerian sesame seeds for global food and oil markets.',
    description: 'High-oil content sesame seeds sourced from verified cooperative farms across North East Nigeria. Consistently graded, cleaned, and moisture-tested before every shipment to international buyers.',
    specs: [
      { key: 'Origin', value: 'Jigawa, Borno, Gombe' },
      { key: 'Grade', value: 'Grade A (99% purity)' },
      { key: 'Moisture Level', value: 'Max 6%' },
      { key: 'Min. Order Qty', value: '25 Metric Tonnes' },
      { key: 'Packaging', value: '25kg / 50kg PP bags' },
      { key: 'Peak Season', value: 'October – February' },
    ],
    applications: ['Oil Processing', 'Food Manufacturing', 'Confectionery', 'Export Trade'],
  },
  {
    name: 'Hibiscus Flower', slug: 'hibiscus-flower', icon: '🌺', type: 'export',
    detail: 'Dried · Min. 5 MT · Kano, Kaduna',
    tagline: 'Dried hibiscus flowers for beverage, pharmaceutical, and food industries.',
    description: 'Deep red, high-grade dried hibiscus sourced from farms in Kano and Kaduna. Sorted, cleaned, and packaged to meet EU and Asian import standards.',
    specs: [
      { key: 'Origin', value: 'Kano, Kaduna, Sokoto' },
      { key: 'Grade', value: 'Grade A (whole calyxes)' },
      { key: 'Moisture Level', value: 'Max 12%' },
      { key: 'Min. Order Qty', value: '5 Metric Tonnes' },
      { key: 'Packaging', value: '20kg / 25kg PP bags' },
      { key: 'Peak Season', value: 'November – March' },
    ],
    applications: ['Beverages', 'Pharmaceuticals', 'Food Colouring', 'Cosmetics'],
  },
  {
    name: 'Ginger', slug: 'ginger', icon: '🫚', type: 'export',
    detail: 'Dried/Split · Min. 10 MT · Kaduna',
    tagline: "High-pungency dried ginger from Nigeria's premier ginger belt.",
    description: "Split and dried Nigerian ginger with high gingerol content, sourced from Kaduna and Nasarawa. One of Nigeria's top export commodities with strong demand in Asia and Europe.",
    specs: [
      { key: 'Origin', value: 'Kaduna, Nasarawa, Plateau' },
      { key: 'Grade', value: 'Split/Whole dried' },
      { key: 'Moisture Level', value: 'Max 10%' },
      { key: 'Min. Order Qty', value: '10 Metric Tonnes' },
      { key: 'Packaging', value: '50kg jute bags' },
      { key: 'Peak Season', value: 'January – April' },
    ],
    applications: ['Food Processing', 'Pharmaceuticals', 'Spice Trade', 'Essential Oils'],
  },
  {
    name: 'Cashew Nuts', slug: 'cashew-nuts', icon: '🥜', type: 'export',
    detail: 'Grade W320 · Min. 20 MT · Oyo, Kwara',
    tagline: 'Raw and processed cashew nuts from verified Nigerian farms.',
    description: 'High-quality raw cashew nuts and processed cashew kernels sourced from farms in Oyo, Kwara, and Kogi. Graded to W180, W240, W320 specifications for export.',
    specs: [
      { key: 'Origin', value: 'Oyo, Kwara, Kogi, Enugu' },
      { key: 'Grade', value: 'W180 / W240 / W320' },
      { key: 'Moisture Level', value: 'Max 8%' },
      { key: 'Min. Order Qty', value: '20 Metric Tonnes' },
      { key: 'Packaging', value: '25kg vacuum bags' },
      { key: 'Peak Season', value: 'March – June' },
    ],
    applications: ['Snack Industry', 'Food Manufacturing', 'Confectionery', 'Export Trade'],
  },
  {
    name: 'Shea Butter', slug: 'shea-butter', icon: '✨', type: 'export',
    detail: 'Refined/Crude · Min. 5 MT · North',
    tagline: 'Refined and crude shea butter from Northern Nigeria.',
    description: 'Premium quality shea butter extracted from shea nuts harvested across Northern Nigeria. Available in both crude and refined forms for cosmetics, food, and pharmaceutical applications.',
    specs: [
      { key: 'Origin', value: 'Kwara, Niger, Kebbi, Kogi' },
      { key: 'Grade', value: 'Grade A Crude / Refined' },
      { key: 'FFA Level', value: 'Max 5% (crude)' },
      { key: 'Min. Order Qty', value: '5 Metric Tonnes' },
      { key: 'Packaging', value: '25kg / 200kg drums' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Cosmetics', 'Food Industry', 'Pharmaceuticals', 'Soap Making'],
  },
  {
    name: 'Rice', slug: 'rice', icon: '🌾', type: 'local',
    detail: '50kg bags · Min. 100 bags · Local supply',
    tagline: 'Wholesale rice supply for Nigerian businesses and distributors.',
    description: 'Quality parboiled and long-grain rice in 50kg bags for wholesale distribution across Nigeria. Sourced from local mills and processors with consistent quality.',
    specs: [
      { key: 'Origin', value: 'Local Nigerian Mills' },
      { key: 'Type', value: 'Parboiled / Long Grain' },
      { key: 'Packaging', value: '50kg bags' },
      { key: 'Min. Order Qty', value: '100 bags' },
      { key: 'Delivery', value: 'Lagos, Abuja, Kano' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Retail Distribution', 'Food Service', 'Hospitality', 'FMCG'],
  },
  {
    name: 'Palm Oil', slug: 'palm-oil', icon: '🫒', type: 'local',
    detail: 'Min. 1,000 litres · South South',
    tagline: 'Bulk palm oil supply for Nigerian food processors and distributors.',
    description: 'Red and refined palm oil in bulk quantities for food processing, cooking, and distribution across Nigeria. Sourced from mills in the South South and South East.',
    specs: [
      { key: 'Origin', value: 'Delta, Rivers, Cross River' },
      { key: 'Grade', value: 'Red / Refined' },
      { key: 'FFA Level', value: 'Max 5%' },
      { key: 'Min. Order Qty', value: '1,000 litres' },
      { key: 'Packaging', value: 'Drums / Tanker' },
      { key: 'Availability', value: 'Year-round' },
    ],
    applications: ['Food Processing', 'Soap Making', 'Cooking', 'Distribution'],
  },
  {
    name: 'Maize', slug: 'maize', icon: '🌽', type: 'local',
    detail: 'Dried · Min. 10 MT · Plateau, Kaduna',
    tagline: 'Dried yellow maize for feed, flour, and food processing.',
    description: 'Dried yellow maize sourced from farms in Plateau, Kaduna, and Kano. Used for animal feed production, flour milling, and food processing across Nigeria.',
    specs: [
      { key: 'Origin', value: 'Plateau, Kaduna, Kano' },
      { key: 'Grade', value: 'Grade 1 (yellow)' },
      { key: 'Moisture Level', value: 'Max 13%' },
      { key: 'Min. Order Qty', value: '10 Metric Tonnes' },
      { key: 'Packaging', value: '100kg jute bags' },
      { key: 'Peak Season', value: 'October – January' },
    ],
    applications: ['Animal Feed', 'Flour Milling', 'Food Processing', 'Starch Production'],
  },
]