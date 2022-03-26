import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

import type { App } from 'shared/types';
import { RequestMethod, RouterPathname, StatusCode } from 'global/constants';
import { ENTRY_POINT_PATHNAME } from 'shared/constants';

import { apiRoutes } from './routes';


declare global {
  namespace Express {
    interface Response {
      result?: App.Response;
    }
  }
}


const staticDirname: string = path.join(process.cwd(), 'build', 'client'); // @TODO: config
const entryPointFilename: string = path.join(staticDirname, 'index.html'); // @TODO: config

class Router {
  static createRouter({ pathname, routes }: App.Router): express.Router {
    const router: express.Router = express.Router();

    for (const { method, handler } of routes) {
      // @ts-ignore
      router[method.toLowerCase()](pathname, Router.routerHandler(handler));
    }

    return router;
  }

  private static routerHandler(handler: App.RouteHandler) {
    return async (request: express.Request, response: express.Response, next: express.NextFunction) => {
      try {
        const handlerRequest: App.Request = {
          params: request.params,
          query: request.query,
          body: request.body,
        };

        response.result = await handler(handlerRequest);
      } catch (err: any) {
        response.result = {
          status: err.status || StatusCode.INTERNAL_SERVER_ERROR,
          json: {
            message: err.message,
          },
        };
      } finally {
        next();
      }
    };
  }
}


export async function runServer(): Promise<express.Application> {
  const app: express.Application = express();
  app.use(bodyParser.json());

  setupStaticServe(app);
  setupApiRouter(app);
  setupEntryPoint(app);

  return app;
}


// Setup
function setupStaticServe(app: express.Application): void {
  app.use(express.static(staticDirname));
}

function setupApiRouter(app: express.Application): void {
  for (const routes of apiRoutes) {
    app.use(RouterPathname.API, Router.createRouter(routes), responseMiddleware);
  }
}

function setupEntryPoint(app: express.Application): void {
  app.use(ENTRY_POINT_PATHNAME, entryPointMiddleware, responseMiddleware);
}


// Middlewares
function entryPointMiddleware(request: express.Request, response: express.Response, next: express.NextFunction): void {
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

  if (result?.json) {
    response.status(result.status).json(result.json);
    return;
  }

  response.status(result?.status || StatusCode.INTERNAL_SERVER_ERROR).end();
}
