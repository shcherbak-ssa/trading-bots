import mongoose from 'mongoose';

import type { CreationDocument, BrokersDatabaseDocument, BrokersDatabaseCollection } from 'shared/types';
import { DatabaseCollection } from 'shared/constants';

import type { MongoCollection } from './lib/types';
import { Database } from './lib/database';


const userDataBrokerSchema = new mongoose.Schema<BrokersDatabaseDocument>({
  name: { type: String, required: true },
  expiresDate: { type: Date, required: true },
  apiKeys: { type: Map, of: String, required: true },
});


export class UserBrokers implements BrokersDatabaseCollection {
  constructor(
    protected collection: MongoCollection<BrokersDatabaseDocument>,
  ) {}


  static async connect(userId: string): Promise<BrokersDatabaseCollection> {
    const userDatabaseName: string = process.env.MONGODB_USER_DATABASE_PREFIX + userId;

    const collection = await Database.connectCollection(
      userDatabaseName,
      DatabaseCollection.USER_BROKERS,
      userDataBrokerSchema,
    );

    return new UserBrokers(collection);
  }


  // Implementation
  async getBrokers(): Promise<BrokersDatabaseDocument[]> {
    const brokers = await this.collection.find();

    return brokers.map(({ id, name, expiresDate, apiKeys }) => {
      return { id, name, expiresDate, apiKeys };
    });
  }

  async saveBroker(broker: CreationDocument<BrokersDatabaseDocument>): Promise<BrokersDatabaseDocument> {
    return await this.collection.create(broker);
  }

  async deleteBroker(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: id });
  }
}
