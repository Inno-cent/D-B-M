<template>
  <section class="section-padding !py-14 md:!py-16 bg-cream">
    <div class="container-max">
      <!-- Header -->
      <div class="flex items-end justify-between gap-4 mb-6" data-reveal>
        <div>
          <div class="flex items-center gap-2 mb-2">
            <h2 class="text-2xl md:text-3xl font-bold text-earth-900">Shop Meal Kits</h2>
            <span
              class="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded"
            >
              New
            </span>
          </div>
          <p class="text-earth-600 text-sm max-w-lg">
            All the ingredients you need, perfectly portioned for delicious meals. Choose
            your family size and we'll handle the rest.
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
          class="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <RouterLink
            v-for="kit in mealKits"
            :key="kit.slug"
            :to="`/meal-kits/${kit.slug}`"
            class="card snap-start shrink-0 w-[42%] sm:w-[30%] md:w-[22%] lg:w-[18%] min-w-[170px] overflow-hidden block"
          >
            <div class="relative">
              <img
                :src="kit.image"
                :alt="kit.name"
                class="w-full h-32 sm:h-36 object-cover"
              />
              <span
                v-if="kit.badge"
                class="absolute top-2 left-2 bg-harvest text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded"
              >
                {{ kit.badge }}
              </span>
            </div>
            <div class="p-3">
              <h3 class="font-semibold text-earth-900 text-sm mb-1 truncate">
                {{ kit.name }}
              </h3>
              <p class="text-xs text-earth-500 mb-2">
                Serves {{ kit.sizes.map((s) => s.servings).join(" · ") }}
              </p>
              <p class="text-sm font-bold text-forest-700 mb-3">
                From ₦{{ Math.min(...kit.sizes.map((s) => s.priceNgn)).toLocaleString() }}
              </p>
              <span class="btn-primary w-full !py-2 !text-xs"> Choose Size </span>
            </div>
          </RouterLink>
        </div>

        <!-- Scroll affordance arrow (desktop) -->
        <button
          type="button"
          aria-label="Scroll meal kits right"
          class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-earth-200 shadow-md items-center justify-center text-earth-700 hover:border-forest-400 transition-colors"
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
import { ref } from "vue";
import { mealKits } from "../../data/mealKits";

const scrollerRef = ref<HTMLElement | null>(null);
function scrollByCard() {
  scrollerRef.value?.scrollBy({ left: 260, behavior: "smooth" });
}
</script>
