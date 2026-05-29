export const DEFAULT_NEW_USER_FEATURES = [
  'create:session',
  'read:session',
  'update:user',
] as const;

export type DefaultNewUserFeature = (typeof DEFAULT_NEW_USER_FEATURES)[number];

/** Cópia mutável para `defaultValue` do Better Auth e inserts Drizzle. */
export function getDefaultNewUserFeatures(): string[] {
  return [...DEFAULT_NEW_USER_FEATURES];
}

export function hasDefaultNewUserFeatures(
  features: readonly string[] | null | undefined,
): boolean {
  if (!features?.length) {
    return false;
  }

  return DEFAULT_NEW_USER_FEATURES.every((feature) => features.includes(feature));
}
