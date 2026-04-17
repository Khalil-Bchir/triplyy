'use client'

import { useAuthStore } from '@/store/auth-store'

export function useAuth() {
  const profile = useAuthStore((state) => state.profile)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const authLoading = useAuthStore((state) => state.authLoading)
  const authError = useAuthStore((state) => state.authError)
  const requestOtp = useAuthStore((state) => state.requestOtp)
  const verifyOtp = useAuthStore((state) => state.verifyOtp)
  const signOut = useAuthStore((state) => state.signOut)
  const revalidateSession = useAuthStore((state) => state.revalidateSession)

  return {
    profile,
    hasHydrated,
    isAuthenticated: hasHydrated && Boolean(profile),
    authLoading,
    authError,
    revalidateSession,
    requestOtp,
    verifyOtp,
    signOut,
  }
}
