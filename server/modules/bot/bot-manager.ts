import { StatusCode } from 'global/constants';
import { ProcessError } from 'shared/exceptions';

import type { BotSettings } from './types';
import { Bot } from './bot';


export class BotManager {
  private static bots: Map<string, Bot> = new Map([]);


  static getBot(botId: string): Bot {
    const bot: Bot | undefined = BotManager.bots.get(botId);

    if (!bot) {
      throw new ProcessError(`Bot with id '${botId}' does not exist`, StatusCode.BAD_REQUEST);
    }

    return bot;
  }

  static async createBot(setting: BotSettings): Promise<void> {
    const createdBot: Bot = await Bot.create(setting);

    BotManager.bots.set(setting.botId, createdBot);
  }

  static async updateBot(settings: BotSettings): Promise<void> {
    await BotManager.deleteBot(settings.botId);
    await BotManager.createBot(settings);
  }

  static async deleteBot(id: string): Promise<void> {
    const bot: Bot = BotManager.getBot(id);
    await bot.closeOpenPosition();

    BotManager.bots.delete(id);
  }

  static async restartBot(id: string): Promise<void> {
    const { settings: botSettings }: Bot = BotManager.getBot(id);
    await BotManager.updateBot(botSettings);
  }
}
