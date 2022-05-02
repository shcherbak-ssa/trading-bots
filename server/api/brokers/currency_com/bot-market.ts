import type { BotBrokerMarket, BotSettings } from 'modules/bot/types';

import type { Market, MarketPrice } from './types';

import type { RestApi } from './lib/rest-api';
import { MarketApi } from './lib/market';


export class BotMarket implements BotBrokerMarket {
  symbol: string;
  minQuantity: number;
  tickSize: number;
  leverage: number;
  currentPrice: number;
  currentSpread: number;
  commission: number;

  private subscribeHandler: (() => void) | null = null;

  constructor(
    private market: Market,
    private api: MarketApi,
  ) {}


  static async setup({ token, brokerMarketSymbol }: BotSettings, restApi: RestApi): Promise<BotMarket> {
    const api: MarketApi = await MarketApi.setup(token, restApi);
    const market: Market = await api.loadMarketData(brokerMarketSymbol);

    const brokerMarket: BotMarket = new BotMarket(market, api);
    brokerMarket.symbol = market.marketSymbol;
    brokerMarket.minQuantity = market.minQuantity;
    brokerMarket.tickSize = market.tickSize;
    brokerMarket.leverage = market.leverage;
    brokerMarket.currentPrice = market.price;
    brokerMarket.currentSpread = market.spread;
    brokerMarket.commission = market.commission;

    api.subscribeToMarketPriceUpdates(
      brokerMarketSymbol,
      brokerMarket.updateMarketPrice.bind(brokerMarket),
    );

    return brokerMarket;
  }


  updateMarketPrice({ price, spread }: MarketPrice): void {
    this.currentPrice = price;
    this.currentSpread = spread;

    if (this.subscribeHandler) {
      this.subscribeHandler();
    }
  }


  // Implementations
  getCloseTime(): string {
    throw new Error('TODO: implement');
  }

  subscribeToPriceUpdates(callback: () => void): void {
    this.subscribeHandler = callback;
  }

  unsubscribeToPriceUpdates(): void {
    this.subscribeHandler = null;
  }
}
