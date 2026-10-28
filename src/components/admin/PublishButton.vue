<template>
  <div class="flex flex-col items-start gap-1">
    <button
      type="button"
      :disabled="busy"
      class="btn-primary px-5 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      @click="publish"
    >
      {{ busy ? "Starting…" : "Publish changes to site" }}
    </button>
    <p class="text-xs text-earth-400 max-w-xs">
      Edits show to visitors as soon as they reload. Publishing also refreshes the
      search-engine pages (takes 1–2 minutes).
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useAdminCatalogStore } from '../../stores/adminCatalog'

const admin = useAdminCatalogStore()
const busy = ref(false)

const publish = async () => {
  if (!window.confirm('Rebuild the live site with the current catalog?')) return
  busy.value = true
  try {
    await admin.publishSite()
    toast.success('Publishing started. The refreshed pages go live in 1–2 minutes.')
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Could not start the publish.')
  } finally {
    busy.value = false
  }
}
</script>
