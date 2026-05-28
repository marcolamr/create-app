import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

import { env } from "@/env";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  ...(env.BETTER_AUTH_GITHUB_CLIENT_ID && env.BETTER_AUTH_GITHUB_CLIENT_SECRET
    ? {
        socialProviders: {
          github: {
            clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
            clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
            redirectURI: "http://localhost:3000/api/auth/callback/github",
          },
        },
      }
    : {}),
  // Make sure nextCookies() is the last plugin in the array
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
