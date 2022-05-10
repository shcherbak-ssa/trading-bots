import WebSocket from 'ws';

import { BotErrorPlace, BotEvents } from 'modules/bot';

import type { WsSubscribeResponse } from '../types';
import { EndpointSubscription, WS_API_URL, WS_PING_DELAY } from '../constants';


type OpenCallback = (api: WsApi) => void;


export class WsApi {
  private wsClient: WebSocket;
  private correlationId: number = 0;
  private interval: NodeJS.Timer;
  private readonly botToken: string;

  constructor(botToken: string, openCallback?: OpenCallback) {
    this.botToken = botToken;
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

  destroyWebSocket(): void {
    clearInterval(this.interval);
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

    this.wsClient.on('close', (code, reason) => {
      this.destroyWebSocket();

      const webSocketError: any = new Error(`Currency.com closed websocket [${code}]`);
      webSocketError.name = 'WebSocket Error';
      webSocketError.reason = reason.toJSON();
      webSocketError.code = code;

      BotEvents.processError(this.botToken, BotErrorPlace.MARKET_WS_CLOSE, webSocketError);
    });

    this.wsClient.on('error', (err) => {
      this.destroyWebSocket();

      const webSocketError: any = new Error('Something went wrong with Currency.com websocket');
      webSocketError.name = 'WebSocket Error';
      webSocketError.error = err;

      BotEvents.processError(this.botToken, BotErrorPlace.MARKET_WS_ERROR, webSocketError);
    });
  }

  private keepConnection(): void {
    this.interval = setInterval(() => this.wsClient.ping(), WS_PING_DELAY);
  }
}
