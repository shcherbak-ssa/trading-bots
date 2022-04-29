import { StatusCode } from 'global/constants';

import { ProcessError } from 'shared/exceptions';

import type { BotSettings } from './types';
import { Bot } from './bot';


export class BotManager {
  private static bots: Map<string, Bot> = new Map([]);


  static getBot(botToken: string): Bot {
    const bot: Bot | undefined = BotManager.bots.get(botToken);

    if (!bot) {
      throw new ProcessError(`Bot with token '${botToken}' does not exist`, StatusCode.BAD_REQUEST);
    }

    return bot;
  }

  static async createBot(setting: BotSettings): Promise<void> {
    if (BotManager.bots.has(setting.token)) {
      await BotManager.deleteBot(setting.token);
    }

    const createdBot: Bot = await Bot.create(setting);

    BotManager.bots.set(setting.token, createdBot);

    console.info(` - info: [bot manager] activate bot. Active bots - ${BotManager.bots.size}`);
  }

  static async deleteBot(botToken: string): Promise<void> {
    const bot: Bot = BotManager.getBot(botToken);

    await bot.closeOpenPosition();

    BotManager.bots.delete(botToken);

    console.info(` - info: [bot manager] deactivate bot. Active bots - ${BotManager.bots.size}`);
  }

  static async restartBot(id: string): Promise<void> {
    const { settings: botSettings }: Bot = BotManager.getBot(id);

    await BotManager.createBot(botSettings);
  }
}
