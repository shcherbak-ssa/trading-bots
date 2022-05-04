import { BOT_TOKEN_SEPARATOR } from 'global/constants';

import type {
  NewOpenPosition,
  OpenPosition,
  OpenPositionDeletePayload,
  OpenPositionUpdatePayload,
  OpenPositionCheckClosePayload
} from 'shared/types';

import { ActionType } from 'shared/constants';

import { runAction } from 'services/actions';

import type { BotPosition } from './types';
import type { Bot } from './bot';
import { BotErrorPlace } from './constants';
import { BotManager } from './bot-manager';


export class BotEvents {
  static async processPositionOpen(botToken: string, position: BotPosition): Promise<void> {
    const [ userId, botId ] = botToken.split(BOT_TOKEN_SEPARATOR);
    const { id, ...newPosition } = position;

    const openPosition = await runAction<NewOpenPosition, OpenPosition>({
      type: ActionType.OPEN_POSITIONS_CREATE,
      userId,
      payload: { botId, ...newPosition },
    });

    position.id = openPosition.id;

    console.info(` - info: [bot event] open position - ${JSON.stringify(position)}`);
  }

  static async processPositionUpdate(botToken: string, position: BotPosition): Promise<void> {
    const [ userId ] = botToken.split(BOT_TOKEN_SEPARATOR);
    const { id, stopLossPrice } = position;

    await runAction<OpenPositionUpdatePayload, void>({
      type: ActionType.OPEN_POSITIONS_UPDATE,
      userId,
      payload: { id, updates: { stopLossPrice } },
    });

    console.info(` - info: [bot event] update position - ${JSON.stringify(position)}`);
  }

  static async processPositionClose(botToken: string, position: BotPosition): Promise<void> {
    const bot: Bot = BotManager.getBot(botToken);
    const [ userId ] = botToken.split(BOT_TOKEN_SEPARATOR);

    await runAction<OpenPositionDeletePayload, void>({
      type: ActionType.OPEN_POSITIONS_DELETE,
      userId,
      payload: {
        position: { ...position, botId: bot.settings.id },
        bot: bot.settings,
      },
    });

    console.info(` - info: [bot event] close position - ${JSON.stringify(position)}`);
  }

  static async processError(botToken: string, errorPlace: BotErrorPlace, error: Error): Promise<void> {
    console.error(` - error: [bot event] ${errorPlace} - ${error.message}`);

    if (errorPlace === BotErrorPlace.MARKET_WS_ERROR || errorPlace === BotErrorPlace.MARKET_WS_CLOSE) {
      return await BotManager.restartBot(botToken);
    }

    if (errorPlace === BotErrorPlace.POSITION_CLOSE) {
      const botWorker: Bot = BotManager.getBot(botToken);
      const [ userId ] = botToken.split(BOT_TOKEN_SEPARATOR);

      if (botWorker.currentPosition) {
        const { brokerApiKeys, ...bot } = botWorker.settings;
        const position = { ...botWorker.currentPosition, botId: bot.id };

        const closedPositionsCount = await runAction<OpenPositionCheckClosePayload, number | null>({
          type: ActionType.OPEN_POSITIONS_CHECK_CLOSE,
          userId,
          payload: { bot,  brokerApiKeys,  position },
        });

        if (typeof closedPositionsCount === 'number') {
          if (closedPositionsCount !== position.brokerPositionIds.length) {
            // @TODO: notify user
          }
        }
      }
    }

    // @TODO: process errors
  }
}
