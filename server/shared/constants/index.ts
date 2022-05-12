export const API_PATHNAME: string = '/api';
export const WEBHOOKS_PATHNAME: string = '/webhook';
export const ENTRY_POINT_PATHNAME: string = '*';
export const JOB_TIMEZONE: string = 'Etc/UTC';
export const DATE_STRING_27_DAYS: string = '27 days';

export const USERNAME_PASSWORD_SEPARATOR: string = '-';
export const USERNAME_PASSWORD_TEST: RegExp = /\w{4,}-\w{8}$/;


export const MINUTES_BEFORE_MARKET_CLOSING: number = 5;
export const USERNAME_MIN_LENGTH: number = 4;
export const PASSWORD_MIN_LENGTH: number = 8;


export enum ActionType {
  ANALYTICS_GET_BOT_PROGRESS = 'analytics/get-bot-progress',

  BOT_MANAGER_SETUP_ACTIVE_BOTS = 'bot-manager/setup-active-bots',
  BOT_MANAGER_ACTIVATE_BOT = 'bot-manager/activate-bot',
  BOT_MANAGER_DEACTIVATE_BOT = 'bot-manager/deactivate-bot',
  BOT_MANAGER_RESTART_BOT = 'bot-manager/restart-bot',
  BOT_MANAGER_CHECK_MAX_LOSS = 'bot-manager/check-max-loss',

  BOTS_GET = 'bots/get',
  BOTS_CREATE = 'bots/create',
  BOTS_UPDATE = 'bots/update',
  BOTS_DELETE = 'bots/delete',

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

  TELEGRAM_PROCESS_INCOME_MESSAGE = 'telegram/process-income-message',

  NOTIFICATIONS_NOTIFY_USER = 'notifications/notify-user',
  NOTIFICATIONS_NOTIFY_ADMIN = 'notifications/notify-admin',

  USERS_GET = 'users/get',
  USERS_CREATE = 'users/create',
  USERS_UPDATE = 'users/update',
  USERS_CHECK = 'users/check',
}

export enum DatabaseCollection {
  APP_USERS = 'users',
  USER_BOTS = 'bots',
  USER_BROKERS = 'brokers',
  USER_OPEN_POSITIONS = 'open-positions',
  USER_POSITIONS = 'positions',
}

export enum ErrorName {
  APP_ERROR = 'AppError',
  API_ERROR = 'ApiError',
  VALIDATION_ERROR = 'ValidationError',
  SIGNAL_ERROR = 'SignalError',
}

export enum Validation {
  NONE = 'none',
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


// Logger
export enum LogScope {
  APP = 'APP',
  API = 'API',
  BOT = 'BOT',
  JOB = 'JOB',
}


// Signals
export enum SignalType {
  OPEN = 'OPEN',
  UPDATE = 'UPDATE',
  CLOSE = 'CLOSE',
}

export enum SignalDirection {
  LONG = 'LONG',
  SHORT = 'SHORT',
}


// Jobs
export enum JobExpression {
  CHECK_BOTS_RESTART = '0 1 * * SAT',
  CHECK_BROKER_API_KEYS_EXPIRES = '30 1 * * *',
  UPDATE_BOT_BROKER_ACCOUNT = '* * * * *',
}


// Telegram
export enum TelegramCommand {
  START = '/start',
  HELP = '/help',
  // User
  REPORT_TODAY = '/report today',
  REPORT_WEEK = '/report week',
  REPORT_MONTH = '/report month',
  LOGIN_USERNAME = '/login username',
  LOGIN_PASSWORD = '/login password',
  // Admin
  USER_CREATE = '/user create',
}

export enum TelegramActionType {
  CREATE_USER = 'CREATE_USER',
  CONNECT_USER_TELEGRAM = 'CONNECT_USER_TELEGRAM',

  GET_USER_LOGIN = 'GET_USER_LOGIN',
  SET_USER_LOGIN = 'SET_USER_LOGIN',
}


// Notifications
export enum NotificationType {
  ATTENTION = 'ATTENTION',
  INFO = 'INFO',
  ERROR = 'ERROR',

  POSITION_OPEN = 'POSITION_OPEN',
  POSITION_UPDATE = 'POSITION_UPDATE',
  POSITION_CLOSE = 'POSITION_CLOSE',

  BOT_DEACTIVATION = 'BOT_DEACTIVATION',
}
