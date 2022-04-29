import type { Bot, BotClientInfo, BrokerAccount, GetBrokerDataPayload, NewBot, UpdateBotPayload } from 'global/types';

import { BotState, BotUpdateType, BrokerDataType } from 'global/constants';

import type {
  BotsDatabaseCollection,
  BotsDatabaseDocument,
  BotsDeleteFilters,
  BotsGetFilters,
  DeactivateBotPayload
} from 'shared/types';

import { ActionType } from 'shared/constants';
import { runAction } from 'shared/actions';
import { getTodayDateString, getTotalActivateTime } from 'shared/utils';

import { UserBots } from 'api/database/user-bots';


export const botsActions = {
  async [ActionType.BOTS_LOAD](userId: string, filters: BotsGetFilters): Promise<BotClientInfo[]> {
    const botsCollection: BotsDatabaseCollection = await UserBots.connect(userId);
    const bots: BotsDatabaseDocument[] = await botsCollection.getBots(filters);

    const brokerAccounts = await Promise.all(
      bots.map(async ({ brokerId, brokerAccountId, brokerAccountType }) => {
        return runAction<GetBrokerDataPayload, BrokerAccount>({
          type: ActionType.BROKERS_GET_ACCOUNT,
          userId,
          payload: {
            id: brokerId,
            dataType: BrokerDataType.ACCOUNT,
            accountType: brokerAccountType,
            accountId: brokerAccountId,
          },
        });
      })
    );

    return bots.map((bot, index) => {
      return { ...bot, brokerAccount: brokerAccounts[index] };
    });
  },

  async [ActionType.BOTS_CREATE](userId: string, newBot: NewBot): Promise<BotClientInfo> {
    const botsCollection: BotsDatabaseCollection = await UserBots.connect(userId);

    const brokerAccount = await runAction<GetBrokerDataPayload, BrokerAccount>({
      type: ActionType.BROKERS_GET_ACCOUNT,
      userId,
      payload: {
        id: newBot.brokerId,
        dataType: BrokerDataType.ACCOUNT,
        accountType: newBot.brokerAccountType,
        accountId: newBot.brokerAccountId,
      },
    });

    const today: string = getTodayDateString();

    const createdBot: BotsDatabaseDocument = await botsCollection.createBot({
      ...newBot,
      token: userId,
      activateAt: newBot.active ? today : '',
      activeTotalTime: 0,
      createdAt: today,
      state: BotState.ALIVE,
      initialCapital: newBot.active ? brokerAccount.amount : 0,
    });

    if (createdBot.active) {
      await runAction<Bot, void>({
        type: ActionType.BOT_MANAGER_ACTIVATE_BOT,
        userId,
        payload: createdBot,
      });
    }

    return { ...createdBot, brokerAccount };
  },

  async [ActionType.BOTS_UPDATE](userId: string, { id, type, updates }: UpdateBotPayload): Promise<void> {
    const botsCollection: BotsDatabaseCollection = await UserBots.connect(userId);
    const currentBot: BotsDatabaseDocument = await botsCollection.getBot(id);

    const brokerAccount = await runAction<GetBrokerDataPayload, BrokerAccount>({
      type: ActionType.BROKERS_GET_ACCOUNT,
      userId,
      payload: {
        id: currentBot.brokerId,
        dataType: BrokerDataType.ACCOUNT,
        accountType: currentBot.brokerAccountType,
        accountId: currentBot.brokerAccountId,
      },
    });

    const today: string = getTodayDateString();

    switch (type) {
      case BotUpdateType.ACTIVATE:
        await runAction<Bot, void>({
          type: ActionType.BOT_MANAGER_ACTIVATE_BOT,
          userId,
          payload: { ...currentBot, initialCapital: brokerAccount.amount },
        });

        await botsCollection.updateBot(id, {
          active: true,
          activateAt: today,
          initialCapital: brokerAccount.amount
        });

        return;
      case BotUpdateType.DEACTIVATE:
        await runAction<DeactivateBotPayload, void>({
          type: ActionType.BOT_MANAGER_DEACTIVATE_BOT,
          userId,
          payload: { botToken: currentBot.token },
        });

        await botsCollection.updateBot(id, {
          active: false,
          activateAt: '',
          activeTotalTime: getTotalActivateTime(currentBot),
          initialCapital: 0,
        });

        return;
      case BotUpdateType.ARCHIVE:
        if (currentBot.active) {
          await runAction<DeactivateBotPayload, void>({
            type: ActionType.BOT_MANAGER_DEACTIVATE_BOT,
            userId,
            payload: { botToken: currentBot.token },
          });
        }

        await botsCollection.updateBot(id, {
          active: false,
          activateAt: '',
          activeTotalTime: currentBot.active ? getTotalActivateTime(currentBot) : currentBot.activeTotalTime,
          state: BotState.ARCHIVE,
          initialCapital: 0,
        });

        return;
      case BotUpdateType.UPDATE:
        await botsCollection.updateBot(id, {
          ...updates,
          activateAt: currentBot.active ? today : '',
          activeTotalTime: currentBot.active ? getTotalActivateTime(currentBot) : currentBot.activeTotalTime,
          initialCapital: currentBot.active ? brokerAccount.amount : 0,
        });

        const updatedBot: BotsDatabaseDocument = await botsCollection.getBot(id);

        if (updatedBot.active) {
          await runAction<Bot, void>({
            type: ActionType.BOT_MANAGER_ACTIVATE_BOT,
            userId,
            payload: updatedBot,
          });
        }
    }
  },

  async [ActionType.BOTS_DELETE](userId: string, filters: BotsDeleteFilters): Promise<void> {
    const botsCollection: BotsDatabaseCollection = await UserBots.connect(userId);

    if (filters.brokerId) {
      const bots: BotsDatabaseDocument[] = await botsCollection.getBots(filters);

      for (const bot of bots) {
        if (bot.active) {
          await runAction<DeactivateBotPayload, void>({
            type: ActionType.BOT_MANAGER_DEACTIVATE_BOT,
            userId,
            payload: { botToken: bot.token },
          });
        }
      }
    }

    await botsCollection.deleteBots(filters);
  },
};
