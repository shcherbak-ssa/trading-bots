export const API_PATHNAME: string = '/api';
export const SIGNALS_PATHNAME: string = '/signals';
export const ENTRY_POINT_PATHNAME: string = '*';

export const JOB_TIMEZONE: string = 'Europe/London';

export const DATE_STRING_27_DAYS: string = '27 days';


export const ONE_HUNDRED: number = 100;
export const FRACTION_DIGITS_TO_HUNDREDTHS: number = 2;


export enum ActionType {
  BOT_MANAGER_SETUP_ACTIVE_BOTS = 'bot-manager/setup-active-bots',
  BOT_MANAGER_ACTIVATE_BOT = 'bot-manager/activate-bot',
  BOT_MANAGER_DEACTIVATE_BOT = 'bot-manager/deactivate-bot',
  BOT_MANAGER_RESTART_BOT = 'bot-manager/restart-bot',
  BOT_MANAGER_CHECK_MAX_LOSS = 'bot-manager/check-max-loss',

  BOTS_GET = 'bots/get',
  BOTS_CREATE = 'bots/create',
  BOTS_UPDATE = 'bots/update',
  BOTS_DELETE = 'bots/delete',
  BOTS_CHECK_RESTART = 'bots/check-restart',

  BROKERS_GET = 'brokers/get',
  BROKERS_GET_DATA = 'brokers/get-data',
  BROKERS_GET_ACCOUNT = 'brokers/get-account',
  BROKERS_GET_API_KEYS = 'brokers/get-api-keys',
  BROKERS_CONNECT = 'brokers/connect',
  BROKERS_UPDATE = 'brokers/update',
  BROKERS_DELETE = 'brokers/delete',

  OPEN_POSITIONS_GET = 'open-positions/get',
  OPEN_POSITIONS_CREATE = 'open-positions/create',
  OPEN_POSITIONS_UPDATE = 'open-positions/update',
  OPEN_POSITIONS_DELETE = 'open-positions/delete',
  OPEN_POSITIONS_CHECK_CLOSE = 'open-positions/check-close',

  POSITIONS_GET = 'positions/get',
  POSITIONS_CREATE = 'positions/create',
  POSITIONS_DELETE = 'positions/delete',

  SIGNALS_PROCESS = 'signals/process',

  USERS_GET = 'users/get',
}

export enum DatabaseCollection {
  APP_USERS = 'users',
  USER_BOTS = 'bots',
  USER_BROKERS = 'brokers',
  USER_OPEN_POSITIONS = 'open-positions',
  USER_POSITIONS = 'positions',
}

export enum ErrorName {
  PROCESS_ERROR = 'ProcessError',
  BROKER_API_ERROR = 'BrokerApiError',
  VALIDATION_ERROR = 'ValidationError',
  SIGNAL_ERROR = 'SignalError',
  BOT_ERROR = 'BotError',
  POSITION_ERROR = 'PositionError',
}

export enum Validation {
  EMPTY = 'empty',
  ONLY_ID = 'only-id',

  BOTS_GET = 'bots/get',
  BOTS_CREATE = 'bots/create',
  BOTS_UPDATE = 'bots/update',

  BROKERS_GET = 'brokers/get',
  BROKERS_GET_DATA = 'brokers/get-data',
  BROKERS_CONNECT = 'brokers/connect',
  BROKERS_UPDATE = 'brokers/update',

  SIGNALS = 'signals',
}

export enum SignalType {
  OPEN = 'OPEN',
  UPDATE = 'UPDATE',
  CLOSE = 'CLOSE',
}

export enum SignalDirection {
  LONG = 'LONG',
  SHORT = 'SHORT',
}

export enum JobExpression {
  CHECK_BOTS_RESTART = '0 1 * * SAT',
}

export enum PositionsCalculation {
  CURRENT_PROGRESS = 'current-progress',
}
