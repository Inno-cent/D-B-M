<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="page-hero">
      <div class="max-w-5xl mx-auto">
        <span class="section-label">Your Order</span>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-earth-900">
          Cart
        </h1>
        <p class="text-earth-600 text-lg">
          Review your items before checkout.
        </p>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-6 md:px-10 py-12">
      <div class="grid lg:grid-cols-3 gap-10">

        <!-- Items list -->
        <div class="lg:col-span-2 space-y-4">

          <!-- Example static item -->
          <div class="flex gap-4 p-5 bg-white border-2 border-earth-200
                      rounded-2xl">
            <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0
                        bg-parchment border border-earth-100" />
            <div class="flex-1">
              <p class="font-bold text-earth-900">Rice (50kg bag)</p>
              <p class="text-sm text-earth-400 mt-0.5">₦185,000 / bag</p>
              <div class="flex items-center gap-3 mt-3">
                <button class="w-7 h-7 rounded-lg border-2 border-earth-200
                               flex items-center justify-center text-earth-600
                               font-bold">−</button>
                <span class="text-sm font-semibold">10 bags</span>
                <button class="w-7 h-7 rounded-lg border-2 border-earth-200
                               flex items-center justify-center text-earth-600
                               font-bold">+</button>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-earth-900">₦1,850,000</p>
              <button class="text-xs text-red-400 hover:text-red-600
                             transition-colors mt-2">Remove</button>
            </div>
          </div>

          <p class="text-center text-earth-400 text-sm py-6">
            Additional cart items will render here
          </p>
        </div>

        <!-- Summary -->
        <div>
          <div class="border-2 border-earth-200 rounded-2xl p-6 bg-white sticky top-24">
            <h3 class="font-bold text-earth-900 mb-5">Order Summary</h3>
            <div class="space-y-3 text-sm mb-5">
              <div class="flex justify-between text-earth-600">
                <span>Subtotal</span>
                <span class="font-semibold text-earth-900">₦1,850,000</span>
              </div>
              <div class="flex justify-between text-earth-600">
                <span>Delivery</span>
                <span class="text-earth-400">Calculated at checkout</span>
              </div>
            </div>
            <div class="border-t-2 border-earth-100 pt-4 mb-6">
              <div class="flex justify-between">
                <span class="font-bold text-earth-900">Total</span>
                <span class="font-bold text-earth-900 text-lg">₦1,850,000</span>
              </div>
            </div>
            <button class="btn-primary w-full justify-center py-3.5">
              Proceed to Checkout →
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Cart store wiring comes in the next phase
</script>