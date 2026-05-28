import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';

import { env } from '@/env';

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        socialProviders: {
          github: {
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
