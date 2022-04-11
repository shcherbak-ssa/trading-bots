import { IconList, Route } from 'shared/constants';


export * from './store';


export type AppMenuItem = {
  label: string;
  icon: IconList;
  to: Route;
}
