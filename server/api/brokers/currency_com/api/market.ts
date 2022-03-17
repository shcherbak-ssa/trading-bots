import type {
  ExchangeInfo,
  ExchangeSymbolInfo,
  ExchangeSymbolLotSizeFilter,
  Market,
  MarketLeverageRequest,
  MarketLeverageResponse,
  MarketPrice, MarketPriceRequest,
  MarketPriceResponse
} from '../types';

import { Endpoint, MarketFilter } from '../constants';
import type { RestApi } from '../rest-api';
import { getFractionDigits, roundNumber } from 'shared/utils';


export class MarketApi {
  constructor(
    private restApi: RestApi,
  ) {}

  async loadMarketData(marketSymbol: string): Promise<Market> {
    const { symbols }: ExchangeInfo = await this.loadExchangeInfo();
    const foundSymbol: ExchangeSymbolInfo | undefined = symbols.find(({ symbol }) => symbol === marketSymbol);

    if (foundSymbol) {
      return await this.parseExchangeSymbol(foundSymbol);
    }

    throw new Error(''); // @TODO: implement
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
    const fractionDigits: number = getFractionDigits(askPrice);

    return {
      price: Number(bidPrice),
      spread: roundNumber(Number(askPrice) - Number(bidPrice), fractionDigits),
    };
  }


  private async loadExchangeInfo(): Promise<ExchangeInfo> {
    return await this.restApi.get(Endpoint.EXCHANGE_INFO, {});
  }

  private async parseExchangeSymbol(
    { symbol, quoteAsset, tickSize, filters }: ExchangeSymbolInfo,
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
    };
  }
}
