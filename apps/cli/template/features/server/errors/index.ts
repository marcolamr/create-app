export type ErrorContext = Record<string, unknown>;

export interface BaseErrorInit {
  name: string;
  message: string;
  stack?: string;
  cause?: unknown;
  action?: string;
  statusCode?: number;
  errorId?: string;
  requestId?: string;
  context?: ErrorContext;
  errorLocationCode?: string;
  key?: string;
  type?: string;
  databaseErrorCode?: string;
}

type MessageAction = {
  message?: string;
  action?: string;
};

type TraceFields = {
  requestId?: string;
  errorId?: string;
  stack?: string;
  errorLocationCode?: string;
};

export class BaseError extends Error {
  action?: string;
  statusCode: number;
  errorId: string;
  requestId?: string;
  context?: ErrorContext;
  errorLocationCode?: string;
  key?: string;
  type?: string;
  databaseErrorCode?: string;

  constructor(init: BaseErrorInit) {
    super(init.message, init.cause !== undefined ? { cause: init.cause } : undefined);
    this.name = init.name;
    this.action = init.action;
    this.statusCode = init.statusCode ?? 500;
    this.errorId = init.errorId ?? crypto.randomUUID();
    this.requestId = init.requestId;
    this.context = init.context;
    if (init.stack !== undefined) {
      this.stack = init.stack;
    }
    this.errorLocationCode = init.errorLocationCode;
    this.key = init.key;
    this.type = init.type;
    this.databaseErrorCode = init.databaseErrorCode;
  }
}

export type InternalServerErrorOptions = MessageAction &
  TraceFields & { statusCode?: number };

export class InternalServerError extends BaseError {
  constructor(options: InternalServerErrorOptions = {}) {
    const { message, action, requestId, errorId, statusCode, stack, errorLocationCode } =
      options;
    super({
      name: 'InternalServerError',
      message: message || 'Um erro interno não esperado aconteceu.',
      action: action || "Informe ao suporte o valor encontrado no campo 'error_id'.",
      statusCode: statusCode ?? 500,
      requestId,
      errorId,
      stack,
      errorLocationCode,
    });
  }
}

export type NotFoundErrorOptions = MessageAction & TraceFields & { key?: string };

export class NotFoundError extends BaseError {
  constructor(options: NotFoundErrorOptions = {}) {
    const { message, action, requestId, errorId, stack, errorLocationCode, key } =
      options;
    super({
      name: 'NotFoundError',
      message: message || 'Não foi possível encontrar este recurso no sistema.',
      action: action || 'Verifique se o caminho (PATH) está correto.',
      statusCode: 404,
      requestId,
      errorId,
      stack,
      errorLocationCode,
      key,
    });
  }
}

export type ServiceErrorOptions = MessageAction & {
  stack?: string;
  context?: ErrorContext;
  statusCode?: number;
  errorLocationCode?: string;
  databaseErrorCode?: string;
  cause?: unknown;
};

export class ServiceError extends BaseError {
  constructor(options: ServiceErrorOptions = {}) {
    const {
      message,
      action,
      stack,
      context,
      statusCode,
      errorLocationCode,
      databaseErrorCode,
      cause,
    } = options;
    super({
      name: 'ServiceError',
      message: message || 'Serviço indisponível no momento.',
      action: action || 'Verifique se o serviço está disponível.',
      stack,
      cause,
      statusCode: statusCode ?? 503,
      context,
      errorLocationCode,
      databaseErrorCode,
    });
  }
}

export type ValidationErrorOptions = MessageAction & {
  stack?: string;
  statusCode?: number;
  context?: ErrorContext;
  errorLocationCode?: string;
  key?: string;
  type?: string;
};

export class ValidationError extends BaseError {
  constructor(options: ValidationErrorOptions = {}) {
    const { message, action, stack, statusCode, context, errorLocationCode, key, type } =
      options;
    super({
      name: 'ValidationError',
      message: message || 'Um erro de validação ocorreu.',
      action: action || 'Ajuste os dados enviados e tente novamente.',
      statusCode: statusCode ?? 400,
      stack,
      context,
      errorLocationCode,
      key,
      type,
    });
  }
}

