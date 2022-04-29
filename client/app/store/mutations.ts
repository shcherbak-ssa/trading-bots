import type { MutationTree } from 'vuex';

import type { BotClientInfo, Broker, BrokerAccount, BrokerMarket } from 'global/types';
import { BrokerDataType } from 'global/constants';

import type { StoreNotification, StoreState } from 'shared/types';
import { initialStoreBrokerMarketLeverageState, SectionComponent, StoreMutation } from 'shared/constants';


export type Mutations<State = StoreState> = {
  [StoreMutation.APP_TOGGLE_MENU](state: State): void;
  [StoreMutation.APP_SHOW_NOTIFICATION](state: State, notification: StoreNotification): void;
  [StoreMutation.APP_HIDE_NOTIFICATION](state: State): void;

  [StoreMutation.ACTION_SECTION_OPEN](state: State, payload: { component: SectionComponent, bot?: BotClientInfo, broker?: Broker }): void;
  [StoreMutation.ACTION_SECTION_CLOSE](state: State): void;

  [StoreMutation.ITEM_SECTION_OPEN](state: State, payload: { component: SectionComponent, botId?: string }): void;
  [StoreMutation.ITEM_SECTION_CLOSE](state: State): void;

  [StoreMutation.USER_UPDATE_BROKERS](state: State, payload: { brokers: Broker[] }): void;
  [StoreMutation.USER_UPDATE_BOTS](state: State, payload: { bots: BotClientInfo[] }): void;

  [StoreMutation.BROKER_RESET](state: State, payload: { dataTypes?: BrokerDataType[] }): void;
  [StoreMutation.BROKER_UPDATE_ACCOUNTS](state: State, payload: { accounts: BrokerAccount[] }): void;
  [StoreMutation.BROKER_UPDATE_MARKETS](state: State, payload: { markets: BrokerMarket[] }): void;
  [StoreMutation.BROKER_UPDATE_MARKET_LEVERAGE](state: State, marketLeverage: StoreState['broker']['marketLeverage']): void;
}


export const mutations: MutationTree<StoreState> & Mutations = {
  // App
  [StoreMutation.APP_TOGGLE_MENU](state: StoreState): void {
    state.app.isMenuOpen = !state.app.isMenuOpen;
  },

  [StoreMutation.APP_SHOW_NOTIFICATION](state: StoreState, notification: StoreNotification): void {
    state.app.notification = notification;
  },

  [StoreMutation.APP_HIDE_NOTIFICATION](state: StoreState): void {
    state.app.notification = null;
  },


  // Action section
  [StoreMutation.ACTION_SECTION_OPEN](
    state: StoreState,
    { component, bot, broker }: { component: SectionComponent, bot?: BotClientInfo, broker?: Broker }
  ): void {
    state.actionSection.isActive = true;
    state.actionSection.component = component;
    state.actionSection.selectedBot = bot || null;
    state.actionSection.selectedBroker = broker || null;
  },

  [StoreMutation.ACTION_SECTION_CLOSE](state: StoreState): void {
    state.actionSection.isActive = false;
    state.actionSection.component = SectionComponent.DEFAULT;
    state.actionSection.selectedBot = null;
    state.actionSection.selectedBroker = null;
  },


  // Item section
  [StoreMutation.ITEM_SECTION_OPEN](
    state: StoreState,
    { component, botId }: { component: SectionComponent, botId?: string }
  ): void {
    state.itemSection.isActive = true;
    state.itemSection.component = component;
    state.itemSection.selectedBotId = botId || null;
  },

  [StoreMutation.ITEM_SECTION_CLOSE](state: StoreState): void {
    state.itemSection.isActive = false;
    state.itemSection.component = SectionComponent.DEFAULT;
    state.itemSection.selectedBotId = null;
  },


  // User
  [StoreMutation.USER_UPDATE_BROKERS](state: StoreState, { brokers }: { brokers: Broker[] }): void  {
    state.user.brokers = brokers;
  },

  [StoreMutation.USER_UPDATE_BOTS](state: StoreState, { bots }: { bots: BotClientInfo[] }): void {
    state.user.bots = bots;
  },


  // Broker
  [StoreMutation.BROKER_RESET](state: StoreState, { dataTypes = [] }: { dataTypes?: BrokerDataType[] }): void {
    if (dataTypes.length) {
      for (const dataType of dataTypes) {
        switch (dataType) {
          case BrokerDataType.ACCOUNT:
            state.broker.accounts = [];
            break;
          case BrokerDataType.MARKET:
            state.broker.markets = [];
            break;
          case BrokerDataType.MARKET_LEVERAGE:
            state.broker.marketLeverage = { ...initialStoreBrokerMarketLeverageState };
            break;
        }
      }

      return;
    }

    state.broker.accounts = [];
    state.broker.markets = [];
    state.broker.marketLeverage = { ...initialStoreBrokerMarketLeverageState };
  },

  [StoreMutation.BROKER_UPDATE_ACCOUNTS](state: StoreState, { accounts }: { accounts: BrokerAccount[] }): void {
    state.broker.accounts = accounts;
  },

  [StoreMutation.BROKER_UPDATE_MARKETS](state: StoreState, { markets }: { markets: BrokerMarket[] }): void {
    state.broker.markets = markets;
  },

  [StoreMutation.BROKER_UPDATE_MARKET_LEVERAGE](
    state: StoreState,
    marketLeverage: StoreState['broker']['marketLeverage']
  ): void {
    state.broker.marketLeverage = marketLeverage;
  },
};
