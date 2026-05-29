import type { Project } from './project.js';

export type FeatureId = 'auth' | 'tailwind' | 'eslint';

/** `false` = no Drizzle; otherwise the Postgres driver/provider. */
export type DrizzleOption = false | 'postgres' | 'neon';

export type StackOptions = {
  auth: boolean;
  /** Firewall/events tables, repositories, and SQL helpers (requires auth + Drizzle). */
  authEvents: boolean;
  drizzle: DrizzleOption;
  tailwind: boolean;
  eslint: boolean;
};

/** Auth and events require a database; events require auth. */
export function normalizeStack(stack: StackOptions): StackOptions {
  if (!usesDrizzle(stack)) {
    return { ...stack, auth: false, authEvents: false };
  }
  if (!stack.auth) {
    return { ...stack, authEvents: false };
  }
  return stack;
}

export type CreateFlags = {
  noGit: boolean;
  noInstall: boolean;
  importAlias: string;
  defaults: boolean;
};

export type CreateInput = {
  appName: string;
  stack: StackOptions;
  flags: CreateFlags;
};

export type Feature = {
  id: string;
  when?: (stack: StackOptions) => boolean;
  apply: (ctx: Project) => void;
};

export function usesDrizzle(stack: StackOptions): stack is StackOptions & {
  drizzle: 'postgres' | 'neon';
} {
  return stack.drizzle !== false;
}
