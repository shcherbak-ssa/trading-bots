import { MINUTES_BEFORE_MARKET_CLOSING } from 'shared/constants';

import type { BotBrokerMarket, BotCloseTime, BotSettings } from 'modules/bot/types';

import type { Market, MarketPrice } from './types';
import { daysMap, TRADING_HOURS_SEPARATOR } from './constants';

import type { RestApi } from './lib/rest-api';
import { MarketApi } from './lib/market';
import { BrokerApiError } from 'shared/exceptions';
import { BrokerName } from 'global/constants';


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

  /**
   *  Trading Hours string example:
   *
   *  Mon - 21:00, 21:05 -; Tue - 21:00, 21:05 -; Wed - 21:00, 21:05 -; Thu - 21:00, 21:05 -; Fri - 21:00, 22:01 -; Sat - 21:00, 21:05 -; Sun - 20:00, 21:05 -
   *  Mon 08:10 - 00:00; Tue 08:10 - 00:00; Wed 08:10 - 00:00; Thu 08:10 - 00:00; Fri 08:10 - 21:00
   *
   * */
  private parseTradingDay(tradingDay: string, nextDay: number): BotCloseTime {
    if (!tradingDay) {
      throw new BrokerApiError(`Received empty trading day string`, BrokerName.CURRENCY_COM);
    }

    const parsedTradingDay: string[] = tradingDay.trim().split(' ') || [];

    const dayNumber: number
      = daysMap.findIndex((value) => value === parsedTradingDay[0]);

    const timeString: string
      = parsedTradingDay.find((value, index, self) => self[index - 1] === '-') || '';

    const parsedTime: string[] = timeString.replace(',', '').split(':');
    const hours = Number(parsedTime[0]);
    const minutes = Number(parsedTime[1]) - MINUTES_BEFORE_MARKET_CLOSING;

    return {
      day: dayNumber,
      hour: minutes < 0 ? hours === 0 ? 23 : hours - 1 : hours,
      minutes: minutes < 0 ? 60 + minutes : minutes,
      nextDay,
    }
  }


  // Implementations
  async getCloseTime(day: number | 'last'): Promise<BotCloseTime> {
    const market: Market = await this.api.loadMarketData(this.symbol);
    const [, ...parsedTradingHours]: string[] = market.tradingHours.split(TRADING_HOURS_SEPARATOR);

    if (day === 'last') {
      return this.parseTradingDay(parsedTradingHours.pop() || '', 0);
    }

    const tradingDayString: string = daysMap[day];

    const tradingDay: string
      = parsedTradingHours.find((value) => value.trim().startsWith(tradingDayString)) || '';

    const tradingDayIndex: number
      = parsedTradingHours.findIndex((value) => value.trim().startsWith(tradingDayString));

    const nextTradingDay: string = parsedTradingHours[tradingDayIndex + 1] || parsedTradingHours[0];

    const nextDay: number = daysMap.findIndex((value) => {
      return nextTradingDay.trim().startsWith(value);
    });

    return this.parseTradingDay(tradingDay, nextDay);
  }

  subscribeToPriceUpdates(callback: () => void): void {
    this.subscribeHandler = callback;
  }

  unsubscribeToPriceUpdates(): void {
    this.subscribeHandler = null;
  }
}
