export const API_PATHNAME: string = '/api';
export const ENTRY_POINT_PATHNAME: string = '*';


export const ONE_HUNDRED: number = 100;
export const FRACTION_DIGITS_TO_HUNDREDTHS: number = 2;


export enum ActionType {
  BOT_MANAGER_SETUP_ACTIVE_BOTS = 'bot-manager/setup-active-bots',
  BOT_MANAGER_ACTIVATE_BOT = 'bot-manager/activate-bot',
  BOT_MANAGER_DEACTIVATE_BOT = 'bot-manager/deactivate-bot',

  BOTS_LOAD = 'bots/load',
  BOTS_CREATE = 'bots/create',
  BOTS_UPDATE = 'bots/update',
  BOTS_DELETE = 'bots/delete',

  BROKERS_LOAD = 'brokers/load',
  BROKERS_GET_DATA = 'brokers/get-data',
  BROKERS_GET_ACCOUNT = 'brokers/get-account',
  BROKERS_GET_API_KEYS = 'brokers/get-api-keys',
  BROKERS_CONNECT = 'brokers/connect',
  BROKERS_UPDATE = 'brokers/update',
  BROKERS_DELETE = 'brokers/delete',
}

export enum DatabaseCollection {
  APP_USERS = 'users',
  USER_BOTS = 'bots',
  USER_BROKERS = 'brokers',
}

export enum ErrorName {
  PROCESS_ERROR = 'ProcessError',
  BROKER_API_ERROR = 'BrokerApiError',
  VALIDATION_ERROR = 'ValidationError',
}

export enum Validation {
  EMPTY = 'empty',
  ONLY_ID = 'only-id',

  BOTS_LOAD = 'bots/load',
  BOTS_CREATE = 'bots/create',
  BOTS_UPDATE = 'bots/update',

  BROKERS_LOAD = 'brokers/load',
  BROKERS_GET_DATA = 'brokers/get-data',
  BROKERS_CONNECT = 'brokers/connect',
  BROKERS_UPDATE = 'brokers/update',
}
