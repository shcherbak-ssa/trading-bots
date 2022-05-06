import type mongoose from 'mongoose';

import type { DatabaseCollection } from 'shared/constants';

import type { MongoCollection } from '../types';

import { Database } from './database';


export class UserCollection<Document> {
  constructor(
    protected collection: MongoCollection<Document>,
    protected userId: string,
  ) {}


  protected static async connectCollection<Document>(
    userId: string,
    collectionName: DatabaseCollection,
    collectionSchema: mongoose.Schema,
  ): Promise<MongoCollection<Document>> {
    const userDatabaseName: string = process.env.MONGODB_USER_DATABASE_PREFIX + userId;

    return await Database.connectCollection(
      userDatabaseName,
      collectionName,
      collectionSchema,
    );
  }
}
