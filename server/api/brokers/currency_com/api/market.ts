import { ProcessError } from 'shared/exceptions';
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
  WsSubscribeResponse
} from '../types';

import type { RestApi } from '../rest-api';
import { Endpoint, EndpointSubscription, MarketFilter, Subscription } from '../constants';
import { WsApi } from '../ws-api';
import { StatusCode } from 'global/constants';


export class MarketApi {
  constructor(
    private restApi: RestApi,
    private wsApi: WsApi,
  ) {}


  static async setup(botId: string, restApi: RestApi): Promise<MarketApi> {
    return new Promise((resolve, reject) => {
      new WsApi(botId, (wsApi: WsApi) => {
        resolve(new MarketApi(restApi, wsApi));
      });
    });
  }


  async loadMarketData(marketSymbol: string): Promise<Market> {
    const { symbols }: ExchangeInfo = await this.loadExchangeInfo();
    const foundSymbol: ExchangeSymbolInfo | undefined = symbols.find(({ symbol }) => symbol === marketSymbol);

    if (foundSymbol) {
      return await this.parseExchangeSymbol(foundSymbol);
    }

    throw new ProcessError(`Cannot found broker symbol '${marketSymbol}'`, StatusCode.BAD_REQUEST);
  }

  async loadMarketLeverage(marketSymbol: string): Promise<MarketLeverageResponse> {
    return this.restApi.get<MarketLeverageRequest, MarketLeverageResponse>(Endpoint.MARKET_LEVERAGE, {
      symbol: marketSymbol,
      timestamp: Date.now(),
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
    { symbol, quoteAsset, tickSize, filters, takerFee }: ExchangeSymbolInfo,
  ): Promise<Market> {
    const { value: leverage }: MarketLeverageResponse = await this.loadMarketLeverage(symbol);
    const { price, spread }: MarketPrice = await this.loadMarketPrice(symbol);

    const lotSize: ExchangeSymbolLotSizeFilter | undefined
      = filters.find(({ filterType }) => filterType === MarketFilter.LOT_SIZE);

    return {
      marketSymbol: symbol,
      currency: quoteAsset,
      minPositionSize: lotSize ? Number(lotSize.minQty) : 0,
      tickSize,
      leverage,
      price,
      spread,
      commission: takerFee,
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
