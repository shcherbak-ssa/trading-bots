import type {
  BotClientInfo,
  Broker,
  BrokerAccount,
  BrokerMarket,
  BrokerMarketLeverages,
  ClientUser
} from 'global/types';

import { SectionComponent } from 'shared/constants';


export interface StoreState {
  app: {
    isMenuOpen: boolean;
    notification: null | StoreNotification;
    user: ClientUser | null;
  };
  actionSection: {
    isActive: boolean;
    component: SectionComponent;
    selectedBroker: Broker | null;
    selectedBot: BotClientInfo | null;
  };
  itemSection: {
    isActive: boolean;
    component: SectionComponent;
    selectedBotId: string | null;
  };
  user: {
    brokers: Broker[];
    bots: BotClientInfo[];
  };
  broker: {
    accounts: BrokerAccount[];
    markets: BrokerMarket[];
    marketLeverage: Omit<BrokerMarketLeverages, 'dataType'>;
  };
}

export type StoreNotification = {
  severity: 'success' | 'info' | 'error';
  summary: string;
  detail: string;
  life: number;
  group: 'notification';
}
