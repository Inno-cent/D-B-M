export interface MealKitSize {
  servings: number
  priceNgn: number
}

export interface MealKitIngredient {
  name: string
  amount: string
}

export interface MealKitAddOn {
  id: string
  name: string
  image: string
  priceNgn: number
}

export interface MealKit {
  slug: string
  name: string
  image: string
  galleryImages: string[]
  tagline: string
  description: string
  badge?: string
  rating: number
  reviewCount: number
  sizes: MealKitSize[]
  ingredients: MealKitIngredient[]
  addOns: MealKitAddOn[]
}

// Placeholder data — replace with real catalogue / Supabase fetch.
// Prices are per-size, distinct from the single-price-per-unit model
// used by `data/products.ts`.
export const mealKits: MealKit[] = [
  {
    slug: 'jollof-rice-kit',
    name: 'Jollof Rice Kit',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80&fit=crop',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80&fit=crop',
    ],
    tagline: 'Everything you need to make delicious party-style Jollof Rice at home.',
    description: 'Everything you need to make delicious party-style Jollof Rice at home.',
    badge: 'Best Seller',
    rating: 4.8,
    reviewCount: 124,
    sizes: [
      { servings: 2, priceNgn: 4500 },
      { servings: 4, priceNgn: 7500 },
      { servings: 6, priceNgn: 9500 },
    ],
    ingredients: [
      { name: 'Parboiled Rice', amount: '2kg' },
      { name: 'Tomatoes', amount: '3pcs' },
      { name: 'Red Bell Peppers (Tatashe)', amount: '4pcs' },
      { name: 'Onions', amount: '4pcs' },
      { name: 'Tomato Paste', amount: '70g' },
      { name: 'Vegetable Oil', amount: '250ml' },
      { name: 'Bay Leaves', amount: '3pcs' },
      { name: 'Curry & Thyme', amount: '10g' },
      { name: 'Stock Cubes', amount: '4pcs' },
      { name: 'Ginger & Garlic', amount: '30g' },
    ],
    addOns: [
      {
        id: 'chicken',
        name: 'Chicken',
        image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200&q=80&fit=crop',
        priceNgn: 2500,
      },
      {
        id: 'beef',
        name: 'Beef',
        image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=200&q=80&fit=crop',
        priceNgn: 3000,
      },
      {
        id: 'beef-2',
        name: 'Beef (Assorted)',
        image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&q=80&fit=crop',
        priceNgn: 3500,
      },
      {
        id: 'goat-meat',
        name: 'Goat Meat',
        image: 'https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?w=200&q=80&fit=crop',
        priceNgn: 4200,
      },
    ],
  },
  {
    slug: 'egusi-soup-kit',
    name: 'Egusi Soup Kit',
    image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600&q=80&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600&q=80&fit=crop',
    ],
    tagline: 'Rich, hearty Egusi soup with all the ground melon-seed goodness, pre-measured.',
    description: 'Rich, hearty Egusi soup with all the ground melon-seed goodness, pre-measured.',
    rating: 4.6,
    reviewCount: 58,
    sizes: [
      { servings: 2, priceNgn: 4200 },
      { servings: 4, priceNgn: 7000 },
      { servings: 6, priceNgn: 9000 },
    ],
    ingredients: [
      { name: 'Ground Egusi (Melon Seeds)', amount: '500g' },
      { name: 'Palm Oil', amount: '250ml' },
      { name: 'Spinach / Ugu', amount: '1 bunch' },
      { name: 'Onions', amount: '2pcs' },
      { name: 'Stock Cubes', amount: '3pcs' },
      { name: 'Pepper Mix', amount: '100g' },
    ],
    addOns: [
      {
        id: 'chicken',
        name: 'Chicken',
        image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200&q=80&fit=crop',
        priceNgn: 2500,
      },
      {
        id: 'stockfish',
        name: 'Stockfish',
        image: 'https://images.unsplash.com/photo-1611171711912-13d9b4e2b0e6?w=200&q=80&fit=crop',
        priceNgn: 3800,
      },
    ],
  },
  {
    slug: 'fried-rice-kit',
    name: 'Fried Rice Kit',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80&fit=crop',
    ],
    tagline: 'Colourful, veg-packed Nigerian-style fried rice, ready to cook in one pot.',
    description: 'Colourful, veg-packed Nigerian-style fried rice, ready to cook in one pot.',
    rating: 4.7,
    reviewCount: 91,
    sizes: [
      { servings: 2, priceNgn: 4800 },
      { servings: 4, priceNgn: 8000 },
      { servings: 6, priceNgn: 10500 },
    ],
    ingredients: [
      { name: 'Long Grain Rice', amount: '2kg' },
      { name: 'Mixed Vegetables (Carrot, Peas, Sweetcorn)', amount: '400g' },
      { name: 'Green Beans', amount: '200g' },
      { name: 'Liver', amount: '250g' },
      { name: 'Curry & Thyme', amount: '10g' },
      { name: 'Vegetable Oil', amount: '250ml' },
      { name: 'Stock Cubes', amount: '4pcs' },
    ],
    addOns: [
      {
        id: 'chicken',
        name: 'Chicken',
        image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200&q=80&fit=crop',
        priceNgn: 2500,
      },
      {
        id: 'prawns',
        name: 'Prawns',
        image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200&q=80&fit=crop',
        priceNgn: 4500,
      },
    ],
  },
  {
    slug: 'pepper-soup-kit',
    name: 'Pepper Soup Kit',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80&fit=crop',
    ],
    tagline: 'A warming, spicy Nigerian pepper soup base with all the aromatics measured out.',
    description: 'A warming, spicy Nigerian pepper soup base with all the aromatics measured out.',
    rating: 4.9,
    reviewCount: 76,
    sizes: [
      { servings: 2, priceNgn: 4300 },
      { servings: 4, priceNgn: 7200 },
      { servings: 6, priceNgn: 9200 },
    ],
    ingredients: [
      { name: 'Pepper Soup Spice Mix', amount: '50g' },
      { name: 'Scent Leaves (Nchanwu)', amount: '1 bunch' },
      { name: 'Onions', amount: '2pcs' },
      { name: 'Ginger & Garlic', amount: '30g' },
      { name: 'Stock Cubes', amount: '3pcs' },
      { name: 'Habanero Peppers', amount: '5pcs' },
    ],
    addOns: [
      {
        id: 'goat-meat',
        name: 'Goat Meat',
        image: 'https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?w=200&q=80&fit=crop',
        priceNgn: 4200,
      },
      {
        id: 'catfish',
        name: 'Catfish',
        image: 'https://images.unsplash.com/photo-1611171711912-13d9b4e2b0e6?w=200&q=80&fit=crop',
        priceNgn: 3900,
      },
      {
        id: 'cow-leg',
        name: 'Cow Leg',
        image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=200&q=80&fit=crop',
        priceNgn: 3600,
      },
    ],
  },
  {
    slug: 'efo-riro-kit',
    name: 'Efo Riro Kit',
    image: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=600&q=80&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=600&q=80&fit=crop',
    ],
    tagline: 'Classic Yoruba vegetable soup with spinach, peppers, and palm oil, pre-portioned.',
    description:
      'Classic Yoruba vegetable soup with spinach, peppers, and palm oil, pre-portioned.',
    rating: 4.7,
    reviewCount: 64,
    sizes: [
      { servings: 2, priceNgn: 4000 },
      { servings: 4, priceNgn: 6800 },
      { servings: 6, priceNgn: 8800 },
    ],
    ingredients: [
      { name: 'Spinach (Efo)', amount: '2 bunches' },
      { name: 'Palm Oil', amount: '250ml' },
      { name: 'Red Bell Peppers (Tatashe)', amount: '4pcs' },
      { name: 'Onions', amount: '3pcs' },
      { name: 'Locust Beans (Iru)', amount: '30g' },
      { name: 'Stock Cubes', amount: '3pcs' },
    ],
    addOns: [
      {
        id: 'beef',
        name: 'Beef',
        image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=200&q=80&fit=crop',
        priceNgn: 3000,
      },
      {
        id: 'shaki',
        name: 'Shaki (Tripe)',
        image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&q=80&fit=crop',
        priceNgn: 2800,
      },
    ],
  },
]
