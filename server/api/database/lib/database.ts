import mongoose from 'mongoose';

import type { DatabaseCollection } from 'shared/constants';

import type { DatabaseName, MongoCollection, MongoSchema, MongoConnection } from './types';
import { DATABASE_URL, DATABASE_URL_QUERY } from './constants';


export class Database {
  private static connections: Map<DatabaseName, MongoConnection> = new Map([]);


  static async connectCollection<Document>(
    databaseName: DatabaseName,
    collectionName: DatabaseCollection,
    schema: MongoSchema<Document>
  ): Promise<MongoCollection<Document>> {
    const connection: MongoConnection = await Database.connectToDatabase(databaseName);

    return connection.model(collectionName, schema);
  }


  private static async connectToDatabase(databaseName: DatabaseName): Promise<MongoConnection> {
    const connection: MongoConnection | undefined = Database.connections.get(databaseName);

    if (connection) return connection;

    const databaseUrl: string = DATABASE_URL + databaseName + DATABASE_URL_QUERY;
    const newConnection: MongoConnection = await mongoose.createConnection(databaseUrl);

    Database.connections.set(databaseName, newConnection);

    return newConnection;
  }
}
