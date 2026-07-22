<template>
  <section class="section-padding !py-14 md:!py-16 bg-cream">
    <div class="container-max">
      <!-- Header -->
      <div class="flex items-end justify-between gap-4 mb-6" data-reveal>
        <div>
          <div class="flex items-center gap-2 mb-2">
            <h2 class="text-2xl md:text-3xl font-bold text-earth-900">Meal Kits</h2>
            <span class="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded">
              New
            </span>
          </div>
          <p class="text-earth-600 text-sm max-w-lg">
            All the ingredients you need, perfectly portioned for delicious
            meals. Choose your family size and we'll handle the rest.
          </p>
        </div>
        <RouterLink
          to="/meal-kits"
          class="hidden sm:inline-flex items-center gap-1 text-forest-700 font-semibold text-sm whitespace-nowrap hover:text-forest-800"
        >
          View all kits →
        </RouterLink>
      </div>

      <!-- Scroll row -->
      <div class="relative">
        <div
          ref="scrollerRef"
          class="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth
                 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div
            v-for="kit in kits"
            :key="kit.id"
            class="card snap-start shrink-0 w-[42%] sm:w-[30%] md:w-[22%] lg:w-[18%] min-w-[170px] overflow-hidden"
          >
            <div class="relative">
              <img :src="kit.image" :alt="kit.name" class="w-full h-32 sm:h-36 object-cover" />
              <span
                v-if="kit.badge"
                class="absolute top-2 left-2 bg-harvest text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded"
              >
                {{ kit.badge }}
              </span>
            </div>
            <div class="p-3">
              <h3 class="font-semibold text-earth-900 text-sm mb-1 truncate">{{ kit.name }}</h3>
              <p class="text-xs text-earth-500 mb-2">
                Serves {{ kit.servings.join(' · ') }}
              </p>
              <p class="text-sm font-bold text-forest-700 mb-3">
                From ₦{{ kit.priceFrom.toLocaleString() }}
              </p>
              <button
                type="button"
                class="btn-primary w-full !py-2 !text-xs"
                @click="$emit('choose-size', kit.id)"
              >
                Choose Size
              </button>
            </div>
          </div>
        </div>

        <!-- Scroll affordance arrow (desktop) -->
        <button
          type="button"
          aria-label="Scroll meal kits right"
          class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
                 w-10 h-10 rounded-full bg-white border-2 border-earth-200 shadow-md
                 items-center justify-center text-earth-700 hover:border-forest-400 transition-colors"
          @click="scrollByCard"
        >
          ›
        </button>
      </div>

      <RouterLink
        to="/meal-kits"
        class="sm:hidden mt-4 inline-flex items-center gap-1 text-forest-700 font-semibold text-sm"
      >
        View all kits →
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface MealKit {
  id: string
  name: string
  image: string
  servings: number[]
  priceFrom: number
  badge?: string
}

// Placeholder data — swap for a real mealKits store/fetch when wiring this up,
// same pattern as FeaturedProducts previously used.
withDefaults(defineProps<{ kits?: MealKit[] }>(), {
  kits: () => [
    { id: 'jollof',     name: 'Jollof Rice Kit',  image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=500&q=80&fit=crop', servings: [2, 4, 6], priceFrom: 4500, badge: 'Best Seller' },
    { id: 'egusi',       name: 'Egusi Soup Kit',   image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=500&q=80&fit=crop', servings: [2, 4, 6], priceFrom: 4200 },
    { id: 'fried-rice',  name: 'Fried Rice Kit',   image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80&fit=crop', servings: [2, 4, 6], priceFrom: 4800 },
    { id: 'pepper-soup', name: 'Pepper Soup Kit',  image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80&fit=crop', servings: [2, 4, 6], priceFrom: 4300 },
    { id: 'efo-riro',    name: 'Efo Riro Kit',     image: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=500&q=80&fit=crop', servings: [2, 4, 6], priceFrom: 4000 },
  ],
})

defineEmits<{ (e: 'choose-size', kitId: string): void }>()

const scrollerRef = ref<HTMLElement | null>(null)
function scrollByCard() {
  scrollerRef.value?.scrollBy({ left: 260, behavior: 'smooth' })
}
</script>