export type WsSubscribeResponse<Payload> = {
  status: string;
  destination: string;
  correlationId: string;
  payload: Payload;
}
