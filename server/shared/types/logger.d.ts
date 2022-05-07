import { LogScope } from 'shared/constants';


export type LogPayload<T> = {
  message: string;
  messageHeading: string;
  idLabel?: string;
  id?: string;
  payload?: T;
}

export interface Logger {
  logInfo<T>(scope: LogScope, info: string | LogPayload<T>): void;
  logError<T>(scope: LogScope, error: string | LogPayload<T>): void;
}
