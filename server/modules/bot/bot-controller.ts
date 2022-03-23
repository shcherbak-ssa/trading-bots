import { BotError } from 'shared/exceptions';

import type { BotEventPayload, BotPosition, BotSettings, BotSignal } from './types';
import { AliveBotErrorPlace, BotEvent } from './constants';
import { Bot } from './bot';


class BotController {
  private bots: Map<string, Bot> = new Map([]);


  async processEvent(event: BotEvent, payload: BotEventPayload): Promise<void> {
    try {
      if (event === BotEvent.CREATE) {
        return await this.createNewBot(payload as BotSettings);
      }

      const botId: string = typeof payload === 'string' ? payload : (payload as BotSignal).botId;
      const bot: Bot = this.getBot(botId);

      switch (event) {
        case BotEvent.PROCESS_SIGNAL:
          return await bot.processSignal(payload as BotSignal);
        case BotEvent.UPDATE_POSITION:
          return await bot.updateOpenPosition(payload as BotSignal);
        case BotEvent.CLOSE_POSITION:
          return await bot.closeOpenPosition();
      }
    } catch (err: any) {
      console.error(err);
    }
  }

  processPositionClosing(botId: string, position: BotPosition): void {}

  async processAliveBotError(botId: string, errorPlace: AliveBotErrorPlace, message: string): Promise<void> {
    if (BotController.isNeedToRestartBot(errorPlace)) {
      return await this.restartBot(botId);
    }
  }


  private async createNewBot(settings: BotSettings): Promise<void> {
    const newBot: Bot = await Bot.create(settings);

    this.bots.set(settings.id, newBot);
  }

  private async restartBot(botId: string): Promise<void> {
    const bot: Bot | undefined = this.bots.get(botId);

    if (!bot) return;

    await bot.closeOpenPosition();

    await this.processEvent(BotEvent.CREATE, bot.settings);
  }


  // Helpers
  private getBot(botId: string): Bot {
    const bot: Bot | undefined = this.bots.get(botId);

    if (!bot) {
      throw new BotError(`Bot with id '${botId}' does not exist.`);
    }

    return bot;
  }

  private static isNeedToRestartBot(errorPlace: AliveBotErrorPlace): boolean {
    switch (errorPlace) {
      case AliveBotErrorPlace.ACCOUNT_AMOUNT_UPDATE:
      case AliveBotErrorPlace.MARKET_WS_CLOSE:
      case AliveBotErrorPlace.MARKET_WS_ERROR:
        return true;
      case AliveBotErrorPlace.POSITION_CLOSE:
        return false;
      default:
        return false;
    }
  }
}


export const botController = new BotController();
