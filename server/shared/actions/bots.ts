import type {
  BotClientInfo,
  BrokerAccount,
  GetBrokerDataPayload,
  NewBot,
  OnlyIdPayload,
  UpdateBotPayload
} from 'global/types';
import { BotState, BotUpdateType, BrokerDataType } from 'global/constants';

import type { BotsDatabaseCollection, BotsDatabaseDocument, BotsDeleteFilters, BotsGetFilters } from 'shared/types';
import { ActionType } from 'shared/constants';
import { runAction } from 'shared/actions';

import { UserBots } from 'api/database/user-bots';


export const botsActions = {
  async [ActionType.BOTS_LOAD](userId: string, filters: BotsGetFilters): Promise<BotClientInfo[]> {
    const botsCollection: BotsDatabaseCollection = await UserBots.connect(userId);
    const bots: BotsDatabaseDocument[] = await botsCollection.getBots(filters);

    const brokerAccounts = await Promise.all(
      bots.map(async ({ brokerId, brokerAccountId, brokerAccountType }) => {
        return runAction<GetBrokerDataPayload, BrokerAccount | undefined>({
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
    const createdAt: string = new Date(Date.now()).toISOString();
    const state: BotState = BotState.ALIVE;

    const botsCollection: BotsDatabaseCollection = await UserBots.connect(userId);
    const createdBot: BotsDatabaseDocument = await botsCollection.createBot({
      ...newBot,
      createdAt,
      state,
    });

    if (createdBot.active) {
      // @TODO: activate bot
    }

    const brokerAccount = await runAction<GetBrokerDataPayload, BrokerAccount | undefined>({
      type: ActionType.BROKERS_GET_ACCOUNT,
      userId,
      payload: {
        id: createdBot.brokerId,
        dataType: BrokerDataType.ACCOUNT,
        accountType: createdBot.brokerAccountType,
        accountId: createdBot.brokerAccountId,
      },
    });

    return { ...createdBot, brokerAccount };
  },

  async [ActionType.BOTS_UPDATE](userId: string, { id, type, updates }: UpdateBotPayload): Promise<void> {
    const botsCollection: BotsDatabaseCollection = await UserBots.connect(userId);

    switch (type) {
      case BotUpdateType.ACTIVATE:
        await botsCollection.updateBot(id, { active: true });

        // @TODO: activate bot
        return;
      case BotUpdateType.DEACTIVATE:
        await botsCollection.updateBot(id, { active: false });

        // @TODO: deactivate bot
        return;
      case BotUpdateType.ARCHIVE:
        await botsCollection.updateBot(id, { active: false, state: BotState.ARCHIVE });

        // @TODO: deactivate bot if it is active
        return;
      case BotUpdateType.UPDATE:
        await botsCollection.updateBot(id, updates);

        // @TODO: apply updates to active bots
    }
  },

  async [ActionType.BOTS_DELETE](userId: string, filters: BotsDeleteFilters): Promise<void> {
    const botsCollection: BotsDatabaseCollection = await UserBots.connect(userId);
    await botsCollection.deleteBots(filters);

    // @TODO: remove bots from bots manager and close positions
  },
};
