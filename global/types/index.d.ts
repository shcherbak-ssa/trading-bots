export * from './bots';
export * from './brokers';


export type ErrorPayload = {
  errors: ErrorItem[];
}

export type ErrorItem = {
  message: string;
  path?: string;
}

export type OnlyIdPayload = {
  id: string;
}
