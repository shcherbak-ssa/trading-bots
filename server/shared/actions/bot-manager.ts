import type { Bot, BrokerApiKeys, OnlyIdPayload } from 'global/types';

import type { BotsDatabaseCollection, DeactivateBotPayload, UsersDatabaseCollection, UsersDatabaseDocument } from 'shared/types';
import { ActionType } from 'shared/constants';
import { runAction } from 'shared/actions';

import type { BotSettings } from 'modules/bot/types';
import { BotManager } from 'modules/bot';

import { AppUsers } from 'api/database/app-users';
import { UserBots } from 'api/database/user-bots';


export const botManagerActions = {
  async [ActionType.BOT_MANAGER_SETUP_ACTIVE_BOTS](): Promise<number> {
    const appUsersCollection: UsersDatabaseCollection = await AppUsers.connect();
    const users: UsersDatabaseDocument[] = await appUsersCollection.getUsers();

    let activateBotsCount: number = 0;

    for (const { id: userId } of users) {
      const botsCollection: BotsDatabaseCollection = await UserBots.connect(userId);
      const activeBots: Bot[] = await botsCollection.getBots({ active: true });

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

    const botSettings: BotSettings = {
      brokerApiKeys,
      ...bot,
    };

    await BotManager.createBot(botSettings);
  },

  async [ActionType.BOT_MANAGER_DEACTIVATE_BOT](userId: string, { botToken }: DeactivateBotPayload): Promise<void> {
    await BotManager.deleteBot(botToken);
  },
};
