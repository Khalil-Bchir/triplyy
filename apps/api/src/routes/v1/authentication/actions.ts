import { OpenAPIHono } from "@hono/zod-openapi";
import type { AutoLoadRoute } from "hono-autoload/types";
import { HTTPException } from "hono/http-exception";
import { getCookie } from "hono/cookie";
import type { AppContext, Env } from "../../../types/index.js";
import {
  otpRequestSchema,
  otpVerifySchema,
  refreshSchema,
  logoutSchema,
} from "../../../schema/v1/authentication.schema.js";
import { AuthenticationService } from "../../../services/authentication.js";
import { logger } from "../../../utils/logger.js";
import { setAuthCookies, clearAuthCookies, AUTH_COOKIE_NAMES } from "../../../middleware/cookie.js";

const handler = new OpenAPIHono<Env>();

const getService = (c: AppContext) => {
  const supabase = c.get("supabase");
  const prisma = c.get("prisma");

  return new AuthenticationService({
    supabase,
    prisma,
  });
};

const normalizeError = (error: unknown, fallbackStatus = 500) => {
  if (error instanceof HTTPException) {
    return { status: error.status, message: error.message };
  }

  if (error instanceof Error) {
    const status = (error as { status?: number }).status ?? fallbackStatus;
    return { status, message: error.message };
  }

  return { status: fallbackStatus, message: "Unexpected error" };
};

handler.openapi(otpRequestSchema, async (c) => {
  const payload = await c.req.json<{ email: string }>();
  const service = getService(c);

  try {
    const result = await service.requestOtp({ email: payload.email });

    return c.json(result, 200);
  } catch (error) {
    logger.warn({ error, scope: "auth.otp.request" }, "OTP request failed");
    const normalized = normalizeError(error, 400);
    const status: 400 | 500 = normalized.status >= 500 ? 500 : 400;

    return c.json(
      {
        error: {
          message: normalized.message,
          code: "AUTH_OTP_REQUEST_FAILED",
        },
      },
      status
    );
  }
});

handler.openapi(otpVerifySchema, async (c) => {
  const payload = await c.req.json<{ email: string; token: string }>();
  const service = getService(c);

  try {
    const result = await service.verifyOtp(payload);
    setAuthCookies(c, result.accessToken, result.refreshToken, result.expiresIn);
    return c.json({ data: result }, 200);
  } catch (error) {
    logger.warn({ error, scope: "auth.otp.verify" }, "OTP verify failed");
    const normalized = normalizeError(error, 401);
    const status: 400 | 401 | 500 =
      normalized.status >= 500 ? 500 : normalized.status === 400 ? 400 : 401;
    return c.json(
      { error: { message: normalized.message, code: "AUTH_OTP_VERIFY_FAILED" } },
      status,
    );
  }
});

handler.openapi(refreshSchema, async (c) => {
  const body = await c.req.json<{ refreshToken?: string }>().catch(() => ({} as { refreshToken?: string }));
  const refreshToken =
    body.refreshToken ?? getCookie(c, AUTH_COOKIE_NAMES.refreshToken) ?? null;
  if (!refreshToken) {
    return c.json(
      { error: { message: "Refresh token required", code: "AUTH_REFRESH_FAILED" } },
      401
    );
  }
  const service = getService(c);

  try {
    const result = await service.refreshSession({ refreshToken });
    setAuthCookies(c, result.accessToken, result.refreshToken, result.expiresIn);
    return c.json({ data: result }, 200);
  } catch (error) {
    logger.warn({ error, scope: "auth.refresh" }, "Token refresh failed");
    const normalized = normalizeError(error, 401);
    const status: 400 | 401 | 500 =
      normalized.status >= 500 ? 500 : normalized.status === 400 ? 400 : 401;

    return c.json(
      {
        error: {
          message: normalized.message,
          code: "AUTH_REFRESH_FAILED",
        },
      },
      status
    );
  }
});

handler.openapi(logoutSchema, async (c) => {
  clearAuthCookies(c);
  return c.json({ message: "Logged out" }, 200);
});

const routeModule: AutoLoadRoute = {
  path: "/api/v1/authentication",
  handler: handler as unknown as AutoLoadRoute["handler"],
};

export default routeModule;
