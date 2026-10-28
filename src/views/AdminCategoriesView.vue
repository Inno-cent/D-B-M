<template>
  <div class="bg-cream text-earth-900 min-h-screen pt-24 pb-16">
    <div class="max-w-3xl mx-auto px-6 md:px-10">
      <RouterLink to="/admin/products" class="text-sm font-semibold text-forest-600 underline">
        ← All products
      </RouterLink>
      <h1 class="text-3xl font-bold tracking-tight mt-3 mb-2">Categories</h1>
      <p class="text-earth-600 mb-8">The shelves shown on the home page and the shop filters.</p>

      <div v-if="admin.loading && admin.categories.length === 0" class="text-earth-400 py-12 text-center">
        Loading…
      </div>
      <div v-else-if="admin.error" class="text-red-600 bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
        {{ admin.error }}
      </div>

      <template v-else>
        <!-- New category -->
        <form class="border-2 border-forest-200 bg-forest-50/40 rounded-2xl p-5 mb-6" @submit.prevent="create">
          <h2 class="font-bold mb-4">Add a category</h2>
          <div class="grid sm:grid-cols-2 gap-3 mb-4">
            <input v-model="draft.label" class="input-field" placeholder="Name, e.g. Baby Food" required />
            <input v-model="draft.slug" class="input-field" placeholder="slug (auto)" @input="draftSlugTouched = true" />
          </div>
          <div class="flex flex-wrap items-center justify-between gap-4">
            <ImageUploader v-model="draft.image_url" :name="draft.slug || draft.label" compact />
            <button type="submit" :disabled="creating" class="btn-primary px-6 py-2.5 text-sm disabled:opacity-50">
              {{ creating ? "Adding…" : "Add category" }}
            </button>
          </div>
        </form>

        <div class="flex flex-col gap-3">
          <div
            v-for="row in rows"
            :key="row.slug"
            class="border-2 border-earth-200 rounded-2xl bg-white p-4"
            :class="{ 'opacity-60': !row.is_active }"
          >
            <div class="flex flex-wrap items-center gap-4">
              <ImageUploader v-model="row.image_url" :name="row.slug" compact />
              <div class="flex-1 min-w-[160px]">
                <input v-model="row.label" class="input-field mb-1" />
                <p class="text-xs text-earth-400">
                  {{ row.slug }} · {{ admin.productsInCategory(row.slug) }} product(s)
                </p>
              </div>
              <label class="text-xs text-earth-500">
                Order
                <input v-model.number="row.sort_order" type="number" step="10" class="input-field !w-20 mt-1" />
              </label>
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input v-model="row.is_active" type="checkbox" class="w-4 h-4 accent-forest-600" /> Shown
              </label>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  :disabled="!isDirty(row) || savingSlug === row.slug"
                  class="btn-primary !py-2 !px-4 !text-xs disabled:opacity-40"
                  @click="save(row)"
                >
                  {{ savingSlug === row.slug ? "Saving…" : "Save" }}
                </button>
                <button type="button" class="text-xs font-semibold text-red-600 underline" @click="remove(row)">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import ImageUploader from '../components/admin/ImageUploader.vue'
import { useAdminCatalogStore, slugify, type AdminCategory } from '../stores/adminCatalog'
import { useSeo } from '../composables/useSeo'

const admin = useAdminCatalogStore()
useSeo({ title: 'Manage Categories', path: '/admin/categories', noindex: true })

// Editable copies, so typing doesn't change the store until Save.
const rows = ref<AdminCategory[]>([])
const original = ref<Record<string, string>>({})
const snapshot = (c: AdminCategory) =>
  JSON.stringify([c.label, c.image_url, c.sort_order, c.is_active])

const sync = () => {
  rows.value = admin.categories.map((c) => ({ ...c }))
  original.value = Object.fromEntries(admin.categories.map((c) => [c.slug, snapshot(c)]))
}
onMounted(async () => {
  await admin.fetchAll()
  sync()
})
watch(() => admin.categories, sync)

const isDirty = (row: AdminCategory) => snapshot(row) !== original.value[row.slug]

const savingSlug = ref<string | null>(null)
const save = async (row: AdminCategory) => {
  savingSlug.value = row.slug
  try {
    await admin.saveCategory(row, false)
    toast.success('Category saved.')
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Could not save.')
  } finally {
    savingSlug.value = null
  }
}

const remove = async (row: AdminCategory) => {
  if (!window.confirm(`Delete the category “${row.label}”?`)) return
  try {
    await admin.deleteCategory(row.slug)
    toast.success('Category deleted.')
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Could not delete.')
  }
}

// New category form
const draft = reactive<AdminCategory>({ slug: '', label: '', image_url: null, sort_order: 0, is_active: true })
const draftSlugTouched = ref(false)
const creating = ref(false)
watch(
  () => draft.label,
  (l) => {
    if (!draftSlugTouched.value) draft.slug = slugify(l)
  },
)
const create = async () => {
  creating.value = true
  try {
    draft.sort_order = (admin.categories.reduce((m, c) => Math.max(m, c.sort_order), 0) || 0) + 10
    await admin.saveCategory({ ...draft }, true)
    toast.success('Category added.')
    Object.assign(draft, { slug: '', label: '', image_url: null })
    draftSlugTouched.value = false
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Could not add the category.')
  } finally {
    creating.value = false
  }
}
</script>
