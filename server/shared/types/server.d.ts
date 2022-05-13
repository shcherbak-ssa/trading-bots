import { RequestMethod, ServerEndpoint, StatusCode } from 'global/constants';
import { Validation } from 'shared/constants';


export type ServerAuthPayload = {
  userId: string;
}

// @TODO: refactor architecture
export type ServerRequestPayload<Payload = any> = any;
export type ServerResponsePayload = any;


export type ServerRoute = {
  endpoint: ServerEndpoint;
  method: RequestMethod;
  validation: Validation;
  handler: ServerRouteHandler;
}

export type ServerRouteHandler = (userId: string, payload: ServerRequestPayload) => Promise<ServerResponsePayload>;

export type ServerResponseResult = {
  status: StatusCode;
  filename?: string;
  payload?: ServerResponsePayload;
}
