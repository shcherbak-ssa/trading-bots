export const REAL_ACCOUNT_API_URL: string = 'https://api-adapter.backend.currency.com';
export const DEMO_ACCOUNT_API_URL: string = 'https://demo-api-adapter.backend.currency.com';
export const WS_API_URL: string = 'wss://api-adapter.backend.currency.com/connect';

export const TRADING_HOURS_SEPARATOR: string = ';';


export const WS_PING_DELAY: number = 5000;
export const POSITION_HISTORY_LIMIT: number = 10;
export const POSITION_CHECK_LIMIT: number = 20;
export const POSITION_ACTION_SLEEP_TIME: number = 5000;


export const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


export enum MarketFilter {
  LOT_SIZE = 'LOT_SIZE',
}

export enum Subscription {
  MARKET_PRICE = 'internal.quote',
}

export enum Endpoint {
  ACCOUNT = '/api/v2/account',
  EXCHANGE_INFO = '/api/v2/exchangeInfo',
  MARKET_LEVERAGE = '/api/v2/leverageSettings',
  MARKET_PRICE = '/api/v2/ticker/24hr',
  ORDER = '/api/v2/order',
  POSITIONS = '/api/v2/tradingPositions',
  POSITIONS_HISTORY = '/api/v2/tradingPositionsHistory',
  CLOSE_POSITION = '/api/v2/closeTradingPosition',
}

export enum EndpointSubscription {
  MARKET_PRICE = 'marketData.subscribe',
}


// Order
export enum OrderType {
  LIMIT = 'LIMIT',
  MARKET = 'MARKET',
  STOP = 'STOP',
  LIMIT_MAKER = 'LIMIT_MAKER',
  STOP_LOSS = 'STOP_LOSS',
  STOP_LOSS_LIMIT = 'STOP_LOSS_LIMIT',
  TAKE_PROFIT = 'TAKE_PROFIT',
  TAKE_PROFIT_LIMIT = 'TAKE_PROFIT_LIMIT',
}

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum OrderTimeInForce {
  GTC = 'GTC',
  IOC = 'IOC',
  FOK = 'FOK',
}

export enum OrderStatus {
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  FILLED = 'FILLED',
  NEW = 'NEW',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  PENDING_CANCEL = 'PENDING_CANCEL',
  REJECTED = 'REJECTED',
}


// Position
export enum PositionState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  INVALID = 'INVALID',
}

export enum PositionStatus {
  CLOSED = 'CLOSED',
  DIVIDEND = 'DIVIDEND',
  MODIFIED = 'MODIFIED',
  MODIFY_REJECT = 'MODIFY_REJECT',
  OPENED = 'OPENED',
  SWAP = 'SWAP',
}

export enum PositionSource {
  CLOSE_OUT = 'CLOSE_OUT',
  DEALER = 'DEALER',
  SL = 'SL',
  SYSTEM = 'SYSTEM',
  TP = 'TP',
  USER = 'USER',
}

export enum PositionCloseRejectReason {
  ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
  CLOSED_MARKET = 'CLOSED_MARKET',
  CLOSE_ONLY = 'CLOSE_ONLY',
  ENGINE_BUSY = 'ENGINE_BUSY',
  HEDGING_MODE_GSL = 'HEDGING_MODE_GSL',
  INSTRUMENT_NOT_AVAILABLE = 'INSTRUMENT_NOT_AVAILABLE',
  INSTRUMENT_NOT_FOUND = 'INSTRUMENT_NOT_FOUND',
  INVALID_ORDER = 'INVALID_ORDER',
  INVALID_ORDER_QTY = 'INVALID_ORDER_QTY',
  INVALID_PRICE = 'INVALID_PRICE',
  LONG_ONLY = 'LONG_ONLY',
  OFF_MARKET = 'OFF_MARKET',
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  ORIGINAL_GSL_UPDATE = 'ORIGINAL_GSL_UPDATE',
  POSITION_NOT_FOUND = 'POSITION_NOT_FOUND',
  RC_INSTRUMENT_CLIENT_MOP = 'RC_INSTRUMENT_CLIENT_MOP',
  RC_INSTRUMENT_GLOBAL_MOP = 'RC_INSTRUMENT_GLOBAL_MOP',
  RC_NOT_ENOUGH_MARGIN = 'RC_NOT_ENOUGH_MARGIN',
  RC_NOT_FOUND = 'RC_NOT_FOUND',
  RC_NO_RATES = 'RC_NO_RATES',
  RC_SETTLEMENT = 'RC_SETTLEMENT',
  RC_UNKNOWN = 'RC_UNKNOWN',
  REQUIRED_GSL = 'REQUIRED_GSL',
  RISK_CHECK = 'RISK_CHECK',
  THROTTLING = 'THROTTLING',
  UNKNOWN = 'UNKNOWN',
}

export enum PositionCloseType {
  ORDER_CANCEL = 'ORDER_CANCEL',
  ORDER_MODIFY = 'ORDER_MODIFY',
  ORDER_NEW = 'ORDER_NEW',
  POSITION_MODIFY = 'POSITION_MODIFY',
}

export enum PositionCloseState {
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
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
