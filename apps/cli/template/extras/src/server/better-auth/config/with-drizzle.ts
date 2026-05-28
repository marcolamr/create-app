import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { env } from "@/env";
import { db } from "@/server/db";
import * as authSchema from '@/server/db/schema';

export const auth = betterAuth({
  appName: env.APP_NAME ?? 'Devflow',
  baseURL: env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  basePath: env.BETTER_BASE_PATH ?? '/api/v1/auth',
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: env.TRUSTED_ORIGINS ?? ['http://localhost:3000'],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
    usePlural: true,
  }),
  advanced: {
    ipAddress: {
      ipAddressHeaders: ['x-forwarded-for', 'cf-connecting-ip', 'x-real-ip'],
    },
  },
  rateLimit: {
    enabled: env.NODE_ENV !== 'test',
    window: 60,
    max: 100,
    storage: 'database',
  },
  emailAndPassword: {
    enabled: true,
  },
  ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        socialProviders: {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          },
        },
      }
    : {}),
  // Make sure nextCookies() is the last plugin in the array
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
