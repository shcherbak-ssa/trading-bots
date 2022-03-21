import WebSocket from 'ws';

import type { WsSubscribeResponse } from './types';
import { EndpointSubscription, WS_PING_MILLISECONDS, WS_API_URL } from './constants';


type OpenCallback = (api: WsApi) => void;


export class WsApi {
  private wsClient: WebSocket;
  private correlationId: number = 0;

  constructor(openCallback?: OpenCallback) {
    this.setupWebSocket(openCallback);
  }


  subscribe<SubscribePayload, SubscribeResponsePayload>(
    destination: EndpointSubscription,
    payload: SubscribePayload,
    subscriptionHandler: (message: WsSubscribeResponse<SubscribeResponsePayload>) => void,
  ): void {
    const message: string = JSON.stringify({
      destination,
      payload,
      correlationId: this.correlationId += 1,
    });

    this.wsClient.send(message);

    this.wsClient.on('message', async (data)=> {
      const message: WsSubscribeResponse<SubscribeResponsePayload> = JSON.parse(data.toString());

      subscriptionHandler(message);
    });
  }


  private setupWebSocket(openCallback?: OpenCallback): void {
    this.wsClient = new WebSocket(WS_API_URL, {
      perMessageDeflate: true,
    });

    this.wsClient.onopen = () => {
      this.keepConnection();

      if (openCallback) {
        openCallback(this);
      }
    };

    this.wsClient.onclose = () => {
      // @TODO: implement close processing
      console.log('ws closed');
    };

    this.wsClient.onerror = (err) => {
      // @TODO: implement error processing
      console.log('ws error', err);
    };
  }

  private keepConnection(): void {
    setInterval(() => this.wsClient.ping(), WS_PING_MILLISECONDS);
  }
}
