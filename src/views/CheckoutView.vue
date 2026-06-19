<template>
  <div class="bg-cream text-earth-900 min-h-screen">
    <div class="page-hero">
      <div class="max-w-5xl mx-auto">
        <span class="section-label">Final Step</span>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-earth-900">
          Checkout
        </h1>
        <p class="text-earth-600 text-lg">
          Confirm delivery details and complete payment.
        </p>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-6 md:px-10 py-12">
      <div class="grid lg:grid-cols-3 gap-10">

        <!-- Form -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Delivery details -->
          <div class="border-2 border-earth-200 rounded-2xl p-6 bg-white">
            <h3 class="font-bold text-earth-900 mb-5">Delivery Details</h3>
            <div class="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-xs font-semibold mb-1.5 text-earth-600
                              uppercase tracking-wider">Full Name</label>
                <input class="input-field" placeholder="Your name" />
              </div>
              <div>
                <label class="block text-xs font-semibold mb-1.5 text-earth-600
                              uppercase tracking-wider">Phone</label>
                <input class="input-field" placeholder="+234..." />
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-xs font-semibold mb-1.5 text-earth-600
                            uppercase tracking-wider">Delivery Address</label>
              <textarea rows="3" class="input-field resize-none"
                placeholder="Full delivery address" />
            </div>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold mb-1.5 text-earth-600
                              uppercase tracking-wider">State</label>
                <select class="input-field">
                  <option>Select state...</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold mb-1.5 text-earth-600
                              uppercase tracking-wider">Delivery Zone Fee</label>
                <div class="input-field flex items-center text-earth-400">
                  Select state first
                </div>
              </div>
            </div>
          </div>

          <!-- Payment method -->
          <div class="border-2 border-earth-200 rounded-2xl p-6 bg-white">
            <h3 class="font-bold text-earth-900 mb-5">Payment Method</h3>
            <div class="grid grid-cols-3 gap-3">
              <button class="p-4 border-2 border-forest-400 bg-forest-50
                             rounded-xl text-center">
                <p class="text-sm font-semibold text-forest-700">Card</p>
              </button>
              <button class="p-4 border-2 border-earth-200 rounded-xl text-center
                             hover:border-forest-300 transition-colors">
                <p class="text-sm font-semibold text-earth-700">Bank Transfer</p>
              </button>
              <button class="p-4 border-2 border-earth-200 rounded-xl text-center
                             hover:border-forest-300 transition-colors">
                <p class="text-sm font-semibold text-earth-700">USSD</p>
              </button>
            </div>
          </div>

        </div>

        <!-- Summary -->
        <div>
          <div class="border-2 border-earth-200 rounded-2xl p-6 bg-white sticky top-24">
            <h3 class="font-bold text-earth-900 mb-5">Order Summary</h3>
            <div class="space-y-3 text-sm mb-5 pb-5 border-b-2 border-earth-100">
              <div class="flex justify-between text-earth-600">
                <span>Rice × 10 bags</span>
                <span class="font-semibold text-earth-900">₦1,850,000</span>
              </div>
            </div>
            <div class="space-y-3 text-sm mb-5">
              <div class="flex justify-between text-earth-600">
                <span>Subtotal</span>
                <span class="font-semibold text-earth-900">₦1,850,000</span>
              </div>
              <div class="flex justify-between text-earth-600">
                <span>Delivery</span>
                <span class="font-semibold text-earth-900">₦15,000</span>
              </div>
            </div>
            <div class="border-t-2 border-earth-100 pt-4 mb-6">
              <div class="flex justify-between">
                <span class="font-bold text-earth-900">Total</span>
                <span class="font-bold text-earth-900 text-lg">₦1,865,000</span>
              </div>
            </div>
            <button class="btn-primary w-full justify-center py-3.5">
              Pay ₦1,865,000 →
            </button>
            <p class="text-xs text-earth-400 text-center mt-3">
              Secured by Paystack
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Payment + delivery zone wiring comes in the next phase
</script>