export const QUERY_URL_SEPARATOR: string = '?';
export const BROKER_API_KEYS_EXPIRES_START_NOTIFY_DAYS: string = '7 days';
export const BROKER_API_KEYS_EXPIRES_DEACTIVATE_DAYS: string = '1 day';


export enum Currency {
  USD = 'USD',
}

export enum GetUserType {
  ONE = 'ONE',
  ALL = 'ALL',
}


// Client-Server
export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum StatusCode {
  SUCCESS = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  UPDATED = 204,
  DELETED = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
}

export enum ServerEndpoint {
  API_BOTS = '/api/bots',
  API_BOTS_WITH_ID = '/api/bots/:id',
  API_BROKERS = '/api/brokers',
  API_BROKERS_WITH_ID = '/api/brokers/:id',

  WEBHOOK_SIGNALS = '/webhook/signals',
  WEBHOOK_TELEGRAM = '/webhook/telegram/:telegramToken',
}


// Analytics
export enum AnalyticsBotProgressType {
  ALL = 'ALL',
  CURRENT = 'CURRENT',
  TOTAL = 'TOTAL',
}


// Broker
export enum BrokerName {
  CURRENCY_COM = 'currency_com',
  CAPITAL_COM = 'capital_com',
}

export enum BrokerAccountType {
  REAL = 'REAL',
  DEMO = 'DEMO',
}

export enum BrokerDataType {
  ACCOUNT = 'account',
  MARKET = 'market',
  MARKET_LEVERAGE = 'market-leverage',
}


// Bot
export enum BotState {
  ALIVE = 'ALIVE',
  ARCHIVE = 'ARCHIVE',
}

export enum BotUpdateType {
  ACTIVATE = 'activate',
  DEACTIVATE = 'deactivate',
  RESTART = 'restart',
  ARCHIVE = 'archive',
  UPDATE = 'update',
}

export enum BotRestartMode {
  NONE = 'NONE',
  WEEK = 'WEEK',
  MONTH = 'MONTH' // 4 weeks
}

export enum BotPositionCloseMode {
  NONE = 'NONE',
  DAY_END = 'DAY_END',
  WEEK_END = 'WEEK_END',
}

export enum BotDeactivateReason {
  EMPTY = '',
  USER = 'USER',
  MAX_LOSS = 'MAX_LOSS',
  BROKER_API_KEYS_EXPIRED = 'BROKER_API_KEYS_EXPIRED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}
