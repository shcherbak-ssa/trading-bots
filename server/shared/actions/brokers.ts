import type { BrokerClientInfo, NewBroker, OnlyIdPayload } from 'global/types';

import type { BrokersDatabaseCollection, BrokersApiKeys, BrokersDatabaseDocument } from 'shared/types';
import { ActionType } from 'shared/constants';

import { ApiKeys } from 'api/brokers/api-keys';
import { UserBrokers } from 'api/database/user-brokers';


const brokersApiKeys: BrokersApiKeys = new ApiKeys();


export const brokersActions = {
  async [ActionType.BROKERS_GET](userId: string): Promise<BrokerClientInfo[]> {
    const brokersCollection: BrokersDatabaseCollection = await UserBrokers.connect(userId);
    const brokers: BrokersDatabaseDocument[] = await brokersCollection.getBrokers();

    // @TODO: load broker bots
    return brokers.map((broker) => {
      // @ts-ignore
      delete broker.apiKeys;

      return { ...broker, bots: [] }
    });
  },

  async [ActionType.BROKERS_CONNECT](userId: string, newBroker: NewBroker): Promise<BrokerClientInfo> {
    const { name, apiKeys } = newBroker;
    await brokersApiKeys.check(name, apiKeys);

    const brokersCollection: BrokersDatabaseCollection = await UserBrokers.connect(userId);
    const createdBroker: BrokersDatabaseDocument = await brokersCollection.saveBroker(newBroker);

    return {
      id: createdBroker.id,
      expiresDate: createdBroker.expiresDate,
      bots: [],
      name,
    };
  },

  async [ActionType.BROKERS_DELETE](userId: string, { id: brokerId }: OnlyIdPayload): Promise<void> {
    const brokersCollection: BrokersDatabaseCollection = await UserBrokers.connect(userId);
    await brokersCollection.deleteBroker(brokerId);

    // @TODO: delete broker bots and close positions
  }
};
