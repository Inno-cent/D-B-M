import { getProductImageUrl } from '@/lib/supabase'

export interface Category {
  slug: string
  label: string
  image: string
}

export const categories: Category[] = [
  {
    slug: 'staples-grains',
    label: 'Staples & Grains',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&q=80&fit=crop',
  },
  {
    slug: 'fresh-produce',
    label: 'Fresh Produce',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=200&q=80&fit=crop',
  },
  {
    slug: 'meat-fish',
    label: 'Meat & Fish',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&q=80&fit=crop',
  },
  {
    slug: 'oils-fats',
    label: 'Oils & Fats',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&q=80&fit=crop',
  },
  {
    slug: 'soup-ingredients',
    label: 'Soup Ingredients',
    image: 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=200&q=80&fit=crop',
  },
  {
    slug: 'spices-seasonings',
    label: 'Spices & Seasonings',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&q=80&fit=crop',
  },
  {
    slug: 'legumes-nuts',
    label: 'Legumes & Nuts',
    image: 'https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=200&q=80&fit=crop',
  },
  {
    slug: 'breakfast-drinks',
    label: 'Breakfast & Drinks',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&q=80&fit=crop',
  },
  {
    slug: 'dairy',
    label: 'Dairy',
    // Peak Full Cream Instant Milk Powder
    image: getProductImageUrl('ChatGPT Image Sep 11, 2026, 07_33_25 PM', 'png'),
  },
  {
    slug: 'canned-goods',
    label: 'Canned Goods',
    // Exeter Premium Corned Beef can
    image: getProductImageUrl('ChatGPT Image Sep 11, 2026, 07_32_06 PM_2', 'png'),
  },
  {
    slug: 'pantry-essentials',
    label: 'Pantry Essentials',
    // Dangote Refined Granulated White Sugar (1kg)
    image: getProductImageUrl('ChatGPT Image Sep 11, 2026, 07_35_36 PM', 'png'),
  },
  {
    slug: 'others',
    label: 'Others',
    image: 'https://images.unsplash.com/photo-1601599963565-b7f49deb2699?w=200&q=80&fit=crop',
  },
]