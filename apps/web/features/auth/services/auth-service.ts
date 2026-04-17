import type { Profile, SubscriptionStatus, SubscriptionTier, UserStatus } from '@/lib/db-types'

export const AUTH_ROUTES = {
  base: '/api/v1/authentication',
  otpRequest: '/api/v1/authentication/otp/request',
  otpVerify: '/api/v1/authentication/otp/verify',
  refresh: '/api/v1/authentication/refresh',
  logout: '/api/v1/authentication/logout',
} as const

export interface AuthSession {
  accessToken: string
  refreshToken: string | null
  profile: Profile
}

export interface OtpRequestPayload {
  email: string
}

export interface OtpVerifyPayload {
  email: string
  token: string
}

export interface LoginResponseUser {
  id: string
  email: string
  status: UserStatus
  emailConfirmed?: boolean
}

export interface LoginResponseData {
  accessToken: string
  refreshToken?: string | null
  user: LoginResponseUser
}

export interface RefreshResponseData {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: LoginResponseUser
}

export function normalizeProfile(payload: LoginResponseUser): Profile {
  return {
    id: payload.id,
    email: payload.email,
    first_name: null,
    last_name: null,
    status: payload.status,
    subscription: null,
    avatar_url: null,
    is_verified: Boolean(payload.emailConfirmed),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export { ApiError } from '@/lib/api'
