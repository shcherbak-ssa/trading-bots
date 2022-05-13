import type { Server } from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import queryString from 'query-string';

import type { User } from 'global/types';
import { GetUserType, QUERY_URL_SEPARATOR, RequestMethod, StatusCode } from 'global/constants';

import type {
  GetUserFilters,
  Notification,
  ServerAuthPayload,
  ServerRequestPayload,
  ServerResponsePayload,
  ServerResponseResult,
  ServerRouteHandler,
  Signal,
  TelegramIncomeMessage,
} from 'shared/types';

import {
  ActionType,
  API_PATHNAME, AUTH_PATHNAME,
  ENTRY_POINT_PATHNAME,
  LogScope,
  NotificationType,
  Validation,
  WEBHOOKS_PATHNAME
} from 'shared/constants';

import { logger } from 'shared/logger';
import { isCustomError, parseBotToken, parseToken } from 'shared/utils';

import { validate } from 'services/validation';
import { runAction } from 'services/actions';

import { apiRoutes, authRoutes, webhooksRoutes } from './routes';
import { serverConfig } from './config';


declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }

    interface Response {
      result?: ServerResponseResult;
    }
  }
}


export async function runServer(): Promise<Server> {
  const app: express.Application = express();
  app.disable('query parser');

  app.use(bodyParser.json());
  app.use(queryParserMiddleware);

  setupApiRouter(app);
  setupAuthRouter(app);
  setupWebhookRouter(app);
  setupStaticServe(app);
  setupEntryPoint(app);

  return app.listen(serverConfig.server.port, serverConfig.server.host);
}


// Setup
function setupApiRouter(app: express.Application): void {
  const apiRouter: express.Router = express.Router();

  for (const { endpoint, method, validation, handler } of apiRoutes) {
    const pathname: string = endpoint.replace(API_PATHNAME, '');

    // @ts-ignore
    apiRouter[method.toLowerCase()](pathname, apiRouteMiddleware(validation, handler));
  }

  app.use(
    API_PATHNAME,
    loggerMiddleware,
    authMiddleware,
    apiRouter,
    responseMiddleware,
  );
}

function setupAuthRouter(app: express.Application): void {
  const authRouter: express.Router = express.Router();

  for (const { endpoint, method, validation, handler } of authRoutes) {
    const pathname: string = endpoint.replace(AUTH_PATHNAME, '');

    // @ts-ignore
    authRouter[method.toLowerCase()](pathname, authRouteMiddleware(validation, handler));
  }

  app.use(
    AUTH_PATHNAME,
    loggerMiddleware,
    authRouter,
    responseMiddleware,
  );
}

function setupWebhookRouter(app: express.Application): void {
  const webhookRouter: express.Router = express.Router();

  for (const { endpoint, method, handler } of webhooksRoutes) {
    const pathname: string = endpoint.replace(WEBHOOKS_PATHNAME, '');

    // @ts-ignore
    webhookRouter[method.toLowerCase()](pathname, webhookRouteMiddleware(handler));
  }

  app.use(
    WEBHOOKS_PATHNAME,
    loggerMiddleware,
    webhookRouter,
  );
}

function setupStaticServe(app: express.Application): void {
  app.use(express.static(serverConfig.staticDirname));
}

function setupEntryPoint(app: express.Application): void {
  app.use(
    ENTRY_POINT_PATHNAME,
    entryPointMiddleware,
    responseMiddleware,
  );
}


// Middlewares
function queryParserMiddleware(request: express.Request, response: express.Response, next: express.NextFunction): void {
  const query: string = request.originalUrl.split(QUERY_URL_SEPARATOR)[1];

  // @ts-ignore
  request.query = queryString.parse(query, { parseBooleans: true, parseNumbers: true });

  next();
}

function loggerMiddleware(request: express.Request, response: express.Response, next: express.NextFunction): void {
  const { method, baseUrl, url, params, query, body } = request;
  const data = { ...params, ...query, ...body };

  logger.logInfo(LogScope.APP, {
    message: `${method} ${baseUrl + url}`,
    messageHeading: `Request`,
    payload: data,
  });

  next();
}

function authMiddleware(request: express.Request, response: express.Response, next: express.NextFunction): void {
  try {
    if (!request.headers.authorization) {
      response.result = {
        status: StatusCode.FORBIDDEN,
        payload: {
          heading: 'Auth error',
          message: 'Authorization fell',
        },
      };

      return next();
    }

    const authToken: string = request.headers.authorization.split(' ')[1];
    const authPayload: ServerAuthPayload = parseToken(authToken);

    request.userId = authPayload.userId;
  } catch (e: any) {
    logError(e);

    response.result = {
      status: StatusCode.FORBIDDEN,
      payload: {
        heading: 'Auth error',
        message: 'Authorization fell',
      },
    };
  } finally {
    next();
  }
}

function apiRouteMiddleware(validation: Validation, handler: ServerRouteHandler) {
  return async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    if (response.result) {
      return next();
    }

    const { userId = '', params, query, body } = request;
    const requestPayload: ServerRequestPayload = { ...params, ...query, ...body };

    try {
      validate(validation, requestPayload);

      const responsePayload: ServerResponsePayload = await handler(userId, requestPayload);

      response.result = {
        status: getResponseStatus(request),
        payload: responsePayload || {},
      };
    } catch (e: any) {
      logError(e);

      // @TODO: refactor architecture
      await sendNotifications(userId, e);

      response.result = {
        status: e.status || StatusCode.INTERNAL_SERVER_ERROR,
        payload: {
          heading: e.errorHeading || '',
          message: e.message,
        },
      };
    } finally {
      next();
    }
  }
}

function authRouteMiddleware(validation: Validation, handler: ServerRouteHandler) {
  return async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const { params, query, body } = request;
    const requestPayload: ServerRequestPayload = { ...params, ...query, ...body };

    try {
      validate(validation, requestPayload);

      const responsePayload: ServerResponsePayload = await handler('', requestPayload);

      response.result = {
        status: StatusCode.SUCCESS,
        payload: responsePayload || {},
      };
    } catch (e: any) {
      logError(e);

      response.result = {
        status: e.status || StatusCode.INTERNAL_SERVER_ERROR,
        payload: {
          heading: e.errorHeading || '',
          message: e.message,
        },
      };
    } finally {
      next();
    }
  }
}

function webhookRouteMiddleware(handler: ServerRouteHandler) {
  return async (request: express.Request, response: express.Response) => {
    response.status(StatusCode.SUCCESS).json({});

    const { params, query, body } = request;
    const requestPayload: ServerRequestPayload = { ...params, ...query, ...body };

    try {
      await handler('', requestPayload);
    } catch (e: any) {
      logError(e);

      let userId: string = '';

      if (requestPayload.botToken) {
        const { botToken } = requestPayload as Signal;

        userId = parseBotToken(botToken)[0];
      } else if (requestPayload.telegramToken) {
        const { message: { chat } } = requestPayload as TelegramIncomeMessage;

        const [ foundUser ] = await runAction<GetUserFilters, User[]>({
          type: ActionType.USERS_GET,
          userId: '',
          payload: { type: GetUserType.ONE, telegramChatId: chat.id },
        });

        userId = foundUser.id;
      }

      await sendNotifications(userId, e);
    }
  }
}

function entryPointMiddleware(request: express.Request, response: express.Response, next: express.NextFunction): void {
  if (response.result) {
    return next();
  }

  if (request.method === RequestMethod.GET) {
    response.result = {
      status: StatusCode.SUCCESS,
      filename: serverConfig.entryPointFilename,
    };
  } else {
    response.result = {
      status: StatusCode.METHOD_NOT_ALLOWED,
    };
  }

  next();
}

function responseMiddleware(request: express.Request, response: express.Response): void {
  const { result } = response;

  if (result?.filename) {
    response.status(result.status).sendFile(result.filename);
    return;
  }

  if (result?.payload) {
    response.status(result.status).json(result.payload);

    logger.logInfo(LogScope.APP, {
      message: `${result.status}`,
      messageHeading: 'Response',
      idLabel: 'user',
      id: request.userId,
      payload: result.payload
    });

    return;
  }

  response.status(result?.status || StatusCode.INTERNAL_SERVER_ERROR).end();
}


// Helpers
function getResponseStatus(request: express.Request): StatusCode {
  switch (request.method.toUpperCase()) {
    case RequestMethod.GET:
      return StatusCode.SUCCESS;
    case RequestMethod.POST:
      return StatusCode.CREATED;
    case RequestMethod.PUT:
    case RequestMethod.DELETE:
      return StatusCode.NO_CONTENT;
    default:
      return StatusCode.SUCCESS;
  }
}

function logError(e: any): void {
  if (isCustomError(e.name)) {
    logger.logError(e.scope, e.logPayload);
  } else {
    console.log(e);
  }
}

async function sendNotifications(userId: string, e: any): Promise<void> {
  if (!e.notified) {
    await runAction<Notification, void>({
      type: ActionType.NOTIFICATIONS_NOTIFY_USER,
      userId,
      payload: {
        type: NotificationType.ERROR,
        forAdmin: false,
        error: e,
      },
    });
  }

  if (userId || e.notified) {
    await runAction<Notification, void>({
      type: ActionType.NOTIFICATIONS_NOTIFY_ADMIN,
      userId: '',
      payload: {
        type: NotificationType.ERROR,
        forAdmin: true,
        error: e,
      },
    });
  }
}
