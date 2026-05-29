import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    APP_NAME: z.string().default('Madda App'),
    BETTER_AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(32, 'BETTER_AUTH_SECRET must be at least 32 characters')
        : z.string().optional(),
    BETTER_AUTH_URL: z.url(),
    BETTER_BASE_PATH: z.string().min(1, 'BETTER_BASE_PATH is required'),
    DATABASE_URL: z.url().min(1, 'DATABASE_URL is required'),
    GOOGLE_CLIENT_ID:
      process.env.NODE_ENV === "production"
        ? z.string().min(1, 'GOOGLE_CLIENT_ID is required')
        : z.string().optional(),
    GOOGLE_CLIENT_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1, 'GOOGLE_CLIENT_SECRET is required')
        : z.string().optional(),
    TRUSTED_ORIGINS: z.preprocess((value) => {
      if (Array.isArray(value) && value.length > 0) return value;
      const parsed = typeof value === 'string' ? parseOrigins(value) : [];
      return parsed.length > 0 ? parsed : resolveTrustedOrigins();
    }, z.array(z.url()).min(1)),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.url().default('http://localhost:3000'),
    NEXT_PUBLIC_BETTER_BASE_PATH: z.string().min(1).default('/api/v1/auth'),
    NEXT_PUBLIC_WEBSERVER_HOST: z.string().min(1).default('localhost'),
    NEXT_PUBLIC_WEBSERVER_PORT: z.coerce.number().min(1).max(65535).default(3000),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    APP_NAME: process.env.APP_NAME,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_BASE_PATH: process.env.BETTER_BASE_PATH,
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    TRUSTED_ORIGINS: process.env.TRUSTED_ORIGINS,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BETTER_BASE_PATH: process.env.NEXT_PUBLIC_BETTER_BASE_PATH,
    NEXT_PUBLIC_WEBSERVER_HOST: process.env.NEXT_PUBLIC_WEBSERVER_HOST,
    NEXT_PUBLIC_WEBSERVER_PORT: process.env.NEXT_PUBLIC_WEBSERVER_PORT,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});

function parseOrigins(value) {
  if (!value?.trim()) return [];
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function resolveTrustedOrigins() {
  const parsed = parseOrigins(process.env.TRUSTED_ORIGINS);
  if (parsed.length > 0) return parsed;

  const authUrl = process.env.BETTER_AUTH_URL?.trim();
  return authUrl ? [authUrl] : ['http://localhost:3000'];
}
