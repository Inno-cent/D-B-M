<template>
  <section class="bg-parchment border-b-2 border-earth-200 overflow-hidden">
    <div
      class="container-max px-6 md:px-10 py-12 md:py-16 grid lg:grid-cols-2 gap-10 items-center"
    >
      <!-- Copy -->
      <div data-reveal>
        <h1
          class="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-earth-900 leading-[1.1] mb-3"
        >
          Everything you need to cook amazing meals
        </h1>
        <p class="text-forest-700 italic text-lg md:text-xl font-medium mb-4">
          We deliver across Lagos
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

      <!-- Image slideshow — no card, no border, no shadow: the image sits
           directly on the page. mix-blend-mode merges its (light) background
           into the cream page behind it, rather than faking a fade at the
           edges. -->
      <div class="relative h-72 sm:h-96 lg:h-[26rem]" data-reveal data-reveal-delay="2">
        <!-- Soft floating color blobs behind the image for depth, using the
             existing animate-float utilities already defined in the theme -->
        <div
          class="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-forest-200/40 blur-3xl animate-float"
        />
        <div
          class="absolute -bottom-10 -right-6 w-48 h-48 rounded-full bg-harvest/20 blur-3xl animate-float-slow"
        />

        <div class="relative w-full h-full">
          <Transition v-for="(slide, i) in slides" :key="slide" name="fade">
            <img
              v-if="i === activeSlide"
              :src="slide"
              alt="Fresh ingredients and dishes cooked with Orenag produce"
              class="absolute inset-0 w-full h-full object-contain mix-blend-multiply"
            />
          </Transition>
        </div>

        <!-- Slide dots -->
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          <button
            v-for="(slide, i) in slides"
            :key="slide"
            type="button"
            :aria-label="`Show slide ${i + 1}`"
            class="w-1.5 h-1.5 rounded-full transition-all duration-200"
            :class="i === activeSlide ? 'bg-forest-700 w-4' : 'bg-earth-300'"
            @click="activeSlide = i"
          />
        </div>

        <!-- Fast delivery floating badge -->
        <!-- <div
          class="absolute -bottom-5 right-4 sm:right-8 bg-white border-2 border-earth-200 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 z-10"
        >
          <span
            class="w-9 h-9 rounded-full bg-forest-50 flex items-center justify-center text-lg"
          >
            🛵
          </span>
          <div class="text-sm">
            <p class="font-semibold text-earth-900 leading-tight">Fast Delivery</p>
            <p class="text-earth-500 leading-tight">Across Lagos</p>
          </div>
        </div> -->
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// Placeholder imagery — swap for real Orenag product/dish photography.
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
</script>

<style scoped>
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
</style>
