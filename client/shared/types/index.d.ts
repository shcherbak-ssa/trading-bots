import { ServerEndpoint } from 'global/constants';
import { IconList, Route } from 'shared/constants';


export * from './actions';
export * from './brokers';
export * from './form';
export * from './store';


export type AppMenuItem = {
  label: string;
  icon: IconList;
  to: Route;
}

export type ServerApiRequest<Params, Body> = {
  endpoint: ServerEndpoint;
  params: Params;
  body: Body;
}

export type ActionComponentItem = {
  label: string;
  icon: string;
  command: () => void;
}
