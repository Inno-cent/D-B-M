<template>
  <section class="section-padding !py-14 md:!py-16 bg-white border-t-2 border-earth-200">
    <div class="container-max">
      <h2 class="text-2xl md:text-3xl font-bold text-earth-900 mb-6" data-reveal>
        Shop by Category
      </h2>

      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-y-6 gap-x-3">
        <RouterLink
          v-for="cat in categories"
          :key="cat.slug"
          :to="`/products?category=${cat.slug}`"
          class="flex flex-col items-center gap-2 group"
          data-reveal
        >
          <span
            class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-earth-200 group-hover:border-forest-400 transition-colors bg-parchment"
          >
            <img :src="cat.image" :alt="cat.label" class="w-full h-full object-cover" />
          </span>
          <span
            class="text-xs sm:text-sm text-earth-800 font-medium text-center leading-tight"
          >
            {{ cat.label }}
          </span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface Category {
  slug: string;
  label: string;
  image: string;
}

// Placeholder imagery — swap for real category photos, or wire to a categories store/fetch.
withDefaults(defineProps<{ categories?: Category[] }>(), {
  categories: () => [
    {
      slug: "staples-grains",
      label: "Staples & Grains",
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&q=80&fit=crop",
    },
    {
      slug: "fresh-produce",
      label: "Fresh Produce",
      image:
        "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=200&q=80&fit=crop",
    },
    {
      slug: "meat-fish",
      label: "Meat & Fish",
      image:
        "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&q=80&fit=crop",
    },
    {
      slug: "oils-fats",
      label: "Oils & Fats",
      image:
        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&q=80&fit=crop",
    },
    {
      slug: "soup-ingredients",
      label: "Soup Ingredients",
      image:
        "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=200&q=80&fit=crop",
    },
    {
      slug: "spices-seasonings",
      label: "Spices & Seasonings",
      image:
        "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&q=80&fit=crop",
    },
    {
      slug: "breakfast-drinks",
      label: "Breakfast & Drinks",
      image:
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&q=80&fit=crop",
    },
    {
      slug: "others",
      label: "Others",
      image:
        "https://images.unsplash.com/photo-1601599963565-b7f49deb2699?w=200&q=80&fit=crop",
    },
  ],
});
</script>
