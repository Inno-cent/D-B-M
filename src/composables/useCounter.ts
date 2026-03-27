import { ref } from 'vue'

export const useCounter = (target: number, duration = 2000) => {
  const count = ref(0)
  const started = ref(false)

  const start = () => {
    if (started.value) return
    started.value = true
    const steps = 60
    const increment = target / steps
    const interval = duration / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        count.value = target
        clearInterval(timer)
      } else {
        count.value = Math.floor(current)
      }
    }, interval)
  }

  return { count, start }
}