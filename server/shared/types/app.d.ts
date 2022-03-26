import { RequestMethod, StatusCode } from 'global/constants';


export namespace App {
  type Router = {
    pathname: string;
    routes: App.Route[];
  }

  type Route = {
    method: RequestMethod;
    handler: App.RouteHandler;
  }

  type RouteHandler = (request: App.Request) => Promise<App.Response>;

  type Request = {
    params: object;
    query: object;
    body: object;
  }

  type Response = {
    status: StatusCode;
    filename?: string;
    json?: object;
  }
}
