export const REAL_ACCOUNT_API_URL: string = 'https://api-adapter.backend.currency.com';
export const DEMO_ACCOUNT_API_URL: string = 'https://demo-api-adapter.backend.currency.com';
export const WS_API_URL: string = 'wss://api-adapter.backend.currency.com/connect';


export const KEEP_WS_CONNECTION_MILLISECONDS: number = 5000;


export enum OrderType {
  LIMIT = 'LIMIT',
  LIMIT_MAKER = 'LIMIT_MAKER',
  MARKET = 'MARKET',
  STOP = 'STOP',
  STOP_LOSS = 'STOP_LOSS',
  STOP_LOSS_LIMIT = 'STOP_LOSS_LIMIT',
  TAKE_PROFIT = 'TAKE_PROFIT',
  TAKE_PROFIT_LIMIT = 'TAKE_PROFIT_LIMIT',
}

export enum MarketFilter {
  LOT_SIZE = 'LOT_SIZE',
}

export enum Subscription {
  MARKET_PRICE = 'internal.quote',
}


// Endpoints
export enum Endpoint {
  ACCOUNT = '/api/v2/account',
  EXCHANGE_INFO = '/api/v2/exchangeInfo',
  MARKET_LEVERAGE = '/api/v2/leverageSettings',
  MARKET_PRICE = '/api/v2/ticker/24hr',
}

export enum EndpointSubscription {
  MARKET_PRICE = 'marketData.subscribe',
}


// Exchange
export enum ExchangeMarketAssetType {
  BOND = 'BOND',
  COMMODITY = 'COMMODITY',
  CREDIT = 'CREDIT',
  CRYPTOCURRENCY = 'CRYPTOCURRENCY',
  CURRENCY = 'CURRENCY',
  EQUITY = 'EQUITY',
  ICO = 'ICO',
  INDEX = 'INDEX',
  INTEREST_RATE = 'INTEREST_RATE',
  OTHER_ASSET = 'OTHER_ASSET',
  REAL_ESTATE = 'REAL_ESTATE',
  UTILITY_TOKENS = 'UTILITY_TOKENS',
}

export enum ExchangeMarketType {
  LEVERAGE = 'LEVERAGE',
  SPOT = 'SPOT',
}

export enum ExchangeMarketStatus {
  AUCTION_MATCH = 'AUCTION_MATCH',
  BREAK = 'BREAK',
  END_OF_DAY = 'END_OF_DAY',
  HALT = 'HALT',
  POST_TRADING = 'POST_TRADING',
  PRE_TRADING = 'PRE_TRADING',
  TRADING = 'TRADING',
}

export enum ExchangeMarketMode {
  CLOSED_FOR_CORPORATE_ACTION = 'CLOSED_FOR_CORPORATE_ACTION',
  CLOSE_ONLY = 'CLOSE_ONLY',
  HOLIDAY = 'HOLIDAY',
  LONG_ONLY = 'LONG_ONLY',
  REGULAR = 'REGULAR',
  UNKNOWN = 'UNKNOWN',
  VIEW_AND_REQUEST = 'VIEW_AND_REQUEST',
  VIEW_ONLY = 'VIEW_ONLY',
}
