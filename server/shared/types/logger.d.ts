export type LogPayload<T> = {
  message: string;
  idLabel?: string;
  payload?: T;
}

export interface Logger {
  logInfo<T>(info: string | LogPayload<T>): void;
  logError<T>(error: string | LogPayload<T>): void;
}
