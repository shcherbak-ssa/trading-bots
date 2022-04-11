import type { AppMenuItem, StoreState } from 'shared/types';


export enum StoreMutation {
  TOGGLE_MENU = 'toggle-menu',
}

export enum IconList {
  DASHBOARD = 'dashboard',
  BOTS = 'bots',
  BROKERS = 'brokers',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings',
  MENU_OPEN = 'menu-open',
  MENU_CLOSE = 'menu-close',
}

export enum Route {
  DASHBOARD = '/',
  BOTS = '/bots',
  BROKERS = '/brokers',
  ANALYTICS = '/analytics',
  SETTINGS = '/settings',
}


export const initialStoreState: StoreState = {
  isAppMenuOpen: true,
};

export const appMenuItems: AppMenuItem[] = [
  {
    label: 'Dashboard',
    icon: IconList.DASHBOARD,
    to: Route.DASHBOARD,
  },
  {
    label: 'Bots',
    icon: IconList.BOTS,
    to: Route.BOTS,
  },
  {
    label: 'Brokers',
    icon: IconList.BROKERS,
    to: Route.BROKERS,
  },
  {
    label: 'Analytics',
    icon: IconList.ANALYTICS,
    to: Route.ANALYTICS,
  },
  {
    label: 'Settings',
    icon: IconList.SETTINGS,
    to: Route.SETTINGS,
  },
];
