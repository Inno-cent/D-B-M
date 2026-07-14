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
import chili from "@/assets/chili.jpg"
import driedchili from '@/assets/driedchili.jpg'
import freshpeppers from "@/assets/freshpeppers.jpg"
import greenpepper from "@/assets/greenpepper.jpg"
import greenpeas from "@/assets/greenpeas.jpg"
import okra from '@/assets/okra.jpg'
import tomato from '@/assets/tomato.jpg'
import corn from '@/assets/corn.jpg'
import rice from '@/assets/rice.jpg'

export interface Product {
  name: string
  slug: string
  icon: string
  image: string
  type: 'export' | 'local'
  detail: string
  tagline: string
  description: string
  specs: { key: string; value: string }[]
  applications: string[]
}

export const products: Product[] = [
  {
    name: 'Rice',
    slug: 'rice',
    icon: '🌾',
    image: rice,
    type: 'local',
    detail: '50kg bags · Min. 100 bags · Local supply',
    tagline: 'Wholesale rice supply for Nigerian businesses and distributors.',
    description:
      'Quality parboiled and long-grain rice in 50kg bags for wholesale distribution across Nigeria. Sourced from local mills and processors with consistent quality and competitive pricing.',
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
    detail: 'Fresh · Min. 2 MT · Kaduna, Kano',
    tagline: 'Premium fresh tomatoes for wholesale supply.',
    description:
      'Fresh Nigerian tomatoes sourced directly from commercial farms for supermarkets, distributors, and food processors.',
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
    detail: 'Fresh · Min. 500kg',
    tagline: 'Fresh corn supplied in bulk.',
    description:
      'Fresh corn for supermarkets, restaurants, hotels, and food processors requiring reliable wholesale supply.',
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
]
