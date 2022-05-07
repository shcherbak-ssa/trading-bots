import mongoose from 'mongoose';

import type { UpdateBotPayload } from 'global/types';
import { BOT_TOKEN_SEPARATOR } from 'global/constants';

import type {
  BotsDatabaseCollection,
  BotsDatabaseDocument,
  BotsDeleteFilters,
  BotsGetFilters,
  CreationDocument
} from 'shared/types';

import { DatabaseCollection } from 'shared/constants';
import { ApiError } from 'shared/exceptions';

import { UserCollection } from './lib/user-collection';


const userBotSchema = new mongoose.Schema<BotsDatabaseDocument>({
  name: { type: String, required: true },
  token: { type: String, required: true },
  initialCapital: { type: Number, required: true },
  active: { type: Boolean, required: true },
  activateAt: { type: String, default: '' },
  activations: [{ initialCapital: Number, start: String, end: String }],
  deactivateReason: { type: String },
  deactivateAt: { type: String, default: '' },
  archivedAt: { type: String, default: '' },
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
  tradeCustomMarketLeverage: { type: Number, required: true },
  positionCloseEnable: { type: Boolean, required: true },
  positionCloseMode: { type: String, required: true },
  restartEnable: { type: Boolean, required: true },
  restartMode: { type: String, required: true },
});


export class UserBots extends UserCollection<BotsDatabaseDocument> implements BotsDatabaseCollection {
  static async connect(userId: string): Promise<BotsDatabaseCollection> {
    const collection = await UserBots.connectCollection<BotsDatabaseDocument>(
      userId,
      DatabaseCollection.USER_BOTS,
      userBotSchema,
    );

    return new UserBots(collection, userId);
  }


  // Implementation
  async getBot(botId: string): Promise<BotsDatabaseDocument> {
    const bot = await this.collection.findOne({ _id: botId });

    if (!bot) {
      throw new ApiError({
        message: `Cannot found bot (${botId})`,
        messageHeading: 'Database',
        idLabel: 'user',
        id: this.userId,
        payload: { botId },
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

    // @TODO: refactor
    const botToken: string = createdBot.token + BOT_TOKEN_SEPARATOR + createdBot.id;

    const updatedBot
      = await this.collection.findOneAndUpdate({ _id: createdBot.id }, { token: botToken }, { returnDocument: 'after' });

    if (updatedBot) {
      return updatedBot.toObject();
    }

    throw new ApiError({
      message: `Something went wrong with bot creation`,
      messageHeading: 'Database',
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
