export const API_PATHNAME: string = '/api';
export const ENTRY_POINT_PATHNAME: string = '*';


export const ONE_HUNDRED: number = 100;
export const FRACTION_DIGITS_TO_HUNDREDTHS: number = 2;


export enum ActionType {
  BROKERS_GET = 'brokers/get',
  BROKERS_CONNECT = 'brokers/connect',
  BROKERS_DELETE = 'brokers/delete',
}

export enum DatabaseCollection {
  APP_USERS = 'users',
  USER_BROKERS = 'brokers',
}

export enum ErrorName {
  PROCESS_ERROR = 'ProcessError',
}

export enum Validation {
  EMPTY = 'empty',
  ID = 'id',

  BOTS_CREATE = 'bots/create',
  BOTS_READ = 'bots/read',
  BOTS_UPDATE = 'bots/update',
  BOTS_DELETE = 'bots/delete',
  BROKERS_CONNECT = 'brokers/connect',
}
