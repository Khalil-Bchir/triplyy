export type UserStatus = 'LEAD' | 'USER'
export type SubscriptionTier = 'FREE' | 'BASIC' | 'PRO'
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'TRIALING'

/**
 * Auth profile shape used in the web app (session, store).
 * Aligns with API auth responses and normalizeProfile output.
 */
export interface Profile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  status: UserStatus
  subscription: { tier: SubscriptionTier; status: SubscriptionStatus } | null
  avatar_url: string | null
  is_verified: boolean
  created_at: string
  updated_at: string
}
