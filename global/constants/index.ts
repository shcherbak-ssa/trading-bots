export const QUERY_URL_SEPARATOR: string = '?';


export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum StatusCode {
  SUCCESS = 200,
  CREATED = 201,
  UPDATED = 204,
  DELETED = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  INTERNAL_SERVER_ERROR = 500,
}

export enum BrokerAccountType {
  REAL = 'REAL',
  DEMO = 'DEMO',
}

export enum SignalType {
  LONG = 'LONG',
  SHORT = 'SHORT',
}

export enum BrokerList {
  CURRENCY_COM = 'Currency.com',
}

export enum RouterPathname {
  API = '/api',
}

export enum RoutePathname {
  API_BOTS = '/bots/(:id)?'
}
