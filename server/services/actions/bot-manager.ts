import type { Bot, BrokerApiKeys, OnlyIdPayload } from 'global/types';

import type {
  BotsGetFilters,
  DeactivateBotPayload,
  OpenPosition,
  OpenPositionGetPayload,
  UsersDatabaseDocument,
  RestartBotPayload, BrokersPositionsApi,
  OpenPositionDeletePayload
} from 'shared/types';

import { ActionType } from 'shared/constants';

import { runAction } from 'services/actions';

import type { BotSettings } from 'modules/bot/types';
import { BotManager } from 'modules/bot';

import { BrokersPositions } from 'api/brokers/brokers-positions';


const brokersPositionsApi: BrokersPositionsApi = new BrokersPositions();


export const botManagerActions = {
  async [ActionType.BOT_MANAGER_SETUP_ACTIVE_BOTS](): Promise<number> {
    const users: UsersDatabaseDocument[] = await runAction({
      type: ActionType.USERS_GET,
      userId: '',
      payload: {},
    });

    let activateBotsCount: number = 0;

    for (const { id: userId } of users) {
      const activeBots = await runAction<BotsGetFilters, Bot[]>({
        type: ActionType.BOTS_GET,
        userId,
        payload: { active: true, withBrokerAccount: false },
      });

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
      const checkResult: number | null = await brokersPositionsApi.checkPositionClose({
        accountType: bot.brokerAccountType,
        apiKeys: brokerApiKeys,
        brokerName: bot.brokerName,
        position: openPosition,
      });

      if (typeof checkResult === 'number') {
        await runAction<OpenPositionDeletePayload, void>({
          type: ActionType.OPEN_POSITIONS_DELETE,
          userId,
          payload: {
            bot,
            success: true,
            position: openPosition,
          },
        });

        if (checkResult !== openPosition.brokerPositionIds.length) {
          // @TODO: notify user
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
};
