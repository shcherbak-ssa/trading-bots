import type { BotPosition } from './types';
import { AliveBotErrorPlace } from './constants';
import { BotManager } from './bot-manager';


export class BotEvents {
  static async processPositionClosing(botId: string, position: BotPosition): Promise<void> {
    throw new Error('Not implemented');
  }

  static async processAliveError(botId: string, errorPlace: AliveBotErrorPlace, message: string): Promise<void> {
    if (BotEvents.isNeedToRestartBot(errorPlace)) {
      return await BotManager.restartBot(botId);
    }

    throw new Error('Not implemented');
  }


  // Helpers
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
