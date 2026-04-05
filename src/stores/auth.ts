import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserProfile {
  id: string
  fullName: string
  companyName: string
  email: string
  country: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(
    JSON.parse(localStorage.getItem('dm_user') || 'null')
  )

  const isLoggedIn = computed(() => !!user.value)

  const signUp = (profile: UserProfile) => {
    user.value = profile
    localStorage.setItem('dm_user', JSON.stringify(profile))
  }

  const signIn = (email: string, _password: string) => {
    const saved = JSON.parse(localStorage.getItem('dm_user') || 'null')
    if (saved && saved.email === email) {
      user.value = saved
      return true
    }
    return false
  }

  const signOut = () => {
    user.value = null
    localStorage.removeItem('dm_user')
  }

  return { user, isLoggedIn, signUp, signIn, signOut }
})