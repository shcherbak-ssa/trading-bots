import type { InputState, StoreState } from 'shared/types'


export const NOTIFICATION_LIFE_TIME: number = 5000;


export enum ActionType {
  BROKERS_GET = 'brokers/get',
  BROKERS_CONNECT = 'brokers/connect',
  BROKERS_DELETE = 'brokers/delete',
}

export enum StoreMutation {
  TOGGLE_MENU = 'toggle-menu',

  ADD_ERROR = 'add-error',
  REMOVE_ERROR = 'remove-error',

  OPEN_ACTION_SECTION = 'open-action-section',
  CLOSE_ACTION_SECTION = 'close-action-section',

  SHOW_NOTIFICATION = 'show-notification',
  HIDE_NOTIFICATION = 'hide-notification',

  UPDATE_USER = 'update-user',
}

export enum IconList {
  DASHBOARD = 'dashboard',
  BOTS = 'bots',
  BROKERS = 'brokers',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings',

  MENU_OPEN = 'menu-open',
  MENU_CLOSE = 'menu-close',

  ADD = 'add',
  EDIT = 'edit',
  DELETE = 'delete',

  NOTIFICATION_ERROR = 'notification-error',
  NOTIFICATION_INFO = 'notification-info',
  NOTIFICATION_SUCCESS = 'notification-success',
}

export enum Route {
  DASHBOARD = '/',
  BOTS = '/bots',
  ANALYTICS = '/analytics',
  SETTINGS = '/settings',
}

export enum ActionSectionComponent {
  DEFAULT = 'default',
  CONNECT_BROKER = 'connect-broker',
  CREATE_BOT = 'create-bot',
}


export const initialInputState: InputState = {
  value: '',
  helpText: '',
  isError: false,
};

export const initialStoreState: StoreState = {
  isAppMenuOpen: true,
  isActionSectionActive: false,
  actionSectionComponent: ActionSectionComponent.DEFAULT,
  notification: null,
  errors: {},
  user: {
    brokers: [],
  },
};
