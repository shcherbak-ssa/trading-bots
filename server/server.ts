import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import queryString from 'query-string';

import { QUERY_URL_SEPARATOR, RequestMethod, StatusCode } from 'global/constants';

import type { ServerRequestPayload, ServerResponsePayload } from 'shared/types';
import type { ServerResponseResult, ServerRouteHandler } from 'shared/types';
import { ENTRY_POINT_PATHNAME, API_PATHNAME, Validation } from 'shared/constants';
import { validate } from 'shared/validation';

import { routes } from './routes';


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


const staticDirname: string = path.join(process.cwd(), 'build', 'client'); // @TODO: config
const entryPointFilename: string = path.join(staticDirname, 'index.html'); // @TODO: config


export async function runServer(): Promise<void> {
  const app: express.Application = express();
  app.disable('query parser');

  app.use(bodyParser.json());
  app.use(queryParserMiddleware);

  setupApiRouter(app);

  setupStaticServe(app);
  setupEntryPoint(app);

  app.use(responseMiddleware);

  app.listen(3333, 'localhost'); // @TODO: config
}


// Setup
function setupApiRouter(app: express.Application): void {
  const apiRouter: express.Router = express.Router();

  for (const { endpoint, method, validation, handler } of routes) {
    const pathname: string = endpoint.replace(API_PATHNAME, '');

    // @ts-ignore
    apiRouter[method.toLowerCase()](
      pathname,
      routeMiddleware(validation, handler),
    );
  }

  app.use(
    API_PATHNAME,
    authMiddleware(),
    loggerMiddleware,
    apiRouter,
  );
}

function setupStaticServe(app: express.Application): void {
  app.use(express.static(staticDirname));
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
  const { userId, method, baseUrl, url, params, query, body } = request;
  const data = { ...params, ...query, ...body };

  console.info(`\ninfo: [request] ${method} ${baseUrl + url} - ${JSON.stringify(data)}`);

  next();
}

function routeMiddleware(validation: Validation, handler: ServerRouteHandler) {
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
      console.log(err);
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

function entryPointMiddleware(request: express.Request, response: express.Response, next: express.NextFunction): void {
  if (response.result) {
    return next();
  }

  if (request.method === RequestMethod.GET) {
    response.result = {
      status: StatusCode.SUCCESS,
      filename: entryPointFilename,
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
      return StatusCode.UPDATED;
    case RequestMethod.DELETE:
      return StatusCode.DELETED;
    default:
      return StatusCode.SUCCESS;
  }
}
