import { waitUntil } from '@vercel/functions';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { bearer, twoFactor, username } from 'better-auth/plugins';

import { env } from '@/env';
import password from '@/models/password';
import { db } from '@/server/db';
import { cuid } from '@/server/db/columns';
import * as authSchema from '@/server/db/schema';

import { syncBearerTokenPlugin } from './plugins/sync-bearer-token';

export const auth = betterAuth({
  appName: env.APP_NAME ?? 'Madda App',
  baseURL: env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  basePath: env.BETTER_BASE_PATH ?? '/api/auth',
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: env.TRUSTED_ORIGINS ?? ['http://localhost:3000'],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
    usePlural: true,
  }),
  advanced: {
    database: {
      generateId: () => cuid(),
    },
    backgroundTasks: {
      handler: (promise) => {
        waitUntil(promise);
      },
    },
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
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
    password: {
      hash: (plainPassword) => password.hash(plainPassword),
      verify: ({ password: plainPassword, hash: storedHash }) =>
        password.compare(plainPassword, storedHash),
    },
    sendResetPassword: async ({ user, url }) => {
      console.log('[sendResetPassword]', user, url);
      // await sendPasswordResetEmail(user, url);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log('[sendVerificationEmail]', user, url);
      // await sendVerifyEmail(user, url);
    },
  },
  user: {
    additionalFields: {
      features: {
        type: 'string[]' as const,
        required: false,
        defaultValue: ['user'],
        input: false,
      },
      notifications: {
        type: 'boolean' as const,
        required: false,
        defaultValue: true,
        input: true,
      },
      description: {
        type: 'string' as const,
        required: false,
        defaultValue: '',
        input: true,
      },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        console.log('[sendChangeEmailConfirmation]', user, newEmail, url);
        // await sendChangeEmailConfirmation(user, newEmail, url);
      },
    },
    deleteUser: {
      enabled: true,
    },
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
  plugins: [
    bearer(),
    username(),
    syncBearerTokenPlugin(),
    twoFactor({
      issuer: env.APP_NAME ?? 'Madda App',
      otpOptions: {
        period: 5,
        allowedAttempts: 5,
        storeOTP: 'encrypted',
        sendOTP: async ({ user, otp }) => {
          console.log('[sendOTP]', user, otp);
          // await sendTwoFactorOtpEmail(user, otp);
        },
      },
      backupCodeOptions: {
        storeBackupCodes: 'encrypted',
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
