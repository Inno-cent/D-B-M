<template>
  <section class="bg-parchment border-b-2 border-earth-200">
    <div class="container-max px-6 md:px-10 py-12 md:py-16 grid lg:grid-cols-2 gap-10 items-center">
      <!-- Copy -->
      <div data-reveal>
        <h1 class="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-earth-900 leading-[1.1] mb-3">
          Everything you need to cook amazing meals
        </h1>
        <p class="text-forest-700 italic text-lg md:text-xl font-medium mb-4">
          We deliver across Lagos
        </p>
        <p class="text-earth-600 text-base md:text-lg leading-relaxed mb-8 max-w-md">
          Fresh ingredients. Great quality. Affordable prices. Delivered fast
          to your doorstep.
        </p>
        <div class="flex flex-wrap gap-3">
          <RouterLink to="/products" class="btn-primary">
            Shop Groceries
          </RouterLink>
          <RouterLink to="/meal-kits" class="btn-outline">
            Shop Meal Kits
          </RouterLink>
        </div>
      </div>

      <!-- Image collage -->
      <div class="relative" data-reveal data-reveal-delay="2">
        <div class="rounded-2xl overflow-hidden border-2 border-earth-200 shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80&fit=crop"
            alt="Fresh ingredients and a bowl of jollof rice"
            class="w-full h-64 sm:h-80 lg:h-96 object-cover"
          />
        </div>

        <!-- Fast delivery floating badge -->
        <div
          class="absolute -bottom-5 right-4 sm:right-8 bg-white border-2 border-earth-200
                 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3"
        >
          <span class="w-9 h-9 rounded-full bg-forest-50 flex items-center justify-center text-lg">
            🛵
          </span>
          <div class="text-sm">
            <p class="font-semibold text-earth-900 leading-tight">Fast Delivery</p>
            <p class="text-earth-500 leading-tight">Across Lagos</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>