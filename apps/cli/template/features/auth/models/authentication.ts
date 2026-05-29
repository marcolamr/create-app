import type { NextRequest } from 'next/server';

import { getSessionFromCtx } from 'better-auth/api';

import { auth } from '@/server/auth';
import { Session, User } from '@/server/db/schema';
import { ForbiddenError, UnauthorizedError } from '@/server/errors';

import authorization from './authorization';
import password from './password';

export type RequestUser = (User & { isAnonymous: boolean }) | AnonymousUser;

export type AnonymousUser = {
  id: null;
  username: 'anonymous';
  name: 'Anonymous';
  email: null;
  features: string[];
  isAnonymous: true;
};

function createAnonymousUser(): AnonymousUser {
  return {
    id: null,
    username: 'anonymous',
    name: 'Anonymous',
    email: null,
    features: ['read:activation_token', 'create:session', 'create:user'],
    isAnonymous: true,
  };
}

function toAppUser(user: SessionPayload['user']): User & { isAnonymous: boolean } {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    username: user.username,
    features: user.features ?? [],
    notifications: user.notifications ?? true,
    description: user.description ?? '',
    image: user.image ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    twoFactorEnabled: user.twoFactorEnabled ?? false,
    isAnonymous: false,
  };
}

function toAppSession(session: SessionPayload['session']): Session {
  return {
    id: session.id,
    userId: session.userId,
    token: session.token,
    expiresAt: session.expiresAt,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    ipAddress: session.ipAddress ?? null,
    userAgent: session.userAgent ?? null,
  };
}

function injectAnonymousUser(request: NextRequest): void {
  request.context = {
    ...request.context,
    user: createAnonymousUser(),
  };
}

function injectAuthenticatedUser(
  request: NextRequest,
  sessionPayload: SessionPayload,
): void {
  const user = toAppUser(sessionPayload.user);

  if (!authorization.can(user, 'read:session')) {
    throw new ForbiddenError({
      message: 'Você não possui permissão para executar esta ação.',
      action:
        'Verifique se este usuário já ativou a sua conta e recebeu a feature "read:session".',
      errorLocationCode:
        'MODEL:AUTHENTICATION:INJECT_AUTHENTICATED_USER:USER_CANT_READ_SESSION',
    });
  }

  request.context = {
    ...request.context,
    user,
    session: toAppSession(sessionPayload.session),
  };
}

type AuthHookContext = Parameters<typeof getSessionFromCtx>[0];

type SessionPayload = NonNullable<Awaited<ReturnType<typeof getSessionFromCtx>>>;

/** Rotas em que não exigimos sessão válida com `read:session` (login, cadastro, etc.). */
export const PUBLIC_AUTH_PATHS = new Set([
  '/sign-in/email',
  '/sign-up/email',
  '/sign-in/social',
  '/sign-out',
  '/request-password-reset',
  '/reset-password',
  '/verify-email',
  '/send-verification-email',
]);

type InjectOptions = {
  /** Dentro de hooks do Better Auth — reutiliza o mesmo pipeline de sessão do handler. */
  authCtx?: AuthHookContext;
  /** Sufixo da rota Better Auth (`ctx.path`), ex.: `/sign-in/email`. */
  path?: string;
};

function isSessionPayload(value: unknown): value is SessionPayload {
  if (!value || typeof value !== 'object') {
    return false;
  }
  return 'user' in value && 'session' in value && Boolean(value.user && value.session);
}

function isSignInPayload(
  value: unknown,
): value is { user: SessionPayload['user']; token: string } {
  if (!value || typeof value !== 'object') {
    return false;
  }
  return 'user' in value && 'token' in value && Boolean(value.user && value.token);
}

/**
 * Preenche `request.context` antes do handler (rotas públicas → anônimo; demais → tenta sessão).
 */
async function injectRequestContext(
  request: NextRequest,
  options?: InjectOptions,
): Promise<void> {
  request.context = request.context ?? {};

  if (options?.path && PUBLIC_AUTH_PATHS.has(options.path)) {
    injectAnonymousUser(request);
    return;
  }

  await injectAnonymousOrUser(request, options);
}

/**
 * Atualiza `request.context` depois do handler Better Auth (logs com usuário real).
 * Usa `ctx.context.session`, body retornado (`get-session`, `sign-in`, etc.) ou cookie/Bearer.
 */
async function syncRequestContextAfterHandler(
  request: NextRequest,
  ctx: AuthHookContext,
): Promise<void> {
  request.context = request.context ?? {};

  if (isSessionPayload(ctx.context.session)) {
    injectAuthenticatedUser(request, ctx.context.session);
    return;
  }

  const returned = ctx.context.returned;
  if (isSessionPayload(returned)) {
    injectAuthenticatedUser(request, returned);
    return;
  }

  if (isSignInPayload(returned)) {
    const user = toAppUser(returned.user);
    // Login bem-sucedido: injeta usuário nos logs sem exigir `read:session` (isso vale em rotas protegidas).
    request.context = {
      ...request.context,
      user,
      session: {
        id: '',
        userId: user.id,
        token: returned.token,
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    return;
  }

  if (ctx.path && PUBLIC_AUTH_PATHS.has(ctx.path)) {
    injectAnonymousUser(request);
    return;
  }

  await injectAnonymousOrUser(request, { authCtx: ctx, path: ctx.path });
}

async function injectAnonymousOrUser(
  request: NextRequest,
  options?: InjectOptions,
): Promise<void> {
  request.context = request.context ?? {};

  const sessionPayload = options?.authCtx
    ? await getSessionFromCtx(options.authCtx, { disableRefresh: true })
    : await auth.api.getSession({ headers: request.headers });

  if (sessionPayload?.user && sessionPayload?.session) {
    injectAuthenticatedUser(request, sessionPayload);
    return;
  }

  injectAnonymousUser(request);
}

function getRequestUser(request: NextRequest): RequestUser | undefined {
  return request.context?.user as RequestUser | undefined;
}

function isAuthenticated(request: NextRequest): boolean {
  const user = getRequestUser(request);
  return Boolean(user && !user.isAnonymous);
}

async function hashPassword(unhashedPassword: string): Promise<string> {
  return password.hash(unhashedPassword);
}

async function comparePasswords(
  providedPassword: string,
  passwordHash: string,
): Promise<void> {
  const passwordMatches = await password.compare(providedPassword, passwordHash);

  if (!passwordMatches) {
    throw new UnauthorizedError({
      message: `A senha informada não confere com a senha do usuário.`,
      action: `Verifique se a senha informada está correta e tente novamente.`,
      errorLocationCode: 'MODEL:AUTHENTICATION:COMPARE_PASSWORDS:PASSWORD_MISMATCH',
    });
  }
}

export default Object.freeze({
  comparePasswords,
  createAnonymousUser,
  hashPassword,
  isAuthenticated,
  injectAnonymousOrUser,
  injectRequestContext,
  syncRequestContextAfterHandler,
});
