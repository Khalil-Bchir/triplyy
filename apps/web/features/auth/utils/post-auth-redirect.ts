import type { Profile } from '@/lib/db-types'

export function getPostAuthRedirectPath(profile: Profile | null): string {
  if (!profile) return '/auth/login'
  const tier = profile.subscription?.tier ?? 'FREE'
  if (tier === 'FREE') return '/upgrade'
  return '/overview'
}

