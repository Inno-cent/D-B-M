import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: '/',                  name: 'home',            component: () => import('../views/HomeView.vue') },
    { path: '/products',          name: 'products',        component: () => import('../views/ProductsView.vue') },
    { path: '/products/:slug',    name: 'product-detail',  component: () => import('../views/ProductDetailView.vue') },
    { path: '/how-it-works',      name: 'how-it-works',    component: () => import('../views/HowItWorksView.vue') },
    { path: '/supplier-network',  name: 'suppliers',       component: () => import('../views/SupplierNetworkView.vue') },
    { path: '/request-quote',     name: 'quote',           component: () => import('../views/RequestQuoteView.vue') },
    { path: '/blog',              name: 'blog',            component: () => import('../views/BlogView.vue') },
    { path: '/blog/:slug',        name: 'blog-post',       component: () => import('../views/BlogPostView.vue') },
    { path: '/about',             name: 'about',           component: () => import('../views/AboutView.vue') },
    { path: '/contact',           name: 'contact',         component: () => import('../views/ContactView.vue') },
    { path: '/:pathMatch(.*)*',   name: 'not-found',       component: () => import('../views/NotFoundView.vue') },
  ],
})

export default router