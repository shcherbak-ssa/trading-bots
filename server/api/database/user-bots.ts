import mongoose from 'mongoose';

import type { UpdateBotPayload } from 'global/types';

import type {
  BotsDatabaseCollection,
  BotsDatabaseDocument,
  BotsDeleteFilters,
  BotsGetFilters,
  CreationDocument
} from 'shared/types';

import { DatabaseCollection } from 'shared/constants';

import { UserCollection } from './lib/user-collection';
import { AppError } from 'shared/exceptions';
import { StatusCode } from 'global/constants';


const userBotSchema = new mongoose.Schema<BotsDatabaseDocument>({
  name: { type: String, required: true },
  active: { type: Boolean, required: true },
  createdAt: { type: String, required: true },
  state: { type: String, required: true },
  brokerId: { type: String, required: true },
  brokerName: { type: String, required: true },
  brokerAccountId: { type: String, required: true },
  brokerAccountType: { type: String, required: true },
  brokerAccountCurrency: { type: String, required: true },
  brokerMarketSymbol: { type: String, required: true },
  brokerMarketName: { type: String, required: true },
  tradeRiskPercent: { type: Number, required: true },
  tradeMaxLossPercent: { type: Number, required: true },
  tradeCapitalPercent: { type: Number, required: true },
  tradeWithTakeProfit: { type: Boolean, required: true },
  tradeTakeProfitPL: { type: Number, required: true },
  tradeWithCustomMarketLeverage: { type: Boolean, required: true },
  tradeMarketLeverage: { type: Number, required: true },
  tradeCloseAtEndDay: { type: Boolean, required: true },
  tradeCloseAtEndWeek: { type: Boolean, required: true },
});


export class UserBots extends UserCollection<BotsDatabaseDocument> implements BotsDatabaseCollection {
  static async connect(userId: string): Promise<BotsDatabaseCollection> {
    const collection = await UserBots.connectCollection<BotsDatabaseDocument>(
      userId,
      DatabaseCollection.USER_BOTS,
      userBotSchema,
    );

    return new UserBots(collection);
  }


  // Implementation
  async getBots(filters: BotsGetFilters): Promise<BotsDatabaseDocument[]> {
    const bots = await this.collection.find(filters);

    return bots.map((bot) => bot.toObject());
  }

  async createBot(newBot: CreationDocument<BotsDatabaseDocument>): Promise<BotsDatabaseDocument> {
    const createdBot = await this.collection.create({ ...newBot });

    return createdBot.toObject();
  }

  async updateBot(id: string, updates: UpdateBotPayload['updates']): Promise<BotsDatabaseDocument> {
    const foundBot = await this.collection.findOneAndUpdate({ _id: id }, updates, { returnDocument: 'after' });

    if (foundBot) {
      return foundBot.toObject();
    }

    throw new AppError(StatusCode.NOT_FOUND, {
      message: `Cannot found bot (${id}) for update`,
    });
  }

  async deleteBots(filters: BotsDeleteFilters): Promise<void> {
    if (filters.id) {
      await this.collection.deleteOne(({ _id: filters.id }));

      return;
    }

    await this.collection.deleteMany(filters);
  }
}
