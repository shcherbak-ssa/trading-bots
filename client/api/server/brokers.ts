import type { BrokerClientInfo, ErrorPayload, NewBroker } from 'global/types';
import { ServerEndpoint } from 'global/constants';

import type { BrokersApi } from 'shared/types';

import { Api } from './lib/api';


export class Brokers implements BrokersApi {
  async getBrokers(): Promise<BrokerClientInfo[] | ErrorPayload> {
    return await Api.get({
      endpoint: ServerEndpoint.API_BROKERS,
      params: {},
      body: {},
    });
  }

  async connectBroker(newBroker: NewBroker): Promise<BrokerClientInfo | ErrorPayload> {
    return await Api.post({
      endpoint: ServerEndpoint.API_BROKERS,
      params: {},
      body: { ...newBroker },
    });
  }

  async deleteBroker(id: string): Promise<{} | ErrorPayload> {
    return await Api.delete({
      endpoint: ServerEndpoint.API_BROKERS_WITH_ID,
      params: { id },
      body: {},
    });
  }
}
