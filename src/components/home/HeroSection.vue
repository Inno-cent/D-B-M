<template>
  <section class="bg-parchment border-b-2 border-earth-200 overflow-hidden">
    <div
      class="container-max px-6 md:px-10 py-12 md:py-16 grid lg:grid-cols-2 gap-10 items-center"
    >
      <!-- =========================================================
           HERO COPY
      ========================================================== -->
      <div data-reveal>
        <h1
          class="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-earth-900 leading-[1.1] mb-3"
        >
          Everything you need to cook amazing meals
        </h1>

        <p class="text-forest-700 italic text-lg md:text-xl font-medium mb-4">
          We deliver across Nigeria
        </p>

        <p class="text-earth-600 text-base md:text-lg leading-relaxed mb-8 max-w-md">
          Fresh ingredients. Great quality. Affordable prices. Delivered fast to your
          doorstep.
        </p>

        <div class="flex flex-wrap gap-3">
          <RouterLink to="/products" class="btn-primary"> Shop Groceries </RouterLink>

          <RouterLink to="/meal-kits" class="btn-outline"> Shop Meal Kits </RouterLink>
        </div>
      </div>

      <!-- =========================================================
           HERO IMAGE
           
           The image sits directly on the page without a card,
           border or shadow.

           The mask makes the LEFT side of the image gradually
           disappear into the parchment background.
      ========================================================== -->
      <div class="relative h-72 sm:h-96 lg:h-[26rem]" data-reveal data-reveal-delay="2">
        <!-- Soft floating color blob - top left -->
        <div
          class="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-forest-200/40 blur-3xl animate-float"
        />

        <!-- Soft floating color blob - bottom right -->
        <div
          class="absolute -bottom-10 -right-6 w-48 h-48 rounded-full bg-harvest/20 blur-3xl animate-float-slow"
        />

        <!-- =======================================================
             GROCERY IMAGE
        ======================================================== -->
        <div class="relative w-full h-full hero-image-wrapper">
          <img
            :src="essentialGroceries"
            alt="Fresh groceries including rice, beans, tomatoes, peppers and cooking essentials"
            class="hero-grocery-image"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import essentialGroceries from "@/assets/essential-groceries.png";

/* ================================================================
   PREVIOUS SLIDESHOW
   ---------------------------------------------------------------
   Kept here for later. Uncomment if you want to bring the
   slideshow back.
================================================================= */

/*
import { ref, onMounted, onUnmounted } from "vue";

const slides = [
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80&fit=crop",

  essentialGroceries,

  "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=1200&q=80&fit=crop",

  "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80&fit=crop",

  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&q=80&fit=crop",
];

const activeSlide = ref(0);

let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  timer = setInterval(() => {
    activeSlide.value =
      (activeSlide.value + 1) % slides.length;
  }, 5000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
*/
</script>

<style scoped>
/* ================================================================
   HERO IMAGE CONTAINER
================================================================= */

.hero-image-wrapper {
  width: 100%;
  height: 100%;
}

/* ================================================================
   GROCERY IMAGE
   ---------------------------------------------------------------
   The image is intentionally NOT inside a card.

   The mask fades the left edge into the hero's parchment
   background, making it appear as though the groceries are
   naturally emerging from the page.
================================================================= */

.hero-grocery-image {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: contain;

  /*
   * LEFT EDGE BLEND
   *
   * 0%       = completely transparent
   * 10%      = mostly transparent
   * 20%      = partially visible
   * 30%+     = fully visible
   *
   * This removes the obvious rectangular image boundary.
   */
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 6%,
    rgba(0, 0, 0, 0.4) 12%,
    rgba(0, 0, 0, 0.8) 20%,
    black 30%,
    black 100%
  );

  mask-image: linear-gradient(
    to right,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 6%,
    rgba(0, 0, 0, 0.4) 12%,
    rgba(0, 0, 0, 0.8) 20%,
    black 30%,
    black 100%
  );

  /*
   * Helps the lighter areas of the photograph integrate
   * with the parchment background.
   */
  mix-blend-mode: multiply;

  /*
   * Slightly smooth entrance/appearance.
   */
  transition: opacity 0.8s ease, transform 0.8s ease;
}

/* ================================================================
   RESPONSIVE ADJUSTMENTS
================================================================= */

@media (max-width: 1023px) {
  .hero-grocery-image {
    /*
     * On smaller screens we don't need such an aggressive
     * left-side fade because the image occupies its own row.
     */
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.5) 8%,
      black 20%,
      black 100%
    );

    mask-image: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.5) 8%,
      black 20%,
      black 100%
    );
  }
}

/* ================================================================
   OPTIONAL:
   If you later uncomment the slideshow, these transitions can
   be reused.
================================================================= */

/*
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  position: absolute;
}
*/
</style>
