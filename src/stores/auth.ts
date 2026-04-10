import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '../types/database'

export const useAuthStore = defineStore('auth', () => {
  const user    = ref<User | null>(null)
  const profile = ref<Profile | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin    = computed(() => profile.value?.role === 'admin')
  const fullName   = computed(() =>
    profile.value?.full_name || user.value?.email?.split('@')[0] || ''
  )
  const firstName = computed(() =>
    fullName.value.split(' ')[0]
  )

  // ── Init ────────────────────────────────────────────────────
  const init = async () => {
    loading.value = true
    try {
      const { data } = await supabase.auth.getSession()
      session.value = data.session
      user.value    = data.session?.user ?? null
      if (user.value) await fetchProfile()
    } finally {
      loading.value = false
    }

    supabase.auth.onAuthStateChange(async (event, newSession) => {
      session.value = newSession
      user.value    = newSession?.user ?? null

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (user.value) await fetchProfile()
      }

      if (event === 'SIGNED_OUT') {
        profile.value = null
      }
    })
  }

  // ── Fetch profile ───────────────────────────────────────────
  const fetchProfile = async () => {
    if (!user.value) return
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()
    if (!error && data) profile.value = data as Profile
  }

  // ── Sign up ─────────────────────────────────────────────────
  const signUp = async (
    email:       string,
    password:    string,
    fullName:    string,
    companyName: string,
    country:     string,
    phone?:      string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name:    fullName,
          company_name: companyName,
          country,
          phone: phone || '',
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    })
    if (error) throw error
    return data
  }

  // ── Sign in ─────────────────────────────────────────────────
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  // ── Sign out ────────────────────────────────────────────────
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value    = null
    profile.value = null
    session.value = null
  }

  // ── Forgot password ─────────────────────────────────────────
  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) throw error
  }

  // ── Reset password ──────────────────────────────────────────
  const resetPassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw error
    return data
  }

  // ── Update profile ──────────────────────────────────────────
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user.value) return
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.value.id)
      .select()
      .single()
    if (error) throw error
    profile.value = data as Profile
    return data
  }

  return {
    user, profile, session, loading,
    isLoggedIn, isAdmin, fullName, firstName,
    init, fetchProfile,
    signUp, signIn, signOut,
    forgotPassword, resetPassword,
    updateProfile,
  }
})