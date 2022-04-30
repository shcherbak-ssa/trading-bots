import express from 'express';
import bodyParser from 'body-parser';
import queryString from 'query-string';

import { QUERY_URL_SEPARATOR, RequestMethod, StatusCode } from 'global/constants';

import type { ServerRequestPayload, ServerResponsePayload } from 'shared/types';
import type { ServerResponseResult, ServerRouteHandler } from 'shared/types';
import { ENTRY_POINT_PATHNAME, API_PATHNAME, Validation, SIGNALS_PATHNAME } from 'shared/constants';
import { validate } from 'shared/validation';

import { apiRoutes, signalRoutes } from './routes';
import { serverConfig } from './server-config';


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


export async function runServer(): Promise<void> {
  const app: express.Application = express();
  app.disable('query parser');

  app.use(bodyParser.json());
  app.use(queryParserMiddleware);

  setupApiRouter(app);
  setupSignalsRouter(app);

  setupStaticServe(app);
  setupEntryPoint(app);

  app.use(responseMiddleware);

  app.listen(serverConfig.server.port, serverConfig.server.host);
}


// Setup
function setupApiRouter(app: express.Application): void {
  const apiRouter: express.Router = express.Router();

  for (const { endpoint, method, validation, handler } of apiRoutes) {
    const pathname: string = endpoint.replace(API_PATHNAME, '');

    // @ts-ignore
    apiRouter[method.toLowerCase()](
      pathname,
      apiRouteMiddleware(validation, handler),
    );
  }

  app.use(
    API_PATHNAME,
    authMiddleware(),
    loggerMiddleware,
    apiRouter,
  );
}

function setupSignalsRouter(app: express.Application): void {
  const signalsRouter: express.Router = express.Router();

  for (const { endpoint, method, validation, handler } of signalRoutes) {
    const pathname: string = endpoint.replace(SIGNALS_PATHNAME, '');

    // @ts-ignore
    signalsRouter[method.toLowerCase()](
      pathname,
      signalsRouteMiddleware(validation, handler),
    );
  }

  app.use(SIGNALS_PATHNAME, loggerMiddleware, signalsRouter);
}

function setupStaticServe(app: express.Application): void {
  app.use(express.static(serverConfig.staticDirname));
}

function setupEntryPoint(app: express.Application): void {
  app.use(ENTRY_POINT_PATHNAME, entryPointMiddleware);
}


// Middlewares
function queryParserMiddleware(request: express.Request, response: express.Response, next: express.NextFunction): void {
  const query: string = request.originalUrl.split(QUERY_URL_SEPARATOR)[1];

  // @ts-ignore
  request.query = queryString.parse(query, { parseBooleans: true, parseNumbers: true });

  next();
}

function authMiddleware() {
  if (process.env.NODE_ENV === 'development') {
    return (request: express.Request, response: express.Response, next: express.NextFunction) => {
      request.userId = process.env.DEV_USER_ID;

      next();
    }
  }

  return (request: express.Request, response: express.Response, next: express.NextFunction) => {
    // @TODO: implement
  }
}

function loggerMiddleware(request: express.Request, response: express.Response, next: express.NextFunction): void {
  const { method, baseUrl, url, params, query, body } = request;
  const data = { ...params, ...query, ...body };

  console.info(`\ninfo: [request] ${method} ${baseUrl + url} - ${JSON.stringify(data)}`);

  next();
}

function apiRouteMiddleware(validation: Validation, handler: ServerRouteHandler) {
  return async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
      const { userId, params, query, body } = request;
      const requestPayload: ServerRequestPayload = { ...params, ...query, ...body };

      validate(validation, requestPayload);

      const responsePayload: ServerResponsePayload = await handler(userId || '', requestPayload);

      response.result = {
        status: getResponseStatus(request),
        payload: responsePayload || {},
      };
    } catch (err: any) {
      console.error(err);

      response.result = {
        status: err.status || StatusCode.INTERNAL_SERVER_ERROR,
        payload: {
          ...( err.payload || { errors: [{ message: err.message }] } ),
        },
      };
    } finally {
      next();
    }
  }
}

function signalsRouteMiddleware(validation: Validation, handler: ServerRouteHandler) {
  return async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
      const { params, query, body } = request;
      const requestPayload: ServerRequestPayload = { ...params, ...query, ...body };

      validate(validation, requestPayload);

      await handler('', requestPayload);
    } catch (err: any) {
      console.error(err);

      // @TODO: process error
    } finally {
      response.result = { status: StatusCode.SUCCESS, payload: {}};

      next();
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

    let payloadString: string = JSON.stringify(result.payload);

    if (payloadString.length > 500) {
      payloadString = payloadString.slice(0, 500) + '...';
    }

    console.info(`info: [response] ${result.status} ${payloadString}`);

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
