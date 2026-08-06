<template>
  <section
    class="section-padding !py-14 md:!py-16 bg-parchment border-t-2 border-earth-200"
  >
    <div class="container-max grid md:grid-cols-2 gap-6">
      <!-- Why shop with us -->
      <div
        class="card !border-earth-200 p-6 sm:p-8 grid sm:grid-cols-2 gap-6 items-center"
        data-reveal
      >
        <div>
          <h2 class="text-2xl font-bold text-earth-900 mb-4">Why shop with Orenag?</h2>
          <ul class="space-y-2.5">
            <li
              v-for="point in points"
              :key="point"
              class="flex items-start gap-2 text-sm text-earth-700"
            >
              <span class="text-forest-600 mt-0.5">✓</span>
              <span>{{ point }}</span>
            </li>
          </ul>
          <RouterLink to="/about" class="btn-outline mt-6 !py-2.5 !px-5 !text-xs">
            Learn More About Us →
          </RouterLink>
        </div>
        <div class="rounded-xl overflow-hidden h-56 sm:h-full">
          <img
            src="https://images.unsplash.com/photo-1543168256-418811576931?w=600&q=80&fit=crop"
            alt="Orenag delivery staff with fresh groceries"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Testimonials -->
      <div
        class="card !border-earth-200 p-6 sm:p-8 flex flex-col"
        data-reveal
        data-reveal-delay="2"
      >
        <h2 class="text-lg font-bold text-earth-900 mb-4">What our customers say</h2>

        <div class="flex-1">
          <div class="flex items-center gap-1 text-harvest mb-1">
            <span v-for="n in 5" :key="n">★</span>
            <span class="ml-2 text-xs text-earth-500 font-medium">Verified Purchase</span>
          </div>
          <p class="text-earth-700 text-sm leading-relaxed mb-4">
            {{ current.quote }}
          </p>
          <div class="flex items-center gap-3">
            <img
              :src="current.avatar"
              :alt="current.name"
              class="w-9 h-9 rounded-full object-cover"
            />
            <div class="text-sm leading-tight">
              <p class="font-semibold text-earth-900">{{ current.name }}</p>
              <p class="text-earth-500 text-xs">{{ current.location }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between mt-6">
          <div class="flex gap-1.5">
            <button
              v-for="(t, i) in testimonials"
              :key="t.name"
              type="button"
              :aria-label="`Show testimonial ${i + 1}`"
              class="w-1.5 h-1.5 rounded-full transition-colors"
              :class="i === active ? 'bg-forest-700' : 'bg-earth-200'"
              @click="active = i"
            />
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              aria-label="Previous testimonial"
              class="w-8 h-8 rounded-full border-2 border-earth-200 flex items-center justify-center text-earth-600 hover:border-forest-400"
              @click="prev"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              class="w-8 h-8 rounded-full border-2 border-earth-200 flex items-center justify-center text-earth-600 hover:border-forest-400"
              @click="next"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const points = [
  "Carefully sourced from trusted suppliers",
  "Fresh, clean and quality ingredients",
  "Affordable prices for every home",
  "Fast delivery across Lagos",
  "Excellent customer support",
];

// Placeholder testimonials — swap for real reviews data when available.
const testimonials = [
  {
    quote:
      "The jollof rice kit made cooking so easy! Everything was fresh and the delivery was super fast.",
    name: "Tolu A.",
    location: "Lagos, Nigeria",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80&fit=crop",
  },
  {
    quote:
      "Great prices and the produce is always fresh. Orenag has become my go-to for weekly groceries.",
    name: "Ifeoma N.",
    location: "Lagos, Nigeria",
    avatar:
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&q=80&fit=crop",
  },
  {
    quote:
      "Ordering on WhatsApp was so convenient, and my delivery arrived within the hour.",
    name: "Chuka O.",
    location: "Lagos, Nigeria",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80&fit=crop",
  },
];

const active = ref(0);
function next() {
  active.value = (active.value + 1) % testimonials.length;
}
function prev() {
  active.value = (active.value - 1 + testimonials.length) % testimonials.length;
}

// Non-null assertion is safe: active is always kept in [0, testimonials.length)
// by next()/prev()'s modulo arithmetic and the dot buttons (which only ever
// set it to a v-for index that already exists). TS's noUncheckedIndexedAccess
// can't know that invariant, so a plain array-index would type as
// `Testimonial | undefined` even though it never actually is at runtime.
const current = computed(() => testimonials[active.value]!);
</script>
