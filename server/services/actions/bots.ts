import type {
  Bot,
  BotActivation,
  BotClientInfo,
  BrokerAccount,
  GetBrokerDataPayload,
  NewBot,
  UpdateBotPayload
} from 'global/types';

import { BotRestartMode, BotState, BotUpdateType, BrokerDataType } from 'global/constants';

import type {
  BotsDatabaseCollection,
  BotsDatabaseDocument,
  BotsDeleteFilters,
  BotsGetFilters,
  DeactivateBotPayload,
  PositionsDeleteFilters,
  RestartBotPayload,
  UsersDatabaseDocument
} from 'shared/types';

import { ActionType, DATE_STRING_27_DAYS } from 'shared/constants';
import { calculateProportion, convertDateStringToNumber, getMilliseconds, getTodayDateString } from 'shared/utils';

import { runAction } from 'services/actions';

import { UserBots } from 'api/database/user-bots';


export const botsActions = {
  async [ActionType.BOTS_GET](
    userId: string,
    { withBrokerAccount = true, ...filters }: BotsGetFilters
  ): Promise<BotClientInfo[]> {
    const botsCollection: BotsDatabaseCollection = await UserBots.connect(userId);

    let bots: BotsDatabaseDocument[] = [];

    if (filters.id) {
      const bot: BotsDatabaseDocument = await botsCollection.getBot(filters.id);

      bots.push(bot);
    } else {
      bots = await botsCollection.getBots(filters);
    }

    if (withBrokerAccount) {
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

      bots = bots.map((bot, index) => {
        return { ...bot, brokerAccount: brokerAccounts[index] };
      });
    }

    return bots;
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
          initialCapital: calculateProportion(brokerAccount.amount, currentBot.tradeCapitalPercent),
        };

        await runAction<Bot, void>({
          type: ActionType.BOT_MANAGER_ACTIVATE_BOT,
          userId,
          payload: { ...currentBot, ...updates },
        });

        break;
      case BotUpdateType.DEACTIVATE:
        await runAction<DeactivateBotPayload, void>({
          type: ActionType.BOT_MANAGER_DEACTIVATE_BOT,
          userId,
          payload: { botToken: currentBot.token },
        });

        updates = {
          active: false,
          activateAt: '',
          activation,
          initialCapital: 0,
        };

        break;
      case BotUpdateType.RESTART:
        updates = {
          activateAt: today,
          initialCapital: calculateProportion(brokerAccount.amount, currentBot.tradeCapitalPercent),
        };

        currentBot.activations.push(activation);

        await runAction<RestartBotPayload, void>({
          type: ActionType.BOT_MANAGER_RESTART_BOT,
          userId,
          payload: {
            bot: { ...currentBot, ...updates },
            closePosition: true,
          },
        });

        updates.activation = activation;

        break;
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

        break;
      case BotUpdateType.UPDATE:
        if (currentBot.active) {
          const needToUpdateActivation: boolean = updates.tradeCapitalPercent !== undefined;

          if (updates.tradeCapitalPercent !== undefined) {
            updates.activateAt = today;
            updates.initialCapital = calculateProportion(brokerAccount.amount, updates.tradeCapitalPercent);

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

        break;
    }

    await botsCollection.updateBot(id, updates);
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

        await runAction<PositionsDeleteFilters, void>({
          type: ActionType.POSITIONS_DELETE,
          userId,
          payload: { botId: bot.id },
        });
      }
    }

    if (filters.id) {
      await runAction<PositionsDeleteFilters, void>({
        type: ActionType.POSITIONS_DELETE,
        userId,
        payload: { botId: filters.id },
      });
    }

    await botsCollection.deleteBots(filters);
  },

  async [ActionType.BOTS_CHECK_RESTART](): Promise<void> {
    const users: UsersDatabaseDocument[] = await runAction({
      type: ActionType.USERS_GET,
      userId: '',
      payload: {},
    });

    for (const { id: userId } of users) {
      const activeBots = await runAction<BotsGetFilters, Bot[]>({
        type: ActionType.BOTS_GET,
        userId,
        payload: { active: true, withBrokerAccount: false },
      });

      for (const { id, restartEnable, restartMode, activateAt } of activeBots) {
        if (!restartEnable) continue;

        const needToRestart: boolean = (
          restartMode === BotRestartMode.WEEK ||
          (
            restartMode === BotRestartMode.MONTH &&
            Date.now() - convertDateStringToNumber(activateAt) > getMilliseconds(DATE_STRING_27_DAYS)
          )
        );

        if (needToRestart) {
          await runAction<UpdateBotPayload, void>({
            type: ActionType.BOTS_UPDATE,
            userId,
            payload: {
              id,
              type: BotUpdateType.RESTART,
              updates: {},
            },
          });
        }
      }
    }
  },
};
