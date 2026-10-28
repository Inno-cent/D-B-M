<template>
  <div class="bg-cream text-earth-900 min-h-screen pt-24 pb-32">
    <div class="max-w-3xl mx-auto px-6 md:px-10">
      <RouterLink to="/admin/products" class="text-sm font-semibold text-forest-600 underline">
        ← All products
      </RouterLink>
      <h1 class="text-3xl font-bold tracking-tight mt-3 mb-8">
        {{ form?.isNew ? "New product" : form?.name || "Edit product" }}
      </h1>

      <div v-if="admin.loading && !form" class="text-earth-400 py-12 text-center">Loading…</div>
      <div v-else-if="notFound" class="border-2 border-earth-200 rounded-2xl bg-white p-8 text-center">
        <p class="font-bold mb-2">Product not found</p>
        <RouterLink to="/admin/products" class="btn-primary">Back to products</RouterLink>
      </div>

      <form v-else-if="form" class="flex flex-col gap-6" @submit.prevent="save">
        <!-- Basics -->
        <section class="border-2 border-earth-200 rounded-2xl bg-white p-6">
          <h2 class="font-bold mb-5">Basics</h2>
          <div class="grid sm:grid-cols-2 gap-4 mb-4">
            <label class="block">
              <span class="label">Name</span>
              <input v-model="form.name" class="input-field" placeholder="e.g. Palm Oil" required />
            </label>
            <label class="block">
              <span class="label">Slug (web address)</span>
              <input
                v-model="form.slug"
                class="input-field"
                :class="{ 'opacity-60': !form.isNew }"
                :readonly="!form.isNew"
                placeholder="palm-oil"
                @input="slugTouched = true"
              />
              <span class="hint">
                {{ form.isNew ? "Can't be changed after saving." : "Permanent — carts and orders refer to it." }}
              </span>
            </label>
          </div>
          <div class="grid sm:grid-cols-3 gap-4">
            <label class="block">
              <span class="label">Icon (emoji)</span>
              <input v-model="form.icon" class="input-field" maxlength="8" />
            </label>
            <label class="block">
              <span class="label">Type</span>
              <select v-model="form.type" class="input-field">
                <option value="local">Local — priced &amp; sold online</option>
                <option value="export">Export — quote on request</option>
              </select>
            </label>
            <label class="block">
              <span class="label">Display order</span>
              <input v-model.number="form.sort_order" type="number" step="10" class="input-field" />
              <span class="hint">Lower numbers appear first.</span>
            </label>
          </div>
          <label class="flex items-center gap-2 text-sm mt-5 cursor-pointer">
            <input v-model="form.is_published" type="checkbox" class="w-4 h-4 accent-forest-600" />
            Published (visible in the shop)
          </label>
        </section>

        <!-- Image -->
        <section class="border-2 border-earth-200 rounded-2xl bg-white p-6">
          <h2 class="font-bold mb-5">Main image</h2>
          <ImageUploader v-model="form.image_url" :name="form.slug || form.name" />
        </section>

        <!-- Categories -->
        <section class="border-2 border-earth-200 rounded-2xl bg-white p-6">
          <h2 class="font-bold mb-4">Categories</h2>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="c in activeCategories"
              :key="c.slug"
              class="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border-2 cursor-pointer transition-colors"
              :class="form.categories.includes(c.slug) ? 'border-forest-400 bg-forest-50 text-forest-700' : 'border-earth-200 text-earth-600'"
            >
              <input v-model="form.categories" type="checkbox" :value="c.slug" class="hidden" />
              {{ c.label }}
            </label>
            <RouterLink v-if="activeCategories.length === 0" to="/admin/categories" class="text-sm underline">
              Create a category first
            </RouterLink>
          </div>
        </section>

        <!-- Copy -->
        <section class="border-2 border-earth-200 rounded-2xl bg-white p-6">
          <h2 class="font-bold mb-5">Descriptions</h2>
          <label class="block mb-4">
            <span class="label">Tagline (one line)</span>
            <input v-model="form.tagline" class="input-field" />
          </label>
          <label class="block mb-4">
            <span class="label">Short detail (shown on the product card)</span>
            <input v-model="form.detail" class="input-field" placeholder="e.g. Red palm oil · Multiple litre sizes" />
          </label>
          <label class="block mb-4">
            <span class="label">Full description</span>
            <textarea v-model="form.description" rows="5" class="input-field resize-y" />
          </label>
          <label class="block">
            <span class="label">Related-products group (optional)</span>
            <input v-model="form.family" class="input-field" placeholder="e.g. tomato" />
            <span class="hint">Products sharing the same group name link to each other.</span>
          </label>
        </section>

        <!-- Specs + applications -->
        <section class="border-2 border-earth-200 rounded-2xl bg-white p-6">
          <h2 class="font-bold mb-5">Specifications</h2>
          <div class="flex flex-col gap-2 mb-3">
            <div v-for="(s, i) in form.specs" :key="i" class="flex gap-2">
              <input v-model="s.key" class="input-field !w-2/5" placeholder="Label (e.g. Origin)" />
              <input v-model="s.value" class="input-field flex-1" placeholder="Value" />
              <button type="button" class="text-red-600 text-sm px-2" title="Remove" @click="form.specs.splice(i, 1)">✕</button>
            </div>
          </div>
          <button type="button" class="text-sm font-semibold text-forest-600 underline" @click="form.specs.push({ key: '', value: '' })">
            + Add specification
          </button>

          <h2 class="font-bold mt-8 mb-3">Applications / uses</h2>
          <textarea v-model="applicationsText" rows="4" class="input-field resize-y" placeholder="One per line" />
        </section>

        <!-- Pricing -->
        <section v-if="form.type === 'local'" class="border-2 border-earth-200 rounded-2xl bg-white p-6">
          <h2 class="font-bold mb-1">Pricing</h2>
          <p class="text-xs text-earth-400 mb-5">
            Prices are saved to the same table as the “Quick price editor”, with full price history.
          </p>

          <!-- Single item -->
          <div v-if="form.variants.length === 0">
            <div class="grid sm:grid-cols-3 gap-4">
              <label class="block">
                <span class="label">Price (₦)</span>
                <input v-model.number="form.price_ngn" type="number" min="0" step="1" class="input-field" />
              </label>
              <label class="block">
                <span class="label">Unit</span>
                <input v-model="form.unit" class="input-field" placeholder="kg, bag, piece…" />
              </label>
              <label class="block">
                <span class="label">Minimum order</span>
                <input v-model.number="form.min_qty" type="number" min="1" class="input-field" />
              </label>
            </div>
            <label class="flex items-center gap-2 text-sm mt-4 cursor-pointer">
              <input v-model="form.is_available" type="checkbox" class="w-4 h-4 accent-forest-600" />
              In stock / available to order
            </label>
            <button type="button" class="mt-5 text-sm font-semibold text-forest-600 underline" @click="addVariant">
              Sell in several sizes or brands instead →
            </button>
          </div>

          <!-- Variants -->
          <div v-else class="flex flex-col gap-4">
            <div v-for="(v, i) in form.variants" :key="v.slug + i" class="border-2 border-earth-100 rounded-xl p-4" :class="{ 'opacity-60': !v.is_active }">
              <div class="grid sm:grid-cols-2 gap-3 mb-3">
                <label class="block">
                  <span class="label">Brand</span>
                  <input v-model="v.brand" class="input-field" @input="v.isNew && refreshVariantSlug(v)" />
                </label>
                <label class="block">
                  <span class="label">Size</span>
                  <input v-model="v.size" class="input-field" placeholder="5kg, 1L, Sachet…" @input="v.isNew && refreshVariantSlug(v)" />
                </label>
              </div>
              <div class="grid sm:grid-cols-4 gap-3 mb-3">
                <label class="block">
                  <span class="label">Price (₦)</span>
                  <input v-model.number="v.price_ngn" type="number" min="0" step="1" class="input-field" />
                </label>
                <label class="block">
                  <span class="label">Unit</span>
                  <input v-model="v.unit" class="input-field" />
                </label>
                <label class="block">
                  <span class="label">Min order</span>
                  <input v-model.number="v.min_qty" type="number" min="1" class="input-field" />
                </label>
                <label class="block">
                  <span class="label">Variant slug</span>
                  <input v-model="v.slug" class="input-field text-xs" :readonly="!v.isNew" :class="{ 'opacity-60': !v.isNew }" />
                </label>
              </div>
              <div class="flex flex-wrap items-center justify-between gap-3">
                <ImageUploader v-model="v.image_url" :name="v.slug" compact />
                <div class="flex items-center gap-4 text-sm">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input v-model="v.is_available" type="checkbox" class="w-4 h-4 accent-forest-600" /> In stock
                  </label>
                  <label v-if="!v.isNew" class="flex items-center gap-2 cursor-pointer">
                    <input v-model="v.is_active" type="checkbox" class="w-4 h-4 accent-forest-600" /> Shown in shop
                  </label>
                  <button v-else type="button" class="text-red-600 font-semibold" @click="form.variants.splice(i, 1)">Remove</button>
                </div>
              </div>
            </div>
            <button type="button" class="self-start text-sm font-semibold text-forest-600 underline" @click="addVariant">
              + Add another variant
            </button>
            <p class="text-xs text-earth-400">
              Variants can be hidden but not deleted, because past orders refer to them.
            </p>
          </div>
        </section>
        <section v-else class="border-2 border-earth-200 rounded-2xl bg-white p-6 text-sm text-earth-500">
          Export products have no online price. Customers request a quote instead.
        </section>

        <p v-if="formError" class="text-sm text-red-600 font-medium">{{ formError }}</p>

        <!-- Sticky save bar -->
        <div class="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t-2 border-earth-200 z-30">
          <div class="max-w-3xl mx-auto px-6 md:px-10 py-3 flex items-center justify-between gap-4">
            <p class="text-xs text-earth-400 hidden sm:block">
              Saved edits show to visitors on their next page load.
            </p>
            <div class="flex items-center gap-3 ml-auto">
              <RouterLink to="/admin/products" class="text-sm font-semibold text-earth-500">Cancel</RouterLink>
              <button type="submit" :disabled="saving" class="btn-primary px-8 py-2.5 disabled:opacity-50">
                {{ saving ? "Saving…" : form.isNew ? "Create product" : "Save changes" }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import ImageUploader from '../components/admin/ImageUploader.vue'
import {
  useAdminCatalogStore,
  slugify,
  suggestVariantSlug,
  validateForm,
  type ProductForm,
  type ProductFormVariant,
} from '../stores/adminCatalog'
import { useSeo } from '../composables/useSeo'

const admin = useAdminCatalogStore()
const route = useRoute()
const router = useRouter()

useSeo({ title: 'Edit Product', path: '/admin/products', noindex: true })

const form = ref<ProductForm | null>(null)
const notFound = ref(false)
const saving = ref(false)
const formError = ref('')
const slugTouched = ref(false)

const activeCategories = computed(() => admin.categories.filter((c) => c.is_active))

const load = async () => {
  notFound.value = false
  if (admin.products.length === 0) await admin.fetchAll()
  const slug = route.params.slug
  if (route.name === 'admin-product-new' || !slug) {
    form.value = admin.blankForm()
    slugTouched.value = false
    return
  }
  const f = admin.formFor(String(slug))
  if (!f) notFound.value = true
  form.value = f
}
onMounted(load)
watch(() => route.fullPath, load)

// New product: keep the slug in step with the name until the admin edits it by hand.
watch(
  () => form.value?.name,
  (name) => {
    if (form.value?.isNew && !slugTouched.value) form.value.slug = slugify(name ?? '')
  },
)

// "Applications" is stored as a list; edited as one-per-line text.
const applicationsText = computed({
  get: () => form.value?.applications.join('\n') ?? '',
  set: (v: string) => {
    if (form.value) form.value.applications = v.split('\n')
  },
})

const refreshVariantSlug = (v: ProductFormVariant) => {
  if (!form.value) return
  v.slug = suggestVariantSlug(form.value.slug || slugify(form.value.name), v.brand, v.size)
}

const addVariant = () => {
  if (!form.value) return
  const v: ProductFormVariant = {
    slug: '',
    brand: form.value.name,
    size: '',
    image_url: null,
    is_active: true,
    isNew: true,
    price_ngn: 0,
    unit: form.value.unit || 'kg',
    min_qty: 1,
    is_available: true,
  }
  refreshVariantSlug(v)
  form.value.variants.push(v)
}

const save = async () => {
  if (!form.value) return
  formError.value = ''
  const problem = validateForm(form.value)
  if (problem) {
    formError.value = problem
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    return
  }
  saving.value = true
  const wasNew = form.value.isNew
  const slug = form.value.slug
  try {
    await admin.saveProduct(form.value)
    toast.success(wasNew ? 'Product created.' : 'Changes saved.')
    if (wasNew) await router.replace(`/admin/products/${slug}`)
    else form.value = admin.formFor(slug)
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Could not save.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.label {
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-earth-600, #6b6253);
  margin-bottom: 0.375rem;
}
.hint {
  display: block;
  font-size: 0.7rem;
  color: var(--color-earth-400, #9a907c);
  margin-top: 0.25rem;
}
</style>
