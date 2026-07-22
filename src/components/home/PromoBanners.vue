<template>
  <section class="px-6 md:px-10 -mt-2 md:-mt-4 relative z-10">
    <div class="container-max grid sm:grid-cols-3 gap-4">
      <!-- New customer -->
      <div class="rounded-xl bg-forest-50 border-2 border-forest-100 p-5 flex items-center justify-between gap-3" data-reveal>
        <div>
          <p class="text-earth-900 font-semibold text-sm leading-snug mb-1">New to Orenag?</p>
          <p class="text-earth-700 text-sm mb-3">Get 10% off your first order</p>
          <span class="inline-flex items-center gap-1 bg-forest-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
            Use Code: ORENAG10
          </span>
        </div>
        <span class="text-3xl shrink-0">🧺</span>
      </div>

      <!-- Weekly deals -->
      <div class="rounded-xl bg-parchment border-2 border-earth-200 p-5 flex items-center justify-between gap-3" data-reveal data-reveal-delay="2">
        <div>
          <p class="text-earth-900 font-semibold text-sm leading-snug mb-1">Save more on</p>
          <p class="text-earth-700 text-sm mb-3">this week's deals</p>
          <RouterLink to="/deals" class="text-forest-700 font-semibold text-sm hover:text-forest-800">
            Shop Deals →
          </RouterLink>
        </div>
        <span class="w-10 h-10 shrink-0 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold">
          %
        </span>
      </div>

      <!-- WhatsApp -->
      <div class="rounded-xl bg-forest-700 p-5 flex items-center justify-between gap-3 text-white" data-reveal data-reveal-delay="3">
        <div>
          <p class="font-semibold text-sm leading-snug mb-1">Order on WhatsApp</p>
          <p class="text-forest-100 text-sm mb-3">It's quick and easy!</p>
          <a
            href="https://wa.me/2348123456789"
            target="_blank"
            rel="noopener"
            class="text-white font-semibold text-sm underline underline-offset-2 hover:text-forest-100"
          >
            Chat Now →
          </a>
        </div>
        <span class="text-3xl shrink-0">💬</span>
      </div>
    </div>
  </section>
</template>