import mongoose from 'mongoose';

import type { UpdateBotPayload } from 'global/types';
import { BOT_TOKEN_SEPARATOR, StatusCode } from 'global/constants';

import type {
  BotsDatabaseCollection,
  BotsDatabaseDocument,
  BotsDeleteFilters,
  BotsGetFilters,
  CreationDocument
} from 'shared/types';

import { DatabaseCollection } from 'shared/constants';
import { AppError } from 'shared/exceptions';

import { UserCollection } from './lib/user-collection';


const userBotSchema = new mongoose.Schema<BotsDatabaseDocument>({
  name: { type: String, required: true },
  token: { type: String, required: true },
  initialCapital: { type: Number, required: true },
  active: { type: Boolean, required: true },
  activateAt: { type: String, default: '' },
  activations: [{ initialCapital: Number, start: String, end: String }],
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
  async getBot(botId: string): Promise<BotsDatabaseDocument> {
    const bot = await this.collection.findOne({ _id: botId });

    if (!bot) {
      console.error(` - error: [database] cannot found bot with id '${botId}'`);

      throw new AppError(StatusCode.BAD_REQUEST, {
        message: `Cannot found bot with id '${botId}'`,
      });
    }

    return bot.toObject();
  }

  async getBots(filters: BotsGetFilters): Promise<BotsDatabaseDocument[]> {
    const bots = await this.collection.find(filters);

    return bots.map((bot) => bot.toObject());
  }

  async createBot(newBot: CreationDocument<BotsDatabaseDocument>): Promise<BotsDatabaseDocument> {
    const createdBot = await this.collection.create({ ...newBot });

    const botToken: string = createdBot.token + BOT_TOKEN_SEPARATOR + createdBot.id;

    const updatedBot
      = await this.collection.findOneAndUpdate({ _id: createdBot.id }, { token: botToken }, { returnDocument: 'after' });

    if (updatedBot) {
      return updatedBot.toObject();
    }

    throw new AppError(StatusCode.INTERNAL_SERVER_ERROR, {
      message: `Something went wrong with bot creation`,
    });
  }

  async updateBot(id: string, updates: UpdateBotPayload['updates']): Promise<void> {
    const { activation, ...simpleUpdates } = updates;

    await this.collection.updateOne({ _id: id }, simpleUpdates);

    if (activation) {
      await this.collection.updateOne({ _id: id }, { $push: { activations: activation } });
    }
  }

  async deleteBots(filters: BotsDeleteFilters): Promise<void> {
    if (filters.id) {
      await this.collection.deleteOne(({ _id: filters.id }));

      return;
    }

    await this.collection.deleteMany(filters);
  }
}
