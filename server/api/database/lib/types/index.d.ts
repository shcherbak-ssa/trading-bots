import mongoose from 'mongoose';


export type DatabaseName = string;

export type MongoConnection = mongoose.Connection;
export type MongoSchema<Document> = mongoose.Schema<Document>;
export type MongoCollection<Document> = mongoose.Model<Document>;
