import { BrokerAccountType, BrokerName } from 'global/constants';

import type { InputState, StoreState, BotActionState } from 'shared/types'


export const NOTIFICATION_LIFE_TIME: number = 5000;


export enum ActionType {
  BOTS_LOAD = 'bots/load',
  BOTS_CREATE = 'bots/create',
  BOTS_UPDATE = 'bots/update',
  BOTS_DELETE = 'bots/delete',

  BROKERS_LOAD = 'brokers/load',
  BROKERS_GET_DATA = 'brokers/get-data',
  BROKERS_CONNECT = 'brokers/connect',
  BROKERS_UPDATE = 'brokers/update',
  BROKERS_DELETE = 'brokers/delete',
}

export enum StoreMutation {
  APP_TOGGLE_MENU = 'app/toggle-menu',
  APP_SHOW_NOTIFICATION = 'app/show-notification',
  APP_HIDE_NOTIFICATION = 'app/hide-notification',

  ACTION_SECTION_OPEN = 'action-section/open',
  ACTION_SECTION_CLOSE = 'action-section/close',

  ITEM_SECTION_OPEN = 'item-section/open',
  ITEM_SECTION_CLOSE = 'item-section/close',

  USER_UPDATE_BROKERS = 'user/update-brokers',
  USER_UPDATE_BOTS = 'user/update-bots',

  BROKER_RESET = 'broker/reset',
  BROKER_UPDATE_ACCOUNTS = 'broker/update-accounts',
  BROKER_UPDATE_MARKETS = 'broker/update-markets',
  BROKER_UPDATE_MARKET_LEVERAGE = 'broker/update-market-leverage',
}

export enum IconList {
  DASHBOARD = 'dashboard',
  BOTS = 'bots',
  BROKERS = 'brokers',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings',

  MENU_OPEN = 'menu-open',
  MENU_CLOSE = 'menu-close',

  NOTIFICATION_ERROR = 'notification-error',
  NOTIFICATION_INFO = 'notification-info',
  NOTIFICATION_SUCCESS = 'notification-success',
}

export enum Route {
  DASHBOARD = '/',
  BOTS = '/bots',
  SETTINGS = '/settings',
}

export enum SectionComponent {
  DEFAULT = 'default',
  BROKER = 'broker',
  BOT = 'bot',
}


export const initialInputState: InputState = {
  value: '',
  helpText: '',
  isError: false,
};

export const initialBotActionState: BotActionState = {
  active: false,
  name: '',
  brokerId: '',
  brokerName: BrokerName.CURRENCY_COM,
  brokerAccountId: '',
  brokerAccountType: BrokerAccountType.REAL,
  brokerAccountCurrency: '',
  brokerMarketSymbol: '',
  brokerMarketName: '',
  tradeRiskPercent: 2,
  tradeMaxLossPercent: 25,
  tradeCapitalPercent: 100,
  tradeWithTakeProfit: false,
  tradeTakeProfitPL: 2,
  tradeWithCustomMarketLeverage: false,
  tradeMarketLeverage: 0,
  tradeCloseAtEndDay: false,
  tradeCloseAtEndWeek: false,
}

export const initialStoreBrokerMarketLeverageState = {
  current: 0,
  available: [],
};

export const initialStoreState: StoreState = {
  app: {
    isMenuOpen: false, // @TODO: change to 'true'
    notification: null,
  },
  actionSection: {
    isActive: false,
    component: SectionComponent.DEFAULT,
    selectedBot: null,
    selectedBroker: null,
  },
  itemSection: {
    isActive: false,
    component: SectionComponent.DEFAULT,
    selectedBotId: null,
  },
  user: {
    brokers: [],
    bots: [],
  },
  broker: {
    accounts: [],
    markets: [],
    marketLeverage: { ...initialStoreBrokerMarketLeverageState },
  },
};