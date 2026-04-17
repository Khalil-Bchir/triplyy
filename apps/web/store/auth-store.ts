import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import axios from 'axios'
import type { Profile } from '@/lib/db-types'
import { createCookieAuthApiClient, ApiError } from '@/lib/api-client'
import type { AxiosInstance } from 'axios'
import {
  AUTH_ROUTES,
  type OtpRequestPayload,
  type OtpVerifyPayload,
  normalizeProfile,
  type LoginResponseData,
} from '@/features/auth/services/auth-service'
import { USER_ROUTES } from '@/features/users/services/user-service'

export interface AuthState {
  profile: Profile | null
  hasHydrated: boolean
  authLoading: boolean
  authError: string | null
  setSession: (session: { profile: Profile }) => void
  clearSession: () => void
  setHasHydrated: (value: boolean) => void
  /** Revalidate profile from server (GET /users/me). Role comes from JWT; keeps UI in sync with token. */
  revalidateSession: () => Promise<Profile | null>
  requestOtp: (payload: OtpRequestPayload) => Promise<void>
  verifyOtp: (payload: OtpVerifyPayload) => Promise<void>
  signOut: () => Promise<void>
}

const STORAGE_KEY = process.env.NEXT_PUBLIC_APP_AUTH_STORAGE_KEY ?? 'app.auth'
const baseURL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')

type PersistedAuthState = Pick<AuthState, 'profile'>

const storage =
  typeof window !== 'undefined'
    ? createJSONStorage<PersistedAuthState>(() => localStorage)
    : undefined

let authClient: AxiosInstance | null = null

function getAuthClient(): AxiosInstance {
  if (authClient) return authClient
  const refreshClient = axios.create({
    baseURL: baseURL.replace(/\/$/, ''),
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  })
  authClient = createCookieAuthApiClient({
    baseURL,
    useCookies: true,
    refreshUrl: AUTH_ROUTES.refresh,
    onRefresh: async () => {
      await refreshClient.post(AUTH_ROUTES.refresh, {})
    },
  })
  return authClient
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const setAuthLoading = (loading: boolean) => set({ authLoading: loading })
      const setAuthError = (error: string | null) => set({ authError: error })
      const clearAuthError = () => set({ authError: null })

      return {
        profile: null,
        hasHydrated: false,
        authLoading: false,
        authError: null,
        setSession: ({ profile }) =>
          set({ profile, hasHydrated: true }),
        clearSession: () =>
          set({ profile: null, hasHydrated: true }),
        setHasHydrated: (value: boolean) => set({ hasHydrated: value }),

        revalidateSession: async () => {
          try {
            const client = getAuthClient()
            const { data } = await client.get<{ data: { id: string; email: string; status: 'LEAD' | 'USER'; profile: { firstName?: string | null; lastName?: string | null }; subscription: { tier: 'FREE' | 'BASIC' | 'PRO'; status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'TRIALING' } | null } }>(USER_ROUTES.me)
            const d = data.data
            const profile: Profile = {
              id: d.id,
              email: d.email,
              first_name: d.profile?.firstName ?? null,
              last_name: d.profile?.lastName ?? null,
              status: d.status,
              subscription: d.subscription,
              avatar_url: null,
              is_verified: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }

            set({
              profile: {
                ...profile,
              },
            })
            return profile
          } catch {
            get().clearSession()
            return null
          }
        },

        requestOtp: async (payload: OtpRequestPayload) => {
          setAuthLoading(true)
          clearAuthError()
          try {
            const client = getAuthClient()
            await client.post(AUTH_ROUTES.otpRequest, payload)
            set({ authLoading: false, authError: null })
          } catch (err) {
            const message =
              err instanceof ApiError ? err.message : 'Could not send code. Please try again.'
            set({ authLoading: false, authError: message })
            throw err
          }
        },

        verifyOtp: async (payload: OtpVerifyPayload) => {
          setAuthLoading(true)
          clearAuthError()
          try {
            const client = getAuthClient()
            const { data } = await client.post<{ data: LoginResponseData }>(AUTH_ROUTES.otpVerify, payload)
            const session = data.data
            const profile = normalizeProfile(session.user)
            set({
              profile,
              hasHydrated: true,
              authLoading: false,
              authError: null,
            })
          } catch (err) {
            const message =
              err instanceof ApiError ? err.message : 'Invalid code. Please try again.'
            set({ authLoading: false, authError: message })
            throw err
          }
        },

        signOut: async () => {
          try {
            const client = getAuthClient()
            await client.post(AUTH_ROUTES.logout, {})
          } finally {
            get().clearSession()
            setAuthError(null)
          }
        },
      }
    },
    {
      name: STORAGE_KEY,
      storage,
      partialize: (state: AuthState): PersistedAuthState => ({
        profile: state.profile,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
        if (state?.profile) state?.revalidateSession()
      },
    },
  ),
)
