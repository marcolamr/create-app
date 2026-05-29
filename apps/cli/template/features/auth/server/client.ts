import { twoFactorClient, usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { env } from '@/env';

export const authClient = createAuthClient({
  baseURL: env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  basePath: env.BETTER_BASE_PATH ?? '/api/v1/auth',
  plugins: [
    usernameClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/two-factor';
        }
      },
    }),
  ],
  fetchOptions: {
    onSuccess(ctx) {
      const token = ctx.response.headers.get('set-auth-token');
      if (token && typeof window !== 'undefined') {
        window.localStorage.setItem('bearer_token', token);
      }
    },
    auth: {
      type: 'Bearer',
      token: () =>
        typeof window !== 'undefined'
          ? (window.localStorage.getItem('bearer_token') ?? '')
          : '',
    },
  },
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  requestPasswordReset,
  resetPassword,
  changePassword,
  sendVerificationEmail,
} = authClient;
