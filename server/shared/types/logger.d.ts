import { LogScope } from 'shared/constants';


export type LogPayload<T> = {
  message: string;
  messageHeading: string;
  idLabel?: string;
  id?: string;
  payload?: T;
  savePayload?: boolean;
}

export interface Logger {
  logInfo<T>(scope: LogScope, info: string | LogPayload<T>): void;
  logWarning<T>(scope: LogScope, warning: string | LogPayload<T>): void;
  logError<T>(scope: LogScope, error: string | LogPayload<T>): void;
}
