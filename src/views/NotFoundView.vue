<template>
  <div class="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen
              flex items-center justify-center px-6">
    <div class="text-center max-w-lg">
      <p class="text-8xl mb-6">🔍</p>
      <h1 class="text-5xl font-bold tracking-tight mb-4">404</h1>
      <p class="text-xl font-semibold mb-3">Page not found</p>
      <p class="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <RouterLink to="/" class="btn-primary px-8 py-4">
          Go Home →
        </RouterLink>
        <RouterLink to="/products" class="btn-outline px-8 py-4">
          Browse Products
        </RouterLink>
      </div>
    </div>
  </div>
</template>