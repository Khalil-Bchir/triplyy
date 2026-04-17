import { createRoute, z } from "@hono/zod-openapi";

const authErrorSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
  }),
});

const authTokensResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number().positive(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    status: z.enum(["LEAD", "USER"]),
    emailConfirmed: z.boolean(),
  }),
});

export const otpRequestSchema = createRoute({
  method: "post",
  path: "/otp/request",
  tags: ["Authentication"],
  summary: "Request a one-time code via email",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            email: z.string().email(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "OTP request accepted",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: "Invalid request",
      content: {
        "application/json": {
          schema: authErrorSchema,
        },
      },
    },
    500: {
      description: "Unexpected error",
      content: {
        "application/json": {
          schema: authErrorSchema,
        },
      },
    },
  },
});

export const otpVerifySchema = createRoute({
  method: "post",
  path: "/otp/verify",
  tags: ["Authentication"],
  summary: "Verify OTP code and create a session",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            email: z.string().email(),
            token: z.string().min(4).max(12),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "User authenticated via OTP",
      content: {
        "application/json": {
          schema: z.object({
            data: authTokensResponseSchema,
          }),
        },
      },
    },
    400: {
      description: "Invalid request",
      content: {
        "application/json": {
          schema: authErrorSchema,
        },
      },
    },
    401: {
      description: "OTP verification failed",
      content: {
        "application/json": {
          schema: authErrorSchema,
        },
      },
    },
    500: {
      description: "Unexpected error",
      content: {
        "application/json": {
          schema: authErrorSchema,
        },
      },
    },
  },
});

export const refreshSchema = createRoute({
  method: "post",
  path: "/refresh",
  tags: ["Authentication"],
  summary: "Refresh access token using refresh token (cookie or body)",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            refreshToken: z.string().min(1).optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Tokens refreshed",
      content: {
        "application/json": {
          schema: z.object({
            data: authTokensResponseSchema,
          }),
        },
      },
    },
    400: {
      description: "Invalid request or refresh token",
      content: {
        "application/json": {
          schema: authErrorSchema,
        },
      },
    },
    401: {
      description: "Unauthorized / invalid refresh token",
      content: {
        "application/json": {
          schema: authErrorSchema,
        },
      },
    },
    500: {
      description: "Unexpected error",
      content: {
        "application/json": {
          schema: authErrorSchema,
        },
      },
    },
  },
});

export const logoutSchema = createRoute({
  method: "post",
  path: "/logout",
  tags: ["Authentication"],
  summary: "Clear auth cookies (logout)",
  request: {},
  responses: {
    200: {
      description: "Logged out",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    500: {
      description: "Unexpected error",
      content: {
        "application/json": {
          schema: authErrorSchema,
        },
      },
    },
  },
});