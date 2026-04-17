import type { SubscriptionStatus, SubscriptionTier, UserStatus } from '@/lib/db-types'

/**
 * User API types and route constants. HTTP is done in user-store.
 * Role comes from the JWT (token) via the server; /me returns it for session revalidation.
 */
export type BackendUserProfile = {
  id: string
  email: string
  status: UserStatus
  profile: {
    firstName?: string | null
    lastName?: string | null
  }
  subscription: { tier: SubscriptionTier; status: SubscriptionStatus } | null
}

export type UpdateMePayload = {
  firstName?: string
  lastName?: string
}

export const USER_ROUTES = {
  me: '/api/v1/users/me',
} as const

export { ApiError } from '@/lib/api'
