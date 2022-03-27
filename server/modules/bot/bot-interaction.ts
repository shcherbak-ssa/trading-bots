import type { BotSignal } from 'modules/bot/types';
import { ProcessError } from 'shared/exceptions';
import { StatusCode } from 'global/constants';

import type { Bot } from './bot';
import { BotManager } from './bot-manager';


export class BotInteraction {
  static async openPosition(signal: BotSignal): Promise<void> {
    const bot: Bot = BotManager.getBot(signal.botId);

    BotInteraction.checkSignal(bot, signal);
    await bot.openPosition(signal);
  }

  static async updatePosition(signal: BotSignal): Promise<void> {
    const bot: Bot = BotManager.getBot(signal.botId);

    BotInteraction.checkSignal(bot, signal);
    await bot.updateOpenPosition(signal);
  }

  static async closePosition(botId: string): Promise<void> {
    const bot: Bot = BotManager.getBot(botId);
    await bot.closeOpenPosition();
  }


  // Helpers
  private static checkSignal({ broker: botBroker }: Bot, { brokerName, marketSymbol }: BotSignal): void {
    if (!botBroker.isCorrectBroker(brokerName)) {
      throw new ProcessError(
        `Incorrect Broker - expected ${botBroker.name}, actual ${brokerName}`,
        StatusCode.BAD_REQUEST,
      );
    }

    if (!botBroker.market.isCorrectSymbol(marketSymbol)) {
      throw new ProcessError(
        `Incorrect Symbol - expected ${botBroker.market.symbol}, actual ${marketSymbol}`,
        StatusCode.BAD_REQUEST,
      );
    }
  }
}
