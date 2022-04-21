import type {
  Broker,
  UpdateBrokerPayload,
  GetBrokerDataPayload,
  GetBrokerDataResult,
  LoadBrokersPayload,
  NewBroker
} from 'global/types';
import { ServerEndpoint } from 'global/constants';

import type { BrokersApi } from 'shared/types';

import { Api } from './lib/api';


export class Brokers implements BrokersApi {
  async loadBrokers(payload: LoadBrokersPayload): Promise<Broker[]> {
    return await Api.get({
      endpoint: ServerEndpoint.API_BROKERS,
      params: {},
      body: payload,
    });
  }

  async getBrokerData({ id, ...payload }: GetBrokerDataPayload): Promise<GetBrokerDataResult> {
    return await Api.get({
      endpoint: ServerEndpoint.API_BROKERS_WITH_ID,
      params: { id },
      body: payload,
    });
  }

  async connectBroker(newBroker: NewBroker): Promise<Broker> {
    return await Api.post({
      endpoint: ServerEndpoint.API_BROKERS,
      params: {},
      body: newBroker,
    });
  }

  async updateBroker({ id, name, updates }: UpdateBrokerPayload): Promise<void> {
    await Api.put({
      endpoint: ServerEndpoint.API_BROKERS_WITH_ID,
      params: { id },
      body: { name, updates },
    });
  }

  async deleteBroker(id: string): Promise<void> {
    await Api.delete({
      endpoint: ServerEndpoint.API_BROKERS_WITH_ID,
      params: { id },
      body: {},
    });
  }
}
