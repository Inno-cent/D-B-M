import type { RouteRecordRaw } from 'vue-router'

// Route table only — no createRouter/createWebHistory here. vite-ssg
// builds the router itself (createWebHistory on the client,
// createMemoryHistory during SSG), so this file just needs to export
// the plain route array. beforeEach guards live in ./guards.ts and are
// attached to the router vite-ssg gives us, from src/main.ts.
export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/products', name: 'products', component: () => import('../views/ProductsView.vue') },
  {
    path: '/products/:slug',
    name: 'product-detail',
    component: () => import('../views/ProductDetailView.vue'),
  },

  // ── Meal kits ───────────────────────────────────────────────────
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

  // ── Auth routes ───────────────────────────────────────────────
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
  {
    path: '/orders',
    name: 'orders',
    component: () => import('../views/OrdersView.vue'),
    meta: { requiresAuth: true },
  },

  // ── Admin routes ─────────────────────────────────────────────
  // NOTE: previously duplicated further down in router/index.ts
  // (checkout, order-confirmation, admin-prices were each defined
  // twice with identical route names) — deduped here, this is the
  // only definition of each now.
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
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]