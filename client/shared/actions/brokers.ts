import type { NewBroker, ErrorPayload, BrokerClientInfo, OnlyIdPayload } from 'global/types';

import type { BrokersApi, BrokersStore } from 'shared/types';
import { ActionType } from 'shared/constants';

import { Notifications } from 'services/notifications';
import { storeService } from 'services/store';

import { Brokers } from 'api/server/brokers';


export const brokersActions = {
  async [ActionType.BROKERS_GET](): Promise<void> {
    const api: BrokersApi = new Brokers();
    const brokers: BrokerClientInfo[] | ErrorPayload = await api.getBrokers();

    if ('errors' in brokers) return;

    const brokersStore: BrokersStore = storeService;
    brokersStore.loadBrokers(brokers);
  },

  async [ActionType.BROKERS_CONNECT](newBroker: NewBroker): Promise<void> {
    const api: BrokersApi = new Brokers();
    const connectedBroker: BrokerClientInfo | ErrorPayload = await api.connectBroker(newBroker);

    if ('errors' in connectedBroker) {
      storeService.setError(ActionType.BROKERS_CONNECT, connectedBroker.errors);

      return;
    }

    const brokersStore: BrokersStore = storeService;
    brokersStore.addBroker(connectedBroker);

    Notifications.showSuccessNotification(
      'Broker Connected',
      `Broker [${connectedBroker.name}] connected successfully`,
    );
  },

  async [ActionType.BROKERS_DELETE]({ id }: OnlyIdPayload): Promise<void> {
    const api: BrokersApi = new Brokers();
    const deletionResult: {} | ErrorPayload = await api.deleteBroker(id);

    if ('errors' in deletionResult) {
      Notifications.showErrorNotification(
        'Deleting Error',
        `Something went wrong while deleting the broker. Please, try again`,
      );

      return;
    }

    const brokersStore: BrokersStore = storeService;
    brokersStore.deleteBroker(id);

    Notifications.showSuccessNotification(
      'Broker Deleted',
      `Broker deleted successfully`,
    );
  },
};
