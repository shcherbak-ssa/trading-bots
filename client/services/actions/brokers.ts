import type {
  Broker,
  GetBrokerDataPayload,
  GetBrokerDataResult,
  LoadBrokersPayload,
  NewBroker,
  UpdateBrokerPayload
} from 'global/types';

import { BrokerDataType } from 'global/constants';
import { brokerConfigs } from 'global/config';

import type { BrokerDeletePayload, BrokersApi, BrokersStore } from 'shared/types';
import { ActionType } from 'shared/constants';

import { Notifications } from 'services/notifications';
import { Store } from 'services/store';

import { Brokers } from 'api/server/brokers';


export const brokersActions = {
  async [ActionType.BROKERS_LOAD](payload: LoadBrokersPayload): Promise<void> {
    const api: BrokersApi = new Brokers();
    const brokers: Broker[] = await api.loadBrokers(payload);

    const brokersStore: BrokersStore = new Store();
    brokersStore.setBrokers(brokers);
  },

  async [ActionType.BROKERS_GET_DATA](payload: GetBrokerDataPayload): Promise<void> {
    const api: BrokersApi = new Brokers();
    const result: GetBrokerDataResult = await api.getBrokerData(payload);

    const brokersStore: BrokersStore = new Store();

    switch (result.dataType) {
      case BrokerDataType.ACCOUNT:
        const { real, demo } = result;

        brokersStore.updateBrokerAccounts([ ...real, ...demo ]);
        break;
      case BrokerDataType.MARKET:
        brokersStore.updateBrokerMarkets(result.markets);
        break;
      case BrokerDataType.MARKET_LEVERAGE:
        const { dataType, ...marketLeverage } = result;

        brokersStore.updateBrokerMarketLeverage(marketLeverage);
        break;
    }
  },

  async [ActionType.BROKERS_CONNECT](newBroker: NewBroker): Promise<void> {
    const api: BrokersApi = new Brokers();
    const connectedBroker: Broker = await api.connectBroker(newBroker);

    const brokersStore: BrokersStore = new Store();
    brokersStore.addBroker(connectedBroker);

    Notifications.showSuccessNotification(
      'Broker connected',
      `Broker "${brokerConfigs[connectedBroker.name].label}" connected successfully`,
    );
  },

  async [ActionType.BROKERS_UPDATE](payload: UpdateBrokerPayload): Promise<void> {
    const api: BrokersApi = new Brokers();
    await api.updateBroker(payload);

    const brokersStore: BrokersStore = new Store();
    brokersStore.updateBroker(payload.id, payload.updates.expiresAt);

    Notifications.showSuccessNotification(
      'Broker updated',
      `Broker "${brokerConfigs[payload.name].label}" updated successfully`,
    );
  },

  async [ActionType.BROKERS_DELETE]({ id, name }: BrokerDeletePayload): Promise<void> {
    const api: BrokersApi = new Brokers();
    await api.deleteBroker(id);

    const brokersStore: BrokersStore = new Store();
    brokersStore.deleteBroker(id);

    Notifications.showSuccessNotification(
      'Broker deleted',
      `Broker "${brokerConfigs[name].label}" deleted successfully`,
    );
  },
};
