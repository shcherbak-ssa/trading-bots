import type { BotsCreatePayload, BotsReadPayload, BotsUpdatePayload, BotsDeletePayload } from 'global/types';
import type { BotsCreateResult, BotsReadResult } from 'global/types';
import type { NewBroker, BrokerClientInfo } from 'global/types';
import type { ErrorPayload, OnlyIdPayload } from 'global/types';

import { RequestMethod, ServerEndpoint, StatusCode } from 'global/constants';
import { Validation } from 'shared/constants';


export type ServerRequestPayload<Payload = any> =
  Payload extends BotsCreatePayload ? Payload :
  Payload extends BotsReadPayload ? Payload :
  Payload extends BotsUpdatePayload ? Payload :
  Payload extends BotsDeletePayload ? Payload :
  Payload extends NewBroker ? Payload :
  Payload extends OnlyIdPayload ? Payload :
  any;


export type ServerResponsePayload =
  | BotsCreateResult
  | BotsReadResult
  | BrokerClientInfo | BrokerClientInfo[]
  | ErrorPayload
  | void;


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
