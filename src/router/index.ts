import { createRouter, createWebHistory } from 'vue-router'
import { watch } from 'vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/products', name: 'products', component: () => import('../views/ProductsView.vue') },
    {
      path: '/products/:slug',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue'),
    },

    // ── Meal kits — NEW, added for the redesign ───────────────────
    {
      path: '/meal-kits',
      name: 'meal-kits',
      component: () => import('../views/MealKitsView.vue'),
    },
    {
      path: '/meal-kits/:slug',
      name: 'meal-kit-detail',
      component: () => import('../views/MealKitDetailView.vue'),
    },

    // ── NEW — placeholder pages, referenced by the new header nav ──
    { path: '/deals', name: 'deals', component: () => import('../views/DealsView.vue') },
    { path: '/recipes', name: 'recipes', component: () => import('../views/RecipesView.vue') },

    {
      path: '/how-it-works',
      name: 'how-it-works',
      component: () => import('../views/HowItWorksView.vue'),
    },
    {
      path: '/supplier-network',
      name: 'suppliers',
      component: () => import('../views/SupplierNetworkView.vue'),
    },
    {
      path: '/request-quote',
      name: 'quote',
      component: () => import('../views/RequestQuoteView.vue'),
    },
    { path: '/blog', name: 'blog', component: () => import('../views/BlogView.vue') },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: () => import('../views/BlogPostView.vue'),
    },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue') },
    { path: '/cart', name: 'cart', component: () => import('../views/CartView.vue') },
    { path: '/terms', name: 'terms', component: () => import('../views/Terms.vue') },
    { path: '/privacy', name: 'privacy', component: () => import('../views/Privacy.vue') },

    // ── Auth routes ──────────────────────────────────────────────
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
      meta: { guestOnly: true, layout: 'auth' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guestOnly: true, layout: 'auth' },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue'),
      meta: { guestOnly: true, layout: 'auth' },
    },
    {
      path: '/auth/reset-password',
      name: 'reset-password',
      component: () => import('../views/ResetPasswordView.vue'),
      meta: { layout: 'auth' },
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('../views/AuthCallbackView.vue'),
      meta: { layout: 'auth' },
    },

    // ── Protected routes ─────────────────────────────────────────
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders/:ref',
      name: 'order-confirmation',
      component: () => import('../views/OrderConfirmationView.vue'),
      meta: { requiresAuth: true },
    },
    // NEW — order history list, linked from "Track Order" in the new
    // header. Backlog doc already notes fetchMyOrders() exists in the
    // orders store and OrdersView.vue is ready to use it — this route
    // just needs that view wired up (see placeholder file).
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrdersView.vue'),
      meta: { requiresAuth: true },
    },

    // ── Admin routes ─────────────────────────────────────────────
    {
      path: '/admin/prices',
      name: 'admin-prices',
      component: () => import('../views/AdminPricesView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: () => import('../views/AdminOrdersView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },

    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders/:ref',
      name: 'order-confirmation',
      component: () => import('../views/OrderConfirmationView.vue'),
      meta: { requiresAuth: true },
    },

    // ── Admin routes ─────────────────────────────────────────────
    {
      path: '/admin/prices',
      name: 'admin-prices',
      component: () => import('../views/AdminPricesView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (auth.loading) {
    await new Promise<void>((resolve) => {
      const stop = watch(
        () => auth.loading,
        (val) => {
          if (!val) {
            stop()
            resolve()
          }
        },
        { immediate: true },
      )
    })
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn)
    return { name: 'login', query: { redirect: to.fullPath } }
  if (to.meta.guestOnly && auth.isLoggedIn) return { name: 'dashboard' }
  if (to.meta.requiresAdmin && !auth.isAdmin) return { name: 'home' }
})

export default router
