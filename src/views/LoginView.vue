<template>
  <div class="min-h-screen bg-cream flex">

    <!-- Left — farm image panel -->
    <div class="hidden lg:flex flex-1 relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=85&fit=crop"
        alt="Nigerian farm workers"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-forest-900/80 to-forest-800/55" />
      <div class="absolute inset-0 flex flex-col justify-end p-12">
        <div class="space-y-5">
          <blockquote class="text-xl font-medium text-white leading-relaxed italic">
            "DualMarket connected us with a verified sesame supplier in Jigawa within 48 hours.
            The entire process was seamless."
          </blockquote>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-harvest rounded-full flex items-center justify-center
                        text-white font-bold text-sm">
              AK
            </div>
            <div>
              <p class="text-white text-sm font-semibold">Ahmad K.</p>
              <p class="text-forest-300 text-xs">Import Manager · Germany</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right — form -->
    <div class="flex-1 flex items-center justify-center px-6 py-20">
      <div class="w-full max-w-md">

        <RouterLink to="/" class="flex items-center gap-3 mb-10 group w-fit">
          <div class="w-9 h-9 bg-forest-700 rounded-xl flex items-center justify-center
                      group-hover:bg-forest-600 transition-colors">
            <span class="text-white font-bold text-xs">DM</span>
          </div>
          <span class="font-bold text-earth-900">DualMarket Brokerage</span>
        </RouterLink>

        <h1 class="text-3xl font-bold text-earth-900 mb-2">Welcome back</h1>
        <p class="text-earth-500 mb-8">
          Don't have an account?
          <RouterLink to="/signup" class="text-forest-600 font-semibold hover:text-forest-700">
            Sign up free
          </RouterLink>
        </p>

        <!-- Error -->
        <div v-if="error"
          class="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm">
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold mb-2 text-earth-800">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="you@company.com"
              class="input-field"
              required
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-semibold text-earth-800">Password</label>
              <a href="#" class="text-xs text-forest-600 font-semibold hover:text-forest-700">
                Forgot password?
              </a>
            </div>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Your password"
                class="input-field pr-12"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2
                       text-earth-400 hover:text-earth-700 transition-colors"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <input
              v-model="form.remember"
              type="checkbox"
              id="remember"
              class="w-4 h-4 accent-forest-600 cursor-pointer"
            />
            <label for="remember" class="text-sm text-earth-600 cursor-pointer">
              Keep me signed in
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full justify-center py-4
                   disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-8 pt-8 border-t-2 border-earth-200 text-center">
          <p class="text-xs text-earth-400">
            By signing in you agree to our
            <a href="#" class="text-forest-600 hover:underline">Terms of Service</a>
            and
            <a href="#" class="text-forest-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>

  </div>
</template>
