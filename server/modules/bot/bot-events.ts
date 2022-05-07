import type { UpdateBotPayload } from 'global/types';
import { BOT_TOKEN_SEPARATOR, BotDeactivateReason, BotUpdateType } from 'global/constants';

import type {
  NewOpenPosition,
  OpenPosition,
  OpenPositionDeletePayload,
  OpenPositionUpdatePayload,
  Notification
} from 'shared/types';

import { ActionType, LogScope, NotificationType } from 'shared/constants';
import { logger } from 'shared/logger';

import { runAction } from 'services/actions';

import type { BotPosition } from './types';
import type { Bot } from './bot';
import type { BotErrorPlace } from './constants';
import { BotManager } from './bot-manager';


export class BotEvents {
  static async processPositionOpen(botToken: string, position: BotPosition): Promise<void> {
    const { settings: botSettings }: Bot = BotManager.getBot(botToken);
    const [ userId, botId ] = botToken.split(BOT_TOKEN_SEPARATOR);
    const { id, ...newPosition } = position;

    const openPosition = await runAction<NewOpenPosition, OpenPosition>({
      type: ActionType.OPEN_POSITIONS_CREATE,
      userId,
      payload: { botId, ...newPosition },
    });

    position.id = openPosition.id;

    await runAction<Notification, void>({
      type: ActionType.NOTIFICATIONS_NOTIFY_USER,
      userId,
      payload: {
        type: NotificationType.POSITION_OPEN,
        bot: botSettings,
        position,
      },
    });

    logger.logInfo(LogScope.BOT, {
      message: 'open position',
      messageHeading: 'Bot Events',
      idLabel: 'token',
      id: botToken,
      payload: position,
    });
  }

  static async processPositionUpdate(botToken: string, position: BotPosition): Promise<void> {
    const { settings: botSettings }: Bot = BotManager.getBot(botToken);
    const [ userId ] = botToken.split(BOT_TOKEN_SEPARATOR);
    const { id, stopLossPrice } = position;

    await runAction<OpenPositionUpdatePayload, void>({
      type: ActionType.OPEN_POSITIONS_UPDATE,
      userId,
      payload: { id, updates: { stopLossPrice } },
    });

    await runAction<Notification, void>({
      type: ActionType.NOTIFICATIONS_NOTIFY_USER,
      userId,
      payload: {
        type: NotificationType.POSITION_UPDATE,
        bot: botSettings,
        position,
      },
    });

    logger.logInfo(LogScope.BOT, {
      message: 'update position',
      messageHeading: 'Bot Events',
      idLabel: 'token',
      id: botToken,
      payload: position,
    });
  }

  static async processPositionClose(botToken: string, position: BotPosition): Promise<void> {
    const { settings: botSettings }: Bot = BotManager.getBot(botToken);
    const [ userId ] = botToken.split(BOT_TOKEN_SEPARATOR);

    await runAction<OpenPositionDeletePayload, void>({
      type: ActionType.OPEN_POSITIONS_DELETE,
      userId,
      payload: {
        position: { ...position, botId: botSettings.id },
        bot: botSettings,
      },
    });

    await runAction<Notification, void>({
      type: ActionType.NOTIFICATIONS_NOTIFY_USER,
      userId,
      payload: {
        type: NotificationType.POSITION_CLOSE,
        bot: botSettings,
        position,
      },
    });

    logger.logInfo(LogScope.BOT, {
      message: 'close position',
      messageHeading: 'Bot Events',
      idLabel: 'token',
      id: botToken,
      payload: position,
    });
  }

  static async processError(botToken: string, errorPlace: BotErrorPlace, error: any): Promise<void> {
    logger.logError(LogScope.BOT, {
      message: `${errorPlace} ${error.message}`,
      messageHeading: `Bot Events`,
      idLabel: `token`,
      id: botToken,
    });

    const bot: Bot = BotManager.getBot(botToken);

    const { settings: botSettings, currentPosition } = bot;
    const [ userId, botId ] = botToken.split(BOT_TOKEN_SEPARATOR);

    const position: BotPosition | null = currentPosition;

    if (position) {
      await runAction<OpenPositionDeletePayload, void>({
        type: ActionType.OPEN_POSITIONS_DELETE,
        userId,
        payload: {
          position: { ...position, botId: botSettings.id },
          bot: botSettings,
        },
      });

      bot.setCurrentPosition(null);
    }

    await runAction<UpdateBotPayload, void>({
      type: ActionType.BOTS_UPDATE,
      userId,
      payload: {
        id: botId,
        type: BotUpdateType.DEACTIVATE,
        updates: { deactivateReason: BotDeactivateReason.INTERNAL_ERROR },
      },
    });

    await runAction<Notification, void>({
      type: ActionType.NOTIFICATIONS_NOTIFY_USER,
      userId,
      payload: {
        type: NotificationType.BOT_DEACTIVATION,
        bot: botSettings,
        reason: `Broker API error (${errorPlace}).`,
        message: (
          position ? 'You have open position. Please, close position manually before bot reactivation.' : ''
        ),
      },
    });

    error.notified = true;

    throw error;
  }
}
