export * from './bots';
export * from './brokers';


export type EmptyResponse = {}

export type ErrorPayload = {
  heading?: string;
  errors: ErrorItem[];
}

export type ErrorItem = {
  message: string;
}

export type OnlyIdPayload = {
  id: string;
}