export type UnauthorizedErrorOptions = MessageAction & Omit<TraceFields, 'errorId'>;

export class UnauthorizedError extends BaseError {
  constructor(options: UnauthorizedErrorOptions = {}) {
    const { message, action, requestId, stack, errorLocationCode } = options;
    super({
      name: 'UnauthorizedError',
      message: message || 'Usuário não autenticado.',
      action:
        action ||
        'Verifique se você está autenticado com uma sessão ativa e tente novamente.',
      requestId,
      statusCode: 401,
      stack,
      errorLocationCode,
    });
  }
}

export type ForbiddenErrorOptions = MessageAction & Omit<TraceFields, 'errorId'>;

export class ForbiddenError extends BaseError {
  constructor(options: ForbiddenErrorOptions = {}) {
    const { message, action, requestId, stack, errorLocationCode } = options;
    super({
      name: 'ForbiddenError',
      message: message || 'Você não possui permissão para executar esta ação.',
      action: action || 'Verifique se você possui permissão para executar esta ação.',
      requestId,
      statusCode: 403,
      stack,
      errorLocationCode,
    });
  }
}

export type TooManyRequestsErrorOptions = MessageAction & {
  context?: ErrorContext;
  stack?: string;
  errorLocationCode?: string;
};

export class TooManyRequestsError extends BaseError {
  constructor(options: TooManyRequestsErrorOptions = {}) {
    const { message, action, context, stack, errorLocationCode } = options;
    super({
      name: 'TooManyRequestsError',
      message: message || 'Você realizou muitas requisições recentemente.',
      action:
        action ||
        'Tente novamente mais tarde ou contate o suporte caso acredite que isso seja um erro.',
      statusCode: 429,
      context,
      stack,
      errorLocationCode,
    });
  }
}

export type UnprocessableEntityErrorOptions = MessageAction & {
  stack?: string;
  errorLocationCode?: string;
};

export class UnprocessableEntityError extends BaseError {
  constructor(options: UnprocessableEntityErrorOptions = {}) {
    const { message, action, stack, errorLocationCode } = options;
    super({
      name: 'UnprocessableEntityError',
      message: message || 'Não foi possível realizar esta operação.',
      action:
        action ||
        'Os dados enviados estão corretos, porém não foi possível realizar esta operação.',
      statusCode: 422,
      stack,
      errorLocationCode,
    });
  }
}

export type MethodNotAllowedErrorOptions = MessageAction & TraceFields;

export class MethodNotAllowedError extends BaseError {
  constructor(options: MethodNotAllowedErrorOptions = {}) {
    const { message, action, requestId, errorId, stack, errorLocationCode } = options;
    super({
      name: 'MethodNotAllowedError',
      message: message || 'Método não permitido para este recurso.',
      action:
        action || 'Verifique se o método HTTP utilizado é válido para este recurso.',
      statusCode: 405,
      requestId,
      errorId,
      stack,
      errorLocationCode,
    });
  }
}

/**
 * Objeto plano para JSON público. `{ ...error }` em subclasses de `Error` costuma omitir
 * `message`/`name` (não enumeráveis), quebrando `snakeize` + `NextResponse.json`.
 */
export function serializeErrorForClient(
  error: BaseError,
  overrides: { requestId?: string } = {},
): Record<string, unknown> {
  const requestId = overrides.requestId ?? error.requestId;
  const payload: Record<string, unknown> = {
    name: error.name,
    message: error.message,
    statusCode: error.statusCode,
    errorId: error.errorId,
  };
  if (error.action !== undefined) {
    payload.action = error.action;
  }
  if (error.errorLocationCode !== undefined) {
    payload.errorLocationCode = error.errorLocationCode;
  }
  if (requestId !== undefined) {
    payload.requestId = requestId;
  }
  if (error.key !== undefined) {
    payload.key = error.key;
  }
  if (error.type !== undefined) {
    payload.type = error.type;
  }
  if (error.databaseErrorCode !== undefined) {
    payload.databaseErrorCode = error.databaseErrorCode;
  }
  return payload;
}
