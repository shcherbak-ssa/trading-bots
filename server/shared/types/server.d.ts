import type { ErrorPayload, OnlyIdPayload } from 'global/types';
import type { NewBroker, Broker } from 'global/types';
import type { NewBot } from 'global/types';

import { RequestMethod, ServerEndpoint, StatusCode } from 'global/constants';
import { Validation } from 'shared/constants';


// @TODO: refactor
export type ServerRequestPayload<Payload = any> = any
  // Payload extends NewBot ? Payload :
  //
  // Payload extends NewBroker ? Payload :
  //
  // Payload extends OnlyIdPayload ? Payload :
  // any;


// @TODO: refactor
export type ServerResponsePayload = any
  // | BrokerClientInfo | BrokerClientInfo[]
  // | ErrorPayload
  // | {};


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
