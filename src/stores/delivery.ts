import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import type { DeliveryZone } from '../types/database'

export const useDeliveryStore = defineStore('delivery', () => {
  const zones = ref<DeliveryZone[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchZones = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('delivery_zones')
        .select('*')
        .order('zone_name', { ascending: true })
      if (err) throw err
      zones.value = (data ?? []) as DeliveryZone[]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load delivery zones'
    } finally {
      loading.value = false
    }
  }

  const zoneForState = (state: string): DeliveryZone | null => {
    if (!state) return null
    return (
      zones.value.find((z) => z.states.some((s) => s.toLowerCase() === state.toLowerCase())) ?? null
    )
  }

  const allStates = computed(() => {
    const set = new Set<string>()
    for (const z of zones.value) for (const s of z.states) set.add(s)
    return Array.from(set).sort()
  })

  const formatNgn = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount)

  return { zones, loading, error, allStates, fetchZones, zoneForState, formatNgn }
})
