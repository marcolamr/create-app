import type { Project } from './project.js';

export type FeatureId = 'auth' | 'tailwind' | 'eslint';

/** `false` = no Drizzle; otherwise the Postgres driver/provider. */
export type DrizzleOption = false | 'postgres' | 'neon';

export type StackOptions = {
  auth: boolean;
  drizzle: DrizzleOption;
  tailwind: boolean;
  eslint: boolean;
};

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
