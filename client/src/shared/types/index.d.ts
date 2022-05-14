import { ServerEndpoint } from 'global/constants';
import { IconList, Route } from 'shared/constants';


export * from './actions';
export * from './bots';
export * from './brokers';
export * from './form';
export * from './store';
export * from './users';


export type AppMenuItem = {
  label: string;
  icon: IconList | string;
  isMiIcon: boolean;
  to: Route;
}

export type ServerApiRequest<Params, Body> = {
  endpoint: ServerEndpoint;
  params: Params;
  body: Body;
}
