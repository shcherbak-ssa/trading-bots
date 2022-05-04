import mongoose from 'mongoose';

import type {
  CreationDocument,
  PositionsDeleteFilters,
  PositionsDatabaseCollection,
  PositionsDatabaseDocument, PositionsGetFilters
} from 'shared/types';

import { DatabaseCollection } from 'shared/constants';

import { UserCollection } from './lib/user-collection';


const userPositionsSchema = new mongoose.Schema<PositionsDatabaseDocument>({
  botId: { type: String, required: true },
  botActivationIndex: { type: Number, required: true },
  isLong: { type: Boolean, required: true },
  totalFee: { type: Number, required: true },
  result: { type: Number, required: true },
  closedAt: { type: String, required: true },
});


export class UserPositions extends UserCollection<PositionsDatabaseDocument> implements PositionsDatabaseCollection {
  static async connect(userId: string): Promise<PositionsDatabaseCollection> {
    const collection = await UserPositions.connectCollection<PositionsDatabaseDocument>(
      userId,
      DatabaseCollection.USER_POSITIONS,
      userPositionsSchema,
    );

    return new UserPositions(collection);
  }


  // Implementation
  async getPositions(filters: PositionsGetFilters): Promise<PositionsDatabaseDocument[]> {
    const foundPositions = await this.collection.find(filters);

    return foundPositions.map((position) => position.toObject());
  }

  async createPosition(position: CreationDocument<PositionsDatabaseDocument>): Promise<PositionsDatabaseDocument> {
    const createdPosition = await this.collection.create(position);

    return createdPosition.toObject();
  }

  async deletePositions(filters: PositionsDeleteFilters): Promise<void> {
    if (filters.botId) {
      await this.collection.deleteMany(filters);
    }
  }
}
