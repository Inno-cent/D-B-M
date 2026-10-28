<template>
  <div class="bg-cream text-earth-900 min-h-screen pt-24 pb-16">
    <div class="max-w-5xl mx-auto px-6 md:px-10">
      <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span class="section-label">Admin</span>
          <h1 class="text-4xl font-bold tracking-tight mb-2 text-earth-900">Products</h1>
          <p class="text-earth-600">
            Add, edit and hide products. Names, descriptions, images and prices all live here.
          </p>
          <div class="flex gap-4 mt-3 text-sm font-semibold">
            <RouterLink to="/admin/categories" class="text-forest-600 underline">Categories</RouterLink>
            <RouterLink to="/admin/prices" class="text-forest-600 underline">Quick price editor</RouterLink>
          </div>
        </div>
        <div class="flex flex-col items-start md:items-end gap-4">
          <RouterLink to="/admin/products/new" class="btn-primary px-6 py-3">+ New product</RouterLink>
          <PublishButton />
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          v-model="search"
          type="search"
          placeholder="Search by name or slug…"
          class="flex-1 px-4 py-2.5 border-2 border-earth-200 rounded-xl text-sm bg-white outline-none focus:border-forest-400"
        />
        <select
          v-model="statusFilter"
          class="px-4 py-2.5 border-2 border-earth-200 rounded-xl text-sm bg-white outline-none focus:border-forest-400"
        >
          <option value="all">All products</option>
          <option value="published">Published</option>
          <option value="hidden">Hidden</option>
          <option value="noprice">Missing a price</option>
        </select>
        <select
          v-model="categoryFilter"
          class="px-4 py-2.5 border-2 border-earth-200 rounded-xl text-sm bg-white outline-none focus:border-forest-400"
        >
          <option value="">Any category</option>
          <option v-for="c in admin.categories" :key="c.slug" :value="c.slug">{{ c.label }}</option>
        </select>
      </div>

      <div v-if="admin.loading && admin.products.length === 0" class="text-earth-400 py-12 text-center">
        Loading products…
      </div>
      <div
        v-else-if="admin.error"
        class="text-red-600 bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6"
      >
        {{ admin.error }}
      </div>

      <div v-else>
        <p class="text-xs text-earth-400 mb-3">
          {{ rows.length }} of {{ admin.products.length }} products
        </p>
        <div class="flex flex-col gap-3">
          <div
            v-for="r in rows"
            :key="r.product.slug"
            class="border-2 border-earth-200 rounded-2xl bg-white p-4 flex items-center gap-4"
            :class="{ 'opacity-60': !r.product.is_published }"
          >
            <div
              class="w-14 h-14 rounded-xl border-2 border-earth-100 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center"
            >
              <img v-if="r.product.image_url" :src="r.product.image_url" alt="" class="w-full h-full object-cover" />
              <span v-else class="text-2xl">{{ r.product.icon || "🛒" }}</span>
            </div>

            <div class="flex-1 min-w-0">
              <p class="font-bold text-earth-900 truncate">{{ r.product.name }}</p>
              <p class="text-xs text-earth-400 truncate">
                {{ r.product.slug }} ·
                {{ r.variantCount ? `${r.variantCount} variant${r.variantCount > 1 ? "s" : ""}` : "single item" }}
              </p>
              <div class="flex flex-wrap gap-1.5 mt-1.5">
                <span
                  v-for="c in r.product.categories"
                  :key="c"
                  class="text-[11px] px-2 py-0.5 rounded-full bg-forest-50 text-forest-700"
                >
                  {{ categoryLabel(c) }}
                </span>
              </div>
            </div>

            <div class="hidden sm:block text-sm text-right w-36">
              <span v-if="r.product.type === 'export'" class="text-earth-400">Quote on request</span>
              <span v-else-if="r.priceText" class="font-semibold text-earth-900">{{ r.priceText }}</span>
              <span v-else class="text-amber-600 font-semibold">No price set</span>
            </div>

            <label class="flex items-center gap-2 text-xs text-earth-600 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                class="w-4 h-4 accent-forest-600"
                :checked="r.product.is_published"
                @change="togglePublished(r.product.slug, ($event.target as HTMLInputElement).checked)"
              />
              Published
            </label>

            <RouterLink :to="`/admin/products/${r.product.slug}`" class="btn-outline !py-2 !px-4 !text-xs">
              Edit
            </RouterLink>
          </div>

          <p v-if="rows.length === 0" class="text-center text-earth-400 py-12">No products match.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import PublishButton from '../components/admin/PublishButton.vue'
import { useAdminCatalogStore } from '../stores/adminCatalog'
import { useSeo } from '../composables/useSeo'

const admin = useAdminCatalogStore()
useSeo({ title: 'Manage Products', path: '/admin/products', noindex: true })

onMounted(() => admin.fetchAll())

const search = ref('')
const statusFilter = ref<'all' | 'published' | 'hidden' | 'noprice'>('all')
const categoryFilter = ref('')

const fmt = (n: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n)

const categoryLabel = (slug: string) => admin.categories.find((c) => c.slug === slug)?.label ?? slug

const allRows = computed(() =>
  admin.products.map((product) => {
    const vs = admin.variants.filter((v) => v.product_slug === product.slug)
    const slugs = vs.length ? vs.filter((v) => v.is_active).map((v) => v.slug) : [product.slug]
    const found = slugs
      .map((s) => admin.prices.find((p) => p.product_slug === s)?.price_ngn)
      .filter((n): n is number => typeof n === 'number')
    const missing = product.type === 'local' && found.length < slugs.length
    let priceText = ''
    if (found.length) {
      const lo = Math.min(...found)
      const hi = Math.max(...found)
      priceText = lo === hi ? fmt(lo) : `${fmt(lo)} – ${fmt(hi)}`
    }
    return { product, variantCount: vs.length, priceText, missing }
  }),
)

const rows = computed(() => {
  const q = search.value.trim().toLowerCase()
  return allRows.value.filter((r) => {
    if (q && !r.product.name.toLowerCase().includes(q) && !r.product.slug.includes(q)) return false
    if (categoryFilter.value && !r.product.categories.includes(categoryFilter.value)) return false
    if (statusFilter.value === 'published' && !r.product.is_published) return false
    if (statusFilter.value === 'hidden' && r.product.is_published) return false
    if (statusFilter.value === 'noprice' && !r.missing) return false
    return true
  })
})

const togglePublished = async (slug: string, value: boolean) => {
  try {
    await admin.setPublished(slug, value)
    toast.success(value ? 'Product is now published.' : 'Product hidden from the shop.')
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Could not update the product.')
    await admin.fetchAll() // re-sync the checkbox
  }
}
</script>
