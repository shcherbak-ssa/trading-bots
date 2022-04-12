import type { BrokerClientInfo, ErrorItem } from 'global/types';

import type { StoreService, BrokersStore } from 'shared/types';
import { StoreMutation } from 'shared/constants';

import { store } from 'app/store';


class Store implements
  StoreService,
  BrokersStore
{
  // StoreService
  setError(key: string, errors: ErrorItem[]): void {
    store.commit({
      type: StoreMutation.ADD_ERROR,
      key,
      errors,
    });
  }

  // BrokersStore
  loadBrokers(brokers: BrokerClientInfo[]) {
    store.commit({
      type: StoreMutation.UPDATE_USER,
      key: 'brokers',
      value: brokers,
    });
  }

  addBroker(broker: BrokerClientInfo): void {
    const userBrokers = [ ...store.state.user.brokers ];
    userBrokers.push(broker);

    store.commit({
      type: StoreMutation.UPDATE_USER,
      key: 'brokers',
      value: userBrokers,
    });
  }

  deleteBroker(deletingId: string) {
    const updatedBrokers = store.state.user.brokers.filter(({ id }) => id !== deletingId);

    store.commit({
      type: StoreMutation.UPDATE_USER,
      key: 'brokers',
      value: updatedBrokers,
    });
  }
}


export const storeService: Store = new Store();
