import WebSocket from 'ws';
import { AliveBotErrorPlace, BotEvents } from 'modules/bot';

import type { WsSubscribeResponse } from './types';
import { EndpointSubscription, WS_API_URL, WS_PING_DELAY } from './constants';


type OpenCallback = (api: WsApi) => void;


export class WsApi {
  private wsClient: WebSocket;
  private correlationId: number = 0;
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

    this.wsClient.onclose = (event) => {
      BotEvents.processAliveError(this.botToken, AliveBotErrorPlace.MARKET_WS_CLOSE, event.reason);
    };

    this.wsClient.onerror = (err) => {
      BotEvents.processAliveError(this.botToken, AliveBotErrorPlace.MARKET_WS_ERROR, err.message);
    };
  }

  private keepConnection(): void {
    setInterval(() => this.wsClient.ping(), WS_PING_DELAY);
  }
}
