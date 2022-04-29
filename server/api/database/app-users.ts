import mongoose from 'mongoose';

import type { UsersDatabaseCollection, UsersDatabaseDocument, CreationDocument } from 'shared/types';
import { DatabaseCollection } from 'shared/constants';

import type { MongoCollection } from './lib/types';
import { Database } from './lib/database';


const appUsersSchema = new mongoose.Schema<UsersDatabaseDocument>({
  email: { type: String, unique: true, required: true },
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
  async findUserByEmail(email: string): Promise<UsersDatabaseDocument | null> {
    const [ foundUser ] = await this.collection.find({ email });

    return foundUser || null;
  }

  async createUser(user: CreationDocument<UsersDatabaseDocument>): Promise<UsersDatabaseDocument> {
    return await this.collection.create(user);
  }
}