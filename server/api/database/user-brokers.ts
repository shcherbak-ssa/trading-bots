import mongoose from 'mongoose';

import type { BrokerApiKeys, UpdateBrokerPayload } from 'global/types';
import { convertDateStringToNumber, getReadableDateString } from 'global/utils';

import type {
  BrokersDatabaseCollection,
  BrokersDatabaseDocument,
  CreationDocument,
  BrokersWithParsedKeysDatabaseDocument
} from 'shared/types';

import { DatabaseCollection } from 'shared/constants';
import { ApiError } from 'shared/exceptions';
import { generateToken, parseToken } from 'shared/utils';

import { UserCollection } from './lib/user-collection';


const userBrokerSchema = new mongoose.Schema<BrokersDatabaseDocument>({
  name: { type: String, required: true },
  expiresAt: { type: String, required: true },
  apiKeys: { type: String, required: true },
});


export class UserBrokers extends UserCollection<BrokersDatabaseDocument> implements BrokersDatabaseCollection {
  static async connect(userId: string): Promise<BrokersDatabaseCollection> {
    const collection = await UserBrokers.connectCollection<BrokersDatabaseDocument>(
      userId,
      DatabaseCollection.USER_BROKERS,
      userBrokerSchema
    );

    return new UserBrokers(collection, userId);
  }


  private static generateApiKeysToken(apiKeys: BrokerApiKeys, expiresAt: string): string {
    const expires: string = getReadableDateString(convertDateStringToNumber(expiresAt) - Date.now());

    return generateToken(apiKeys, expires);
  }


  // Implementation
  async getBroker(brokerId: string): Promise<BrokersWithParsedKeysDatabaseDocument> {
    const broker = await this.collection.findOne({ _id: brokerId });

    if (broker) {
      const { apiKeys, ...brokerWithoutKeys } = broker.toObject();

      return {
        ...brokerWithoutKeys,
        apiKeys: parseToken(apiKeys),
      };
    }

    throw new ApiError({
      message: `Cannot found broker (${brokerId})`,
      messageHeading: 'Database',
      idLabel: 'user',
      id: this.userId,
      payload: { brokerId },
    });
  }

  async getBrokers(): Promise<BrokersWithParsedKeysDatabaseDocument[]> {
    const brokers = await this.collection.find();

    return brokers.map((broker) => {
      const { apiKeys, ...brokerWithoutKeys } = broker.toObject();

      return {
        ...brokerWithoutKeys,
        apiKeys: parseToken(apiKeys),
      };
    });
  }

  async getApiKeys(brokerId: string): Promise<BrokerApiKeys> {
    const broker = await this.getBroker(brokerId);

    return broker.apiKeys;
  }

  async createBroker(broker: CreationDocument<BrokersWithParsedKeysDatabaseDocument>): Promise<BrokersDatabaseDocument> {
    const apiKeys: string = UserBrokers.generateApiKeysToken(broker.apiKeys, broker.expiresAt);

    const createdBroker = await this.collection.create({ ...broker, apiKeys });

    return createdBroker.toObject();
  }

  async updateBroker(id: string, updates: UpdateBrokerPayload['updates']): Promise<void> {
    const apiKeys: string = UserBrokers.generateApiKeysToken(updates.apiKeys, updates.expiresAt);

    await this.collection.updateOne({ _id: id }, { ...updates, apiKeys });
  }

  async deleteBroker(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: id });
  }
}
