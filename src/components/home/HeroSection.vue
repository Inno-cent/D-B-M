<template>
  <section
    class="relative isolate overflow-hidden bg-parchment border-b-2 border-earth-200"
  >
    <!-- =========================================================
         BACKGROUND PHOTO
         The photo is a background layer, not a card.
         - Wrapper mask  -> fades the LEFT edge into the parchment
         - Image mask    -> fades the BOTTOM edge (mobile only)
         Because both fade to transparent, the section's parchment
         shows through, so the blend is exact whatever the hex is.
    ========================================================== -->
    <div class="hero-bg" aria-hidden="true">
      <img
        :src="heroImage"
        alt=""
        class="hero-bg__img"
        fetchpriority="high"
        decoding="async"
      />
    </div>

    <!-- =========================================================
         HERO COPY (sits above the photo)
    ========================================================== -->
    <div
      class="container-max relative z-10 px-6 md:px-10 pt-10 pb-12 lg:py-24 lg:min-h-[34rem] flex items-center"
    >
      <div class="w-full lg:max-w-xl" data-reveal>
        <!-- Mobile: this block reserves room so the headline sits ON the photo
             and the rest of the copy starts below it, like the reference. -->
        <div class="min-h-[16rem] sm:min-h-[18rem] lg:min-h-0">
          <h1
            class="hero-title text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-earth-900 leading-[1.1] max-w-[19rem] sm:max-w-md lg:max-w-none mb-3"
          >
            Everything you need to cook amazing meals
          </h1>
        </div>

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
    </div>
  </section>
</template>

<script setup lang="ts">
// Save the photo as src/assets/hero-cooking.webp (or .jpg / .png and adjust the import).
import heroImage from "@/assets/hero-cooking.png";

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
  "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=1200&q=80&fit=crop",
  "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80&fit=crop",
  "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&q=80&fit=crop",
];

const activeSlide = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  timer = setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % slides.length;
  }, 5000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
*/
</script>

<style scoped>
/* ================================================================
   MOBILE / TABLET (default)
   The photo is a band across the top of the hero. The headline is
   laid over its faded left side; the bottom edge melts into the page.
================================================================= */

.hero-bg {
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  right: 0;
  height: 22rem;

  /* LEFT -> RIGHT: transparent -> visible */
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    rgba(0, 0, 0, 0.12) 12%,
    rgba(0, 0, 0, 0.45) 32%,
    rgba(0, 0, 0, 0.85) 55%,
    #000 75%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    rgba(0, 0, 0, 0.12) 12%,
    rgba(0, 0, 0, 0.45) 32%,
    rgba(0, 0, 0, 0.85) 55%,
    #000 75%
  );
}

.hero-bg__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Keeps the pan + hands (right side of the photo) in view when cropped */
  object-position: 72% 55%;

  /* Bottom edge melts into the parchment */
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%);
}

/* Keeps the dark-green headline readable where it crosses the photo.
   Swap the rgba for your parchment colour if you want an exact match. */
.hero-title {
  text-shadow: 0 0 14px rgba(250, 246, 238, 0.85), 0 0 4px rgba(250, 246, 238, 0.7);
}

@media (min-width: 640px) {
  .hero-bg {
    height: 25rem;
  }
}

/* ================================================================
   DESKTOP (lg and up)
   The photo fills the right ~62% of the hero, full height, and
   oozes in from the left so the copy sits on clean parchment.
================================================================= */

@media (min-width: 1024px) {
  .hero-bg {
    left: auto;
    right: 0;
    bottom: 0;
    width: 62%;
    height: auto;

    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.1) 8%,
      rgba(0, 0, 0, 0.45) 24%,
      rgba(0, 0, 0, 0.85) 44%,
      #000 65%
    );
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.1) 8%,
      rgba(0, 0, 0, 0.45) 24%,
      rgba(0, 0, 0, 0.85) 44%,
      #000 65%
    );
  }

  .hero-bg__img {
    object-position: 65% 60%;
    /* No bottom fade on desktop - the photo runs to the section edge */
    -webkit-mask-image: none;
    mask-image: none;
  }

  .hero-title {
    text-shadow: none;
  }
}
</style>