export const QUERY_URL_SEPARATOR: string = '?';
export const BOT_TOKEN_SEPARATOR: string = '-';


export enum SignalType {
  LONG = 'LONG',
  SHORT = 'SHORT',
}

export enum Currency {
  USD = 'USD',
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
  ALIVE = 'alive',
  ARCHIVE = 'archive',
}

export enum BotUpdateType {
  ACTIVATE = 'activate',
  DEACTIVATE = 'deactivate',
  ARCHIVE = 'archive',
  UPDATE = 'update',
}
