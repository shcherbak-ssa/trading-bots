import type {
  AnalyticsBotProgress,
  AnalyticsGetBotProgressPayload,
  Bot,
  BrokerApiKeys,
  OnlyIdPayload,
  UpdateBotPayload,
  User
} from 'global/types';

import { AnalyticsBotProgressType, BotDeactivateReason, BotUpdateType } from 'global/constants';

import type {
  CheckMaxLossBotPayload,
  DeactivateBotPayload,
  OpenPosition,
  OpenPositionCheckClosePayload,
  OpenPositionGetPayload,
  RestartBotPayload,
  Notification
} from 'shared/types';

import { ActionType, NotificationType } from 'shared/constants';
import { Helpers } from 'shared/helpers';

import { runAction } from 'services/actions';

import type { BotSettings } from 'modules/bot/types';
import { BotManager } from 'modules/bot';


export const botManagerActions = {
  async [ActionType.BOT_MANAGER_SETUP_ACTIVE_BOTS](): Promise<number> {
    const users: User[] = await Helpers.getAllUsers();

    let activateBotsCount: number = 0;

    for (const { id: userId } of users) {
      const activeBots: Bot[] = await Helpers.getActiveBots(userId);

      for (const activeBot of activeBots) {
        await runAction<Bot, void>({
          type: ActionType.BOT_MANAGER_ACTIVATE_BOT,
          userId,
          payload: activeBot,
        });

        activateBotsCount += 1;
      }
    }

    return activateBotsCount;
  },

  async [ActionType.BOT_MANAGER_ACTIVATE_BOT](userId: string, bot: Bot): Promise<void> {
    const brokerApiKeys = await runAction<OnlyIdPayload, BrokerApiKeys>({
      type: ActionType.BROKERS_GET_API_KEYS,
      userId,
      payload: { id: bot.brokerId },
    });

    let openPosition = await runAction<OpenPositionGetPayload, OpenPosition | null>({
      type: ActionType.OPEN_POSITIONS_GET,
      userId,
      payload: { botId: bot.id },
    });

    if (openPosition !== null) {
      const closedPositionsCount = await runAction<OpenPositionCheckClosePayload, number | null>({
        type: ActionType.OPEN_POSITIONS_CHECK_CLOSE,
        userId,
        payload: { bot, brokerApiKeys, position: openPosition },
      });

      if (typeof closedPositionsCount === 'number') {
        if (closedPositionsCount !== openPosition.brokerPositionIds.length) {
          await runAction<Notification, void>({
            type: ActionType.NOTIFICATIONS_NOTIFY_USER,
            userId,
            payload: {
              type: NotificationType.BOT_DEACTIVATION,
              bots: [ bot ],
              reason: `Unexpected error (not all positions are closed).`,
              message: `You most likely have open positions. Please, close positions manually before bot reactivation.`,
            },
          });
        }

        openPosition = null;
      }
    }

    const botSettings: BotSettings = { ...bot, brokerApiKeys };

    await BotManager.activateBot(botSettings, openPosition);
  },

  async [ActionType.BOT_MANAGER_DEACTIVATE_BOT](userId: string, { botToken }: DeactivateBotPayload): Promise<void> {
    await BotManager.deactivateBot(botToken);
  },

  async [ActionType.BOT_MANAGER_RESTART_BOT](userId: string, { bot, closePosition }: RestartBotPayload): Promise<void> {
    if (closePosition) {
      await BotManager.deactivateBot(bot.token);
    }

    await runAction<Bot, void>({
      type: ActionType.BOT_MANAGER_ACTIVATE_BOT,
      userId,
      payload: bot,
    });
  },

  async [ActionType.BOT_MANAGER_CHECK_MAX_LOSS](userId: string, { bot }: CheckMaxLossBotPayload): Promise<void> {
    const [ currentProgress ] = await runAction<AnalyticsGetBotProgressPayload, AnalyticsBotProgress[]>({
      type: ActionType.ANALYTICS_GET_BOT_PROGRESS,
      userId,
      payload: { bot, type: AnalyticsBotProgressType.CURRENT },
    });

    const { changePercent } = currentProgress;

    if (changePercent < 0 && Math.round(Math.abs(changePercent)) >= bot.tradeMaxLossPercent) {
      await runAction<UpdateBotPayload, void>({
        type: ActionType.BOTS_UPDATE,
        userId,
        payload: {
          id: bot.id,
          type: BotUpdateType.DEACTIVATE,
          updates: { deactivateReason: BotDeactivateReason.MAX_LOSS },
        },
      });

      await runAction<Notification, void>({
        type: ActionType.NOTIFICATIONS_NOTIFY_USER,
        userId,
        payload: {
          type: NotificationType.BOT_DEACTIVATION,
          bots: [ bot ],
          reason: 'Reason: Max loss.',
          message: '',
        },
      });
    }
  },
};
