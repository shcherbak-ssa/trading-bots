import { BrokerName } from 'global/constants';

import { BrokerApiError } from 'shared/exceptions';
import { getFractionDigits, roundNumber } from 'shared/utils';

import type {
  ExchangeInfo,
  ExchangeSymbolInfo,
  ExchangeSymbolLotSizeFilter,
  Market,
  MarketLeverageRequest,
  MarketLeverageResponse,
  MarketPrice,
  MarketPriceRequest,
  MarketPriceResponse,
  MarketPriceSubscribePayload,
  MarketPriceSubscribeResponsePayload,
  WsSubscribeResponse,
} from '../types';

import { Endpoint, EndpointSubscription, MarketFilter, Subscription } from '../constants';

import type { RestApi } from './rest-api';
import { WsApi } from './ws-api';


export class MarketApi {
  private readonly restApi: RestApi;
  private readonly wsApi: WsApi | undefined;


  constructor(restApi: RestApi, wsApi?: WsApi) {
    this.restApi = restApi;

    if (wsApi) {
      this.wsApi = wsApi;
    }
  }


  static async setup(botToken: string, restApi: RestApi): Promise<MarketApi> {
    return new Promise((resolve, reject) => {
      new WsApi(botToken, (wsApi: WsApi) => {
        resolve(new MarketApi(restApi, wsApi));
      });
    });
  }


  async loadMarkets(): Promise<ExchangeSymbolInfo[]> {
    const { symbols }: ExchangeInfo = await this.loadExchangeInfo();

    return symbols;
  }

  async loadMarketData(marketSymbol: string): Promise<Market> {
    const { symbols }: ExchangeInfo = await this.loadExchangeInfo();
    const foundSymbol: ExchangeSymbolInfo | undefined = symbols.find(({ symbol }) => symbol === marketSymbol);

    if (foundSymbol) {
      return await this.parseExchangeSymbol(foundSymbol);
    }

    throw new BrokerApiError(`Cannot found broker symbol '${marketSymbol}'`, BrokerName.CURRENCY_COM);
  }

  async loadMarketLeverage(marketSymbol: string): Promise<MarketLeverageResponse> {
    return this.restApi.get<MarketLeverageRequest, MarketLeverageResponse>(Endpoint.MARKET_LEVERAGE, {
      symbol: marketSymbol,
    });
  }

  async loadMarketPrice(marketSymbol: string): Promise<MarketPrice> {
    const marketPrice = await this.restApi.get<MarketPriceRequest, MarketPriceResponse>(Endpoint.MARKET_PRICE, {
      symbol: marketSymbol,
    });

    const { askPrice, bidPrice } = marketPrice;

    return MarketApi.getMarketPrice(askPrice, bidPrice);
  }

  subscribeToMarketPriceUpdates(marketSymbol: string, callback: (marketPrice: MarketPrice) => void): void {
    if (!this.wsApi) {
      throw new BrokerApiError(`No connection by web-socket`, BrokerName.CURRENCY_COM);
    }

    this.wsApi.subscribe<MarketPriceSubscribePayload, MarketPriceSubscribeResponsePayload>(
      EndpointSubscription.MARKET_PRICE,
      { symbols: [marketSymbol] },
      (message: WsSubscribeResponse<MarketPriceSubscribeResponsePayload>) => {
        if (message.destination !== Subscription.MARKET_PRICE) return;

        const { ofr: askPrice, bid: bidPrice } = message.payload;
        const marketPrice: MarketPrice = MarketApi.getMarketPrice(askPrice, bidPrice);

        callback(marketPrice);
      },
    );
  }


  private async loadExchangeInfo(): Promise<ExchangeInfo> {
    return await this.restApi.get(Endpoint.EXCHANGE_INFO, {});
  }

  private async parseExchangeSymbol(
    { symbol, quoteAsset, tickSize, filters, takerFee, tradingHours }: ExchangeSymbolInfo,
  ): Promise<Market> {
    const { value: leverage }: MarketLeverageResponse = await this.loadMarketLeverage(symbol);
    const { price, spread }: MarketPrice = await this.loadMarketPrice(symbol);

    const lotSize: ExchangeSymbolLotSizeFilter | undefined
      = filters.find(({ filterType }) => filterType === MarketFilter.LOT_SIZE);

    return {
      marketSymbol: symbol,
      currency: quoteAsset,
      minQuantity: lotSize ? Number(lotSize.minQty) : 0,
      tickSize,
      leverage,
      price,
      spread,
      commission: takerFee || 0,
      tradingHours,
    };
  }

  private static getMarketPrice(askPrice: string | number, bidPrice: string | number): MarketPrice {
    const fractionDigits: number = getFractionDigits(askPrice);

    return {
      price: Number(bidPrice),
      spread: roundNumber(Number(askPrice) - Number(bidPrice), fractionDigits),
    };
  }
}
