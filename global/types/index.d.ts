export * from './analytics';
export * from './bots';
export * from './brokers';
export * from './users';


export type EmptyResponse = {}

export type ErrorPayload = {
  heading?: string;
  message: string;
}

export type OnlyIdPayload = {
  id: string;
}
