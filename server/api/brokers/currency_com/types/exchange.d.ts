import {
  ExchangeMarketAssetType,
  ExchangeMarketMode,
  ExchangeMarketStatus,
  ExchangeMarketType,
  OrderType
} from '../constants';


export type ExchangeInfo = {
  exchangeFilters: {}[];
  rateLimits: ExchangeRateLimit[];
  symbols: ExchangeSymbolInfo[];
  serverTime: number;
  timezone: string;
}

export type ExchangeRateLimit = {
  interval: string;
  intervalNum: number;
  limit: number;
  rateLimitType:	string;
}

export type ExchangeSymbolLotSizeFilter = {
  filterType: string,
  minQty: string,
  maxQty: string,
  stepSize: string,
}

export type ExchangeSymbolFilter = ExchangeSymbolLotSizeFilter;

export type ExchangeSymbolInfo = {
  assetType: ExchangeMarketAssetType;
  baseAsset: string;
  baseAssetPrecision: number;
  country: string;
  exchangeFee: number;
  filters: ExchangeSymbolFilter[];
  industry: string;
  longRate: number;
  makerFee: number;
  marketModes: ExchangeMarketMode[];
  marketType: ExchangeMarketType;
  maxSLGap: number;
  maxTPGap: number;
  minSLGap: number;
  minTPGap: number;
  name: string;
  orderTypes: OrderType[];
  quoteAsset: string;
  quoteAssetId: string;
  quotePrecision: number;
  sector: string;
  shortRate: number;
  status: ExchangeMarketStatus;
  swapChargeInterval: number;
  symbol: string;
  takerFee: number;
  tickSize: number;
  tickValue: number;
  tradingFee: number;
  tradingHours: string;
}
