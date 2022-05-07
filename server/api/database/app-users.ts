import mongoose from 'mongoose';

import { GetUserType } from 'global/constants';

import type {
  GetUserFilters,
  UsersDatabaseCollection,
  UsersDatabaseDocument,
  CreationDocument,
  UpdateUserPayload
} from 'shared/types';

import { DatabaseCollection } from 'shared/constants';

import type { MongoCollection } from './types';
import { Database } from './lib/database';


const appUsersSchema = new mongoose.Schema<UsersDatabaseDocument>({
  telegramChatId: { type: Number, unique: true, required: true },
  isAdmin: { type: Boolean, required: true },
});


export class AppUsers implements UsersDatabaseCollection {
  constructor(
    private collection: MongoCollection<UsersDatabaseDocument>,
  ) {}


  static async connect(): Promise<UsersDatabaseCollection> {
    if (!process.env.MONGODB_APP_DATABASE_NAME) {
      throw new Error('No app database name');
    }

    const collection = await Database.connectCollection(
      process.env.MONGODB_APP_DATABASE_NAME,
      DatabaseCollection.APP_USERS,
      appUsersSchema
    );

    return new AppUsers(collection);
  }


  // Implementation
  async getUsers({ type, ...filters }: GetUserFilters): Promise<UsersDatabaseDocument[]> {
    if (type === GetUserType.ONE) {
      const foundUser = await this.collection.findOne(filters.id ? { _id: filters.id } : filters);

      return foundUser ? [ foundUser.toObject() ] : [];
    }

    const users = await this.collection.find();

    return users.map((user) => user.toObject());
  }

  async createUser(user: CreationDocument<UsersDatabaseDocument>): Promise<UsersDatabaseDocument> {
    const createdUser = await this.collection.create(user);

    return createdUser.toObject();
  }

  async updateUser(userId: string, updates: UpdateUserPayload): Promise<void> {
    await this.collection.updateOne({ _id: userId }, updates);
  }
}
