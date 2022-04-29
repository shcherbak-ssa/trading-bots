import type { BotSignal } from './types';
import type { Bot } from './bot';
import { BotManager } from './bot-manager';


export class BotInteraction {
  static async openPosition(signal: BotSignal): Promise<void> {
    const bot: Bot = BotManager.getBot(signal.botId);

    await bot.openPosition(signal);
  }

  static async updatePosition(signal: BotSignal): Promise<void> {
    const bot: Bot = BotManager.getBot(signal.botId);

    await bot.updateOpenPosition(signal);
  }

  static async closePosition(botId: string): Promise<void> {
    const bot: Bot = BotManager.getBot(botId);
    await bot.closeOpenPosition();
  }
}
