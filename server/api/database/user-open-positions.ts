import mongoose from 'mongoose';

import type {
  CreationDocument,
  OpenPositionsDatabaseCollection,
  OpenPositionsDatabaseDocument,
  OpenPositionUpdatePayload
} from 'shared/types';

import { DatabaseCollection } from 'shared/constants';

import { UserCollection } from './lib/user-collection';


const userOpenPositionSchema = new mongoose.Schema<OpenPositionsDatabaseDocument>({
  botId: { type: String, required: true },
  brokerPositionIds: [String],
  isLong: { type: Boolean, required: true },
  riskSize: { type: Number, required: true },
  marketSymbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  stopLossPrice: { type: Number, required: true },
  stopLossSize: { type: Number, required: true },
  takeProfitPrice: { type: Number, required: true },
  takeProfitSize: { type: Number, required: true },
  feeOpen: { type: Number, required: true },
  feeClose: { type: Number, required: true },
  result: { type: Number, required: true },
});


export class UserOpenPositions
  extends UserCollection<OpenPositionsDatabaseDocument>
  implements OpenPositionsDatabaseCollection
{
  static async connect(userId: string): Promise<OpenPositionsDatabaseCollection> {
    const collection = await UserOpenPositions.connectCollection<OpenPositionsDatabaseDocument>(
      userId,
      DatabaseCollection.USER_OPEN_POSITIONS,
      userOpenPositionSchema,
    );

    return new UserOpenPositions(collection, userId);
  }


  // Implementation
  async getOpenPosition(botId: string): Promise<OpenPositionsDatabaseDocument | null> {
    const foundPosition = await this.collection.findOne({ botId });

    return foundPosition ? foundPosition.toObject() : null;
  }

  async createOpenPosition(
    position: CreationDocument<OpenPositionsDatabaseDocument>
  ): Promise<OpenPositionsDatabaseDocument> {
    const createdPosition = await this.collection.create(position);

    return createdPosition.toObject();
  }

  async updateOpenPosition(id: string, updates: OpenPositionUpdatePayload['updates']): Promise<void> {
    await this.collection.updateOne({ _id: id }, updates);
  }

  async deleteOpenPosition(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: id });
  }
}
