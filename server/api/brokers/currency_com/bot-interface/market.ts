import type { BotBrokerMarket, BotSettings } from 'modules/bot/types';

import type { Market, MarketPrice } from '../types';
import type { RestApi } from '../rest-api';
import { MarketApi } from '../api/market';


export class BrokerMarket implements BotBrokerMarket {
  symbol: string;
  minPositionSize: number;
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


  static async setup({ id: botId, brokerMarketSymbol }: BotSettings, restApi: RestApi): Promise<BrokerMarket> {
    const api: MarketApi = await MarketApi.setup(botId, restApi);
    const market: Market = await api.loadMarketData(brokerMarketSymbol);

    const brokerMarket: BrokerMarket = new BrokerMarket(market, api);
    brokerMarket.symbol = market.marketSymbol;
    brokerMarket.minPositionSize = market.minPositionSize;
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
  isCorrectSymbol(marketSymbol: string): boolean {
    return marketSymbol === this.market.marketSymbol;
  }

  getCloseTime(): string {
    throw new Error('TODO: implement');
  }

  subscribeToPriceUpdates(callback: () => void): void {
    this.subscribeHandler = callback;
  }

  unsubscribeToPriceUpdates() {
    this.subscribeHandler = null;
  }
}
