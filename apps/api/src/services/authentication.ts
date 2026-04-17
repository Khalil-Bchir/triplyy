import type { PrismaClient } from '@repo/database';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { AuthenticationServiceOptions } from '../types/services.js';
import type { UserStatus } from '@repo/database';

type RefreshPayload = {
  refreshToken: string;
};

type OtpRequestPayload = { email: string };
type OtpVerifyPayload = { email: string; token: string };

type SupabaseClientType = AuthenticationServiceOptions['supabase'];

export class AuthenticationService {
  private prisma: PrismaClient;
  private supabase: SupabaseClientType;

  constructor(options: AuthenticationServiceOptions) {
    this.prisma = options.prisma;
    this.supabase = options.supabase;
  }

  async requestOtp(payload: OtpRequestPayload) {
    const { error } = await this.supabase.auth.signInWithOtp({
      email: payload.email,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: 'OTP sent if the email is valid.',
    };
  }

  async verifyOtp(payload: OtpVerifyPayload) {
    const { data, error } = await this.supabase.auth.verifyOtp({
      email: payload.email,
      token: payload.token,
      type: 'email',
    });

    if (error) {
      const err = new Error(error.message);
      (err as { status?: number }).status = 401;
      throw err;
    }

    const { session, user } = data;

    if (!session || !user) {
      const err = new Error('OTP verification failed.');
      (err as { status?: number }).status = 401;
      throw err;
    }

    const syncedUser = await this.upsertUserFromSupabase(user);

    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresIn: session.expires_in,
      user: {
        id: syncedUser.id,
        email: syncedUser.email,
        status: syncedUser.status,
        emailConfirmed: Boolean(user.email_confirmed_at),
      },
    };
  }

  async refreshSession(payload: RefreshPayload) {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: payload.refreshToken,
    });

    if (error) {
      throw new Error(error.message);
    }

    const { session, user } = data;

    if (!session || !user) {
      const err = new Error('Invalid refresh token.');
      (err as { status?: number }).status = 401;
      throw err;
    }

    const syncedUser = await this.upsertUserFromSupabase(user);

    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresIn: session.expires_in,
      user: {
        id: syncedUser.id,
        email: syncedUser.email,
        status: syncedUser.status,
        emailConfirmed: Boolean(user.email_confirmed_at),
      },
    };
  }

  private async upsertUserFromSupabase(
    user: SupabaseUser,
    overrides?: Partial<{
      firstName: string | null;
      lastName: string | null;
      status: UserStatus;
    }>
  ) {
    const email = user.email;

    if (!email) {
      throw new Error('Supabase user missing email.');
    }

    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    const firstName =
      overrides?.firstName ??
      (typeof meta.first_name === 'string' ? meta.first_name : null) ??
      (typeof meta.given_name === 'string' ? meta.given_name : null) ??
      null;
    const lastName =
      overrides?.lastName ??
      (typeof meta.last_name === 'string' ? meta.last_name : null) ??
      (typeof meta.family_name === 'string' ? meta.family_name : null) ??
      null;

    const status: UserStatus = overrides?.status ?? 'USER';

    const dbUser = await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        email,
        firstName,
        lastName,
        status,
      },
      create: {
        id: user.id,
        email,
        firstName,
        lastName,
        status,
        subscription: {
          create: {
            tier: 'FREE',
            status: 'ACTIVE',
          },
        },
      },
      include: {
        subscription: true,
      },
    });

    // If user existed without a subscription (older data), ensure one exists.
    if (!dbUser.subscription) {
      await this.prisma.subscription.create({
        data: {
          userId: dbUser.id,
          tier: 'FREE',
          status: 'ACTIVE',
        },
      });
    }

    return dbUser;
  }
}
