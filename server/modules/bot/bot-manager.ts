import type { OpenPosition } from 'shared/types';
import { BotError } from 'shared/exceptions';

import type { BotSettings } from './types';
import { BotErrorPlace } from './constants';
import { Bot } from './bot';
import { BotEvents } from './bot-events';


export class BotManager {
  private static bots: Map<string, Bot> = new Map([]);


  static getBot(botToken: string): Bot {
    const bot: Bot | undefined = BotManager.bots.get(botToken);

    if (!bot) {
      throw new BotError(`Bot with token '${botToken}' does not exist`);
    }

    return bot;
  }

  // @TODO: from parameter
  static async activateBot(setting: BotSettings, openPosition: OpenPosition | null): Promise<void> {
    try {
      const createdBot: Bot = await Bot.create(setting);

      if (openPosition !== null) {
        createdBot.setCurrentPosition(openPosition);
      }

      BotManager.bots.set(setting.token, createdBot);

      console.info(` - info: [bot manager] activate bot. Active bots - ${BotManager.bots.size}`);
    } catch (e: any) {
      await BotEvents.processError(setting.token, BotErrorPlace.BOT_CREATE, e);

      throw e;
    }
  }

  static async deactivateBot(botToken: string): Promise<void> {
    const bot: Bot = BotManager.getBot(botToken);

    await bot.closeOpenPosition();

    BotManager.bots.delete(botToken);

    console.info(` - info: [bot manager] deactivate bot. Active bots - ${BotManager.bots.size}`);
  }

  static async restartBot(botToken: string): Promise<void> {
    const bot: Bot = BotManager.getBot(botToken);

    await BotManager.deactivateBot(botToken);
    await BotManager.activateBot(bot.settings, null);
  }
}
