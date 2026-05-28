/**
 * Paths redacted from log output (pino `redact` option).
 * @see https://getpino.io/#/docs/api?id=redact
 */
export const DEFAULT_REDACT_PATHS = [
  'authorization',
  'cookie',
  'set-cookie',
  'password',
  'newPassword',
  'currentPassword',
  'confirmPassword',
  'token',
  'accessToken',
  'refreshToken',
  'idToken',
  'secret',
  'apiKey',
  'api_key',
  'DATABASE_URL',
  'BETTER_AUTH_SECRET',
  'GOOGLE_CLIENT_SECRET',
  'AXIOM_TOKEN',
  'req.headers.authorization',
  'req.headers.cookie',
  'req.headers["x-api-key"]',
  'headers.authorization',
  'headers.cookie',
  'body.password',
  'body.token',
  'body.secret',
  'body.refreshToken',
  'body.accessToken',
  'context.password',
  'context.token',
  'context.secret',
] as const;

export function mergeRedactPaths(extra: string[] = []): string[] {
  return [...new Set([...DEFAULT_REDACT_PATHS, ...extra])];
}

export function parseExtraRedactPaths(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(',')
    .map((path) => path.trim())
    .filter(Boolean);
}
