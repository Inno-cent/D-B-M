<template>
  <div class="flex items-center gap-4">
    <div
      class="rounded-xl border-2 border-earth-200 bg-white overflow-hidden flex items-center justify-center flex-shrink-0"
      :class="compact ? 'w-16 h-16' : 'w-28 h-28'"
    >
      <img
        v-if="modelValue"
        :src="modelValue"
        alt=""
        class="w-full h-full object-cover"
        @error="broken = true"
        @load="broken = false"
      />
      <span v-if="!modelValue || broken" class="text-[10px] text-earth-400 text-center px-1">
        {{ broken ? "Can't load" : "No image" }}
      </span>
    </div>

    <div class="flex flex-col gap-1.5 min-w-0">
      <div class="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          :disabled="busy"
          class="btn-outline !py-1.5 !px-3 !text-xs disabled:opacity-50"
          @click="input?.click()"
        >
          {{ busy ? "Uploading…" : modelValue ? "Replace image" : "Upload image" }}
        </button>
        <button
          v-if="modelValue && !busy"
          type="button"
          class="text-xs font-semibold text-red-600 underline"
          @click="emit('update:modelValue', null)"
        >
          Remove
        </button>
      </div>
      <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
      <p v-else-if="!compact" class="text-xs text-earth-400">
        JPG, PNG or WebP. Large photos are resized automatically.
      </p>
    </div>

    <input ref="input" type="file" accept="image/*" class="hidden" @change="onPick" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAdminCatalogStore } from '../../stores/adminCatalog'

const props = defineProps<{
  modelValue: string | null
  /** Used to name the uploaded file, e.g. the product slug. */
  name: string
  compact?: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>()

const admin = useAdminCatalogStore()
const input = ref<HTMLInputElement | null>(null)
const busy = ref(false)
const error = ref('')
const broken = ref(false)

const onPick = async (e: Event) => {
  const el = e.target as HTMLInputElement
  const file = el.files?.[0]
  el.value = '' // allow picking the same file again
  if (!file) return
  error.value = ''
  busy.value = true
  try {
    const url = await admin.uploadImage(file, props.name || 'image')
    emit('update:modelValue', url)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Upload failed'
  } finally {
    busy.value = false
  }
}
</script>
