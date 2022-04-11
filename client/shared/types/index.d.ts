import { ServerEndpoint } from 'global/constants';
import { IconList, Route } from 'shared/constants';


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
