import type { NextRequest } from 'next/server';

import { waitUntil } from '@vercel/functions';
import cookie from 'cookie';
import { randomUUID as uuidV4 } from 'node:crypto';

import webserver from '@/config/webserver';
import {
  ForbiddenError,
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  serializeErrorForClient,
  TooManyRequestsError,
  UnauthorizedError,
  UnprocessableEntityError,
  ValidationError,
} from '@/server/errors';
import { extractFromRequest } from '@/server/ip';
import logger from '@/server/logger';
import snakeize from '@/lib/helpers/snakeize';

function injectRequestMetadata(request: NextRequest) {
  request.context = {
    ...request.context,
    requestId: request.headers.get('x-vercel-id') || uuidV4(),
    clientIp: extractFromRequest(request),
  };
}

async function logRequest(request: NextRequest) {
  const { headers, body, context } = request;

  const log = {
    headers: clearHeaders(headers),
    body: await clearBody(body),
    context: clearContext(context),
  };

  logger.info(log);

  const p = Promise.resolve().then(() => logger.flush());
  // `waitUntil` + `vi.useFakeTimers()` nos testes de integração pode travar o handler.
  if (process.env.VITEST === 'true') {
    void p.catch(() => {});
    return;
  }
  waitUntil(p);
}

const headersToRedact = ['authorization', 'cookie'];
const headerToOmit = [
  'access-control-allow-headers',
  'forwarded',
  'x-vercel-proxy-signature',
  'x-vercel-sc-headers',
];

function clearHeaders(headers: any) {
  const cleanHeaders = Object.fromEntries(headers.entries());

  headersToRedact.forEach((header) => {
    if (cleanHeaders[header]) {
      cleanHeaders[header] = '**REDACTED**';
    }
  });

  headerToOmit.forEach((header) => {
    delete cleanHeaders[header];
  });

  return cleanHeaders;
}

const bodyToRedact = ['email', 'password'];

async function clearBody(requestBody: any) {
  let cleanBody = null;
  try {
    cleanBody = await requestBody.json();
  } catch {
    cleanBody = null;
  }

  if (cleanBody && typeof cleanBody.body === 'string') {
    cleanBody.body = cleanBody.body.substring(0, 300);
  }

  bodyToRedact.forEach((key) => {
    if (cleanBody && cleanBody[key]) {
      cleanBody[key] = '**REDACTED**';
    }
  });

  return cleanBody;
}

function clearContext(context: any) {
  const cleanContext = { ...context };

  if (cleanContext.user) {
    cleanContext.user = {
      id: context.user.id,
      username: context.user.username,
    };
  }

  return cleanContext;
}

function onErrorHandler(error: any, request: NextRequest) {
  if (
    error instanceof ValidationError ||
    error instanceof MethodNotAllowedError ||
    error instanceof NotFoundError ||
    error instanceof ForbiddenError ||
    error instanceof UnprocessableEntityError ||
    error instanceof TooManyRequestsError
  ) {
    const publicPayload = serializeErrorForClient(error, {
      requestId: request.context?.requestId,
    });
    const privateErrorObject = { ...publicPayload, context: { ...request.context } };
    logger.info(snakeize(privateErrorObject));

    return errorResponse(error.statusCode, snakeize(publicPayload));
  }

  if (error instanceof UnauthorizedError) {
    const publicPayload = serializeErrorForClient(error, {
      requestId: request.context?.requestId,
    });
    const privateErrorObject = { ...publicPayload, context: { ...request.context } };
    logger.info(snakeize(privateErrorObject));

    return errorResponse(error.statusCode, snakeize(publicPayload), true);
  }

  const publicErrorObject = new InternalServerError({
    requestId: request.context?.requestId,
    errorId: error.errorId,
    statusCode: error.statusCode,
    errorLocationCode: error.errorLocationCode,
  });

  const privateErrorObject = {
    ...new InternalServerError({
      ...error,
      requestId: request.context?.requestId,
    }),
    context: { ...request.context },
  };

  logger.error(snakeize(privateErrorObject));

  const publicPayload = serializeErrorForClient(publicErrorObject, {
    requestId: request.context?.requestId,
  });
  return errorResponse(publicErrorObject.statusCode, snakeize(publicPayload));
}

function onNoMatchHandler(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return Response.json({}, { status: 200 });
  }

  injectRequestMetadata(request);

  const methodError = new MethodNotAllowedError({
    message: `Método "${request.method}" não permitido para "${request.nextUrl.pathname}".`,
    action: 'Utilize um método HTTP válido para este recurso.',
    requestId: request.context?.requestId || uuidV4(),
  });

  const publicPayload = serializeErrorForClient(methodError);
  const privateErrorObject = { ...publicPayload, context: { ...request.context } };
  logger.info(snakeize(privateErrorObject));

  return errorResponse(methodError.statusCode, snakeize(publicPayload));
}

function errorResponse(
  statusCode: number,
  publicErrorObject: any,
  clearSessionIdCookie: boolean = false,
) {
  if (clearSessionIdCookie) {
    return Response.json(publicErrorObject, {
      status: statusCode,
      headers: {
        'cache-control': 'no-cache,no-store,max-age=0,must-revalidate',
        'set-cookie': cookie.serialize('better-auth.session_token', 'invalid', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          sameSite: 'lax',
          maxAge: -1,
        }),
      },
    });
  } else {
    return Response.json(publicErrorObject, {
      status: statusCode,
    });
  }
}

function generatePaginationHeaders(
  pagination: any,
  endpoint: string,
  request: NextRequest,
) {
  const links = [];
  const baseUrl = `${webserver.host}${endpoint}`;

  const searchParams = new URLSearchParams();
  const requestQuery = request.nextUrl.searchParams;

  // if (requestQuery.get('per_page') === null) {
  //   requestQuery.set('per_page', '30');
  // }

  const acceptedParams = ['strategy', 'with_root', 'with_children', 'page', 'per_page'];

  acceptedParams.forEach((param) => {
    if (param === 'strategy' && endpoint.startsWith('/api/v1/contents')) {
      searchParams.set(param, 'relevant');
    }

    if (requestQuery.get(param) !== null) {
      searchParams.set(param, requestQuery.get(param) as string);
    }
  });

  const pages = [
    { page: pagination.firstPage, per_page: pagination.perPage, rel: 'first' },
    { page: pagination.previousPage, per_page: pagination.perPage, rel: 'prev' },
    { page: pagination.nextPage, per_page: pagination.perPage, rel: 'next' },
    { page: pagination.lastPage, per_page: pagination.perPage, rel: 'last' },
  ];

  for (const { page, per_page, rel } of pages) {
    if (page) {
      searchParams.set('page', page);
      searchParams.set('per_page', per_page);
      links.push(`<${baseUrl}?${searchParams.toString()}>; rel="${rel}"`);
    }
  }

  const linkHeaderString = links.join(', ');

  return {
    Link: linkHeaderString,
    'X-Pagination-Total-Rows': pagination.totalRows,
  };
}

export default Object.freeze({
  errorResponse,
  generatePaginationHeaders,
  injectRequestMetadata,
  logRequest,
  onErrorHandler,
  onNoMatchHandler,
});
