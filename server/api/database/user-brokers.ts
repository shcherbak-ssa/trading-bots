import mongoose from 'mongoose';

import type { BrokerApiKeys, UpdateBrokerPayload } from 'global/types';

import type { BrokersDatabaseCollection, BrokersDatabaseDocument, CreationDocument } from 'shared/types';
import { DatabaseCollection } from 'shared/constants';
import { ApiError } from 'shared/exceptions';

import { UserCollection } from './lib/user-collection';


const userBrokerSchema = new mongoose.Schema<BrokersDatabaseDocument>({
  name: { type: String, required: true },
  expiresAt: { type: String, required: true },
  apiKeys: { type: Map, of: String, required: true },
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


  // Implementation
  async getBroker(brokerId: string): Promise<BrokersDatabaseDocument> {
    const broker = await this.collection.findOne({ _id: brokerId });

    if (!broker) {
      throw new ApiError({
        message: `Cannot found broker (${brokerId})`,
        messageHeading: 'Database',
        idLabel: 'user',
        id: this.userId,
        payload: { brokerId },
      });
    }

    // @ts-ignore
    const parsedApiKeys = Object.fromEntries(broker.apiKeys.entries())

    return { ...broker.toObject(), apiKeys: parsedApiKeys };
  }

  async getBrokers(): Promise<BrokersDatabaseDocument[]> {
    const brokers = await this.collection.find();

    return brokers.map((broker) => broker.toObject());
  }

  async getApiKeys(brokerId: string): Promise<BrokerApiKeys> {
    const broker = await this.getBroker(brokerId);

    return broker.apiKeys;
  }

  async createBroker(broker: CreationDocument<BrokersDatabaseDocument>): Promise<BrokersDatabaseDocument> {
    // @TODO: hide api keys
    const createdBroker = await this.collection.create(broker);

    return createdBroker.toObject();
  }

  async updateBroker(id: string, updates: UpdateBrokerPayload['updates']): Promise<void> {
    await this.collection.updateOne({ _id: id }, updates);
  }

  async deleteBroker(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: id });
  }
}
