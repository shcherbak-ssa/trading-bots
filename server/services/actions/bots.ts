import type {
  Bot,
  BotActivation,
  BotClientInfo,
  BrokerAccount,
  GetBrokerDataPayload,
  NewBot,
  UpdateBotPayload
} from 'global/types';

import { BotState, BotUpdateType, BrokerDataType } from 'global/constants';

import type {
  BotsDatabaseCollection,
  BotsDatabaseDocument,
  BotsDeleteFilters,
  BotsGetFilters,
  DeactivateBotPayload,
  PositionDeleteFilters,
  RestartBotPayload
} from 'shared/types';

import { ActionType } from 'shared/constants';
import { getTodayDateString } from 'shared/utils';

import { runAction } from 'services/actions';

import { UserBots } from 'api/database/user-bots';


export const botsActions = {
  async [ActionType.BOTS_LOAD](userId: string, filters: BotsGetFilters): Promise<BotClientInfo[]> {
    const botsCollection: BotsDatabaseCollection = await UserBots.connect(userId);
    let bots: BotsDatabaseDocument[] = [];

    if (filters.id) {
      const bot: BotsDatabaseDocument = await botsCollection.getBot(filters.id);

      bots.push(bot);
    } else {
      bots = await botsCollection.getBots(filters);
    }

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

  async [ActionType.BOTS_GET](userId: string, filters: BotsGetFilters): Promise<Bot[]> {
    const botsCollection: BotsDatabaseCollection = await UserBots.connect(userId);

    return await botsCollection.getBots(filters);
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
      activations: [],
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

    const activation: BotActivation = {
      initialCapital: currentBot.initialCapital,
      start: currentBot.activateAt,
      end: today,
    };

    switch (type) {
      case BotUpdateType.ACTIVATE:
        updates = {
          active: true,
          activateAt: today,
          initialCapital: brokerAccount.amount,
        };

        await runAction<Bot, void>({
          type: ActionType.BOT_MANAGER_ACTIVATE_BOT,
          userId,
          payload: { ...currentBot, ...updates },
        });

        await botsCollection.updateBot(id, updates);

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
          activation,
          initialCapital: 0,
        });

        return;
      case BotUpdateType.ARCHIVE:
        updates = {
          active: false,
          activateAt: '',
          state: BotState.ARCHIVE,
          initialCapital: 0,
        };

        if (currentBot.active) {
          await runAction<DeactivateBotPayload, void>({
            type: ActionType.BOT_MANAGER_DEACTIVATE_BOT,
            userId,
            payload: { botToken: currentBot.token },
          });

          updates.activation = activation;
        }

        await botsCollection.updateBot(id, updates);

        return;
      case BotUpdateType.UPDATE:
        if (currentBot.active) {
          const needToUpdateActivation: boolean = updates.tradeCapitalPercent !== undefined;

          if (needToUpdateActivation) {
            updates.activateAt = today;
            updates.initialCapital = brokerAccount.amount;

            currentBot.activations.push(activation);
          }

          await runAction<RestartBotPayload, void>({
            type: ActionType.BOT_MANAGER_RESTART_BOT,
            userId,
            payload: {
              bot: { ...currentBot, ...updates },
              closePosition: needToUpdateActivation,
            },
          });

          if (needToUpdateActivation) {
            updates.activation = activation;
          }
        }

        await botsCollection.updateBot(id, updates);

        return;
    }
  },

  async [ActionType.BOTS_DELETE](userId: string, filters: BotsDeleteFilters): Promise<void> {
    const botsCollection: BotsDatabaseCollection = await UserBots.connect(userId);

    if (filters.brokerId) {
      const bots: BotsDatabaseDocument[] = await botsCollection.getBots({
        brokerId: filters.brokerId,
      });

      for (const bot of bots) {
        if (bot.active) {
          await runAction<DeactivateBotPayload, void>({
            type: ActionType.BOT_MANAGER_DEACTIVATE_BOT,
            userId,
            payload: { botToken: bot.token },
          });
        }

        await runAction<PositionDeleteFilters, void>({
          type: ActionType.POSITIONS_DELETE,
          userId,
          payload: { botId: bot.id },
        });
      }
    }

    if (filters.id) {
      await runAction<PositionDeleteFilters, void>({
        type: ActionType.POSITIONS_DELETE,
        userId,
        payload: { botId: filters.id },
      });
    }

    await botsCollection.deleteBots(filters);
  },
};
