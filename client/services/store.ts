import type { Broker, BotClientInfo, BrokerAccount, BrokerMarket, BrokerMarketLeverages } from 'global/types';

import type { BotsStore, BrokersStore } from 'shared/types';
import { StoreMutation } from 'shared/constants';

import { store } from 'app/store';


export class Store implements BotsStore, BrokersStore {

  // BotsStore
  setBots(bots: BotClientInfo[]): void {
    store.commit({
      type: StoreMutation.USER_UPDATE_BOTS,
      bots,
    });
  }

  addBot(bot: BotClientInfo): void {
    const userBots = [ ...store.state.user.bots ];
    userBots.push(bot);

    this.setBots(userBots);
  }

  updateBot(updatedBot: BotClientInfo): void {
    const updatedBots = store.state.user.bots.map((bot) => {
      return bot.id === updatedBot.id ? updatedBot : bot;
    });

    this.setBots(updatedBots);
  }

  deleteBot(deletingId: string): void {
    const updatedBots = store.state.user.bots.filter(({ id }) => id !== deletingId);

    this.setBots(updatedBots);
  }


  // BrokersStore
  setBrokers(brokers: Broker[]) {
    store.commit({
      type: StoreMutation.USER_UPDATE_BROKERS,
      brokers,
    });
  }

  addBroker(broker: Broker): void {
    const userBrokers = [ ...store.state.user.brokers ];
    userBrokers.push(broker);

    this.setBrokers(userBrokers);
  }

  updateBroker(brokerId: string, expiresAt: Date): void {
    const updatedBrokers = store.state.user.brokers.map((broker) => {
      return broker.id === brokerId ? { ...broker, expiresAt } : broker;
    });

    this.setBrokers(updatedBrokers);
  }

  updateBrokerAccounts(accounts: BrokerAccount[]): void {
    store.commit({
      type: StoreMutation.BROKER_UPDATE_ACCOUNTS,
      accounts,
    });
  }

  updateBrokerMarkets(markets: BrokerMarket[]): void {
    store.commit({
      type: StoreMutation.BROKER_UPDATE_MARKETS,
      markets,
    });
  }

  updateBrokerMarketLeverage(marketLeverage: Omit<BrokerMarketLeverages, 'dataType'>): void {
    store.commit({
      type: StoreMutation.BROKER_UPDATE_MARKET_LEVERAGE,
      ...marketLeverage,
    });
  }

  deleteBroker(deletingId: string) {
    const updatedBrokers = store.state.user.brokers.filter(({ id }) => id !== deletingId);

    this.setBrokers(updatedBrokers);
  }
}
