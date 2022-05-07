import type { UpdateBotPayload } from 'global/types';
import { BOT_TOKEN_SEPARATOR, BotDeactivateReason, BotUpdateType } from 'global/constants';

import type {
  NewOpenPosition,
  OpenPosition,
  OpenPositionCheckClosePayload,
  OpenPositionDeletePayload,
  OpenPositionUpdatePayload,
  RestartBotPayload
} from 'shared/types';

import { ActionType, LogScope } from 'shared/constants';
import { logger } from 'shared/logger';

import { runAction } from 'services/actions';

import type { BotPosition } from './types';
import type { Bot } from './bot';
import { BotErrorPlace, RESTART_BOT_COUNT_LIMIT } from './constants';
import { BotManager } from './bot-manager';


export class BotEvents {
  static restartCounts: Map<string, number> = new Map([]);

  static async processPositionOpen(botToken: string, position: BotPosition): Promise<void> {
    const [ userId, botId ] = botToken.split(BOT_TOKEN_SEPARATOR);
    const { id, ...newPosition } = position;

    const openPosition = await runAction<NewOpenPosition, OpenPosition>({
      type: ActionType.OPEN_POSITIONS_CREATE,
      userId,
      payload: { botId, ...newPosition },
    });

    position.id = openPosition.id;

    logger.logInfo(LogScope.BOT, {
      message: 'open position',
      messageLabel: 'Bot Events',
      idLabel: 'token',
      id: botToken,
      payload: position,
    });
  }

  static async processPositionUpdate(botToken: string, position: BotPosition): Promise<void> {
    const [ userId ] = botToken.split(BOT_TOKEN_SEPARATOR);
    const { id, stopLossPrice } = position;

    await runAction<OpenPositionUpdatePayload, void>({
      type: ActionType.OPEN_POSITIONS_UPDATE,
      userId,
      payload: { id, updates: { stopLossPrice } },
    });

    logger.logInfo(LogScope.BOT, {
      message: 'update position',
      messageLabel: 'Bot Events',
      idLabel: 'token',
      id: botToken,
      payload: position,
    });
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

    logger.logInfo(LogScope.BOT, {
      message: 'close position',
      messageLabel: 'Bot Events',
      idLabel: 'token',
      id: botToken,
      payload: position,
    });
  }

  static async processError(
    botToken: string,
    errorPlace: BotErrorPlace,
    error: Error,
    openPosition?: BotPosition
  ): Promise<void> {
    logger.logError(LogScope.BOT, {
      message: `${errorPlace} ${error.message}`,
      messageLabel: `Bot Events`,
      idLabel: `token`,
      id: botToken,
    });

    const botWorker: Bot = BotManager.getBot(botToken);
    const [ userId, botId ] = botToken.split(BOT_TOKEN_SEPARATOR);

    if (BotEvents.needToRestart(errorPlace)) {
      const restartCount: number = BotEvents.restartCounts.get(botToken) || 0;

      if (restartCount === RESTART_BOT_COUNT_LIMIT) {
        await runAction<UpdateBotPayload, void>({
          type: ActionType.BOTS_UPDATE,
          userId,
          payload: {
            id: botId,
            type: BotUpdateType.DEACTIVATE,
            updates: { deactivateReason: BotDeactivateReason.RESTART_LIMIT },
          },
        });

        // @TODO: notify user
      } else {
        await runAction<RestartBotPayload, void>({
          type: ActionType.BOT_MANAGER_RESTART_BOT,
          userId,
          payload: {
            bot: botWorker.settings,
            closePosition: false,
          },
        });

        BotEvents.restartCounts.set(botToken, restartCount + 1);

        // @TODO: notify user
      }
    }

    if (errorPlace === BotErrorPlace.POSITION_CLOSE && openPosition) {
      const { brokerApiKeys, ...bot } = botWorker.settings;
      const position = { ...openPosition, botId: bot.id };

      const closedPositionsCount = await runAction<OpenPositionCheckClosePayload, number | null>({
        type: ActionType.OPEN_POSITIONS_CHECK_CLOSE,
        userId,
        payload: { bot, brokerApiKeys, position },
      });

      if (typeof closedPositionsCount === 'number') {
        if (closedPositionsCount !== position.brokerPositionIds.length) {
          // @TODO: notify user
        }
      }
    }

    throw error;
  }


  private static needToRestart(errorPlace: BotErrorPlace): boolean {
    switch (errorPlace) {
      case BotErrorPlace.ACCOUNT_AMOUNT_UPDATE:
      case BotErrorPlace.MARKET_WS_CLOSE:
      case BotErrorPlace.MARKET_WS_ERROR:
        return true;
      default:
        return false;
    }
  }
}
