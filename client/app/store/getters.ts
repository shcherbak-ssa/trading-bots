import type { GetterTree } from 'vuex';

import type { BotClientInfo, Broker, BrokerAccount, BrokerMarket } from 'global/types';
import { BrokerAccountType } from 'global/constants';

import type { StoreState, DropdownBrokerOption, DropdownBrokerAccountOption } from 'shared/types';

import { Notifications } from 'services/notifications';


export type Getters = {
  getUserBroker(state: StoreState): (brokerId: string) => Broker;

  isBotSelected(state: StoreState): boolean;
  isBrokerSelected(state: StoreState): boolean;

  itemSectionSelectedBot(state: StoreState): BotClientInfo | null;

  brokersDropdownOptions(state: StoreState): DropdownBrokerOption[];
  brokerAccountsDropdownOptions(state: StoreState): DropdownBrokerAccountOption[];
  brokerMarketsDropdownOptions(state: StoreState): BrokerMarket[];
  brokerMarketLeverageDropdownOptions(state: StoreState): { value: string }[];
}


export const getters: GetterTree<StoreState, StoreState> & Getters = {
  // User
  getUserBroker(state: StoreState) {
    return (brokerId: string) => {
      const foundBroker: Broker | undefined = state.user.brokers.find(({ id }) => id === brokerId);

      if (!foundBroker) {
        Notifications.showErrorNotification(`Application Error`, `Broker not found in store`);

        throw new Error(`[app] - Broker not found in store (${brokerId})`);
      }

      return foundBroker;
    };
  },


  // Action section
  isBotSelected(state: StoreState) {
    return !!state.actionSection.selectedBot;
  },

  isBrokerSelected(state: StoreState) {
    return !!state.actionSection.selectedBroker;
  },


  // Item section
  itemSectionSelectedBot(state: StoreState) {
    return state.user.bots.find(({ id }) => id === state.itemSection.selectedBotId) || null;
  },


  // Dropdown options
  brokersDropdownOptions(state: StoreState) {
    return state.user.brokers.map(({ id, name }) => ({ id, brokerName: name }));
  },

  brokerAccountsDropdownOptions(state: StoreState) {
    if (!state.broker.accounts.length) return [];

    const realAccounts: BrokerAccount[] = [];
    const demoAccounts: BrokerAccount[] = [];
    const options: DropdownBrokerAccountOption[] = [];

    state.broker.accounts.forEach((account) => {
      if (account.type === BrokerAccountType.REAL) {
        realAccounts.push(account);
      } else {
        demoAccounts.push(account);
      }
    });

    if (realAccounts.length) {
      options.push({
        label: BrokerAccountType.REAL,
        items: realAccounts,
      });
    }

    if (demoAccounts.length) {
      options.push({
        label: BrokerAccountType.DEMO,
        items: demoAccounts,
      });
    }

    return options;
  },

  brokerMarketsDropdownOptions(state: StoreState): BrokerMarket[] {
    return state.broker.markets;
  },

  brokerMarketLeverageDropdownOptions(state: StoreState): { value: string }[] {
    return state.broker.marketLeverage.available.map((value) => ({ value: value.toString() }));
  },
};