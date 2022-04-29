import type {
  Bot,
  BotClientInfo,
  Broker,
  BrokerAccount,
  BrokerAccounts,
  BrokerApiKeys,
  BrokerBot,
  BrokerMarket,
  GetBrokerDataPayload,
  GetBrokerDataResult,
  LoadBrokersPayload,
  NewBroker,
  OnlyIdPayload,
  UpdateBrokerPayload,
} from 'global/types';

import { BrokerAccountType, BrokerDataType, StatusCode } from 'global/constants';

import type {
  BotsDatabaseCollection,
  BotsDatabaseDocument,
  BotsGetFilters,
  BrokerApiLeverageResponse,
  BrokersApiKeys,
  BrokersDataApi,
  BrokersDatabaseCollection,
  BrokersDatabaseDocument
} from 'shared/types';

import { ActionType } from 'shared/constants';
import { AppError } from 'shared/exceptions';
import { runAction } from 'shared/actions';

import { ApiKeys, BrokersData } from 'api/brokers';
import { UserBrokers } from 'api/database/user-brokers';
import { UserBots } from 'api/database/user-bots';


const brokersApiKeys: BrokersApiKeys = new ApiKeys();
const brokersDataApi: BrokersDataApi = new BrokersData();


export const brokersActions = {
  async [ActionType.BROKERS_LOAD](userId: string, { withBots }: LoadBrokersPayload): Promise<Broker[]> {
    const brokersCollection: BrokersDatabaseCollection = await UserBrokers.connect(userId);
    const brokers: BrokersDatabaseDocument[] = await brokersCollection.getBrokers();

    const userBots: BotsDatabaseDocument[] = [];

    if (withBots) {
      const bots: BotsDatabaseDocument[] = await runAction<BotsGetFilters, Bot[]>({
        type: ActionType.BOTS_LOAD,
        userId,
        payload: {},
      });

      userBots.push(...bots);
    }

    return brokers.map((broker) => {
      // @ts-ignore
      delete broker.apiKeys;

      if (withBots) {
        const brokerBots: BrokerBot[] = userBots
          .filter(({ brokerId }) => brokerId === broker.id)
          .map(({ id, active, state }) => ({ id, active, state }));

        return { ...broker, bots: brokerBots };
      }

      return { ...broker, bots: [] };
    });
  },

  async [ActionType.BROKERS_GET_DATA](
    userId: string,
    { id: brokerId, ...filters }: GetBrokerDataPayload,
  ): Promise<GetBrokerDataResult> {
    const brokersCollection: BrokersDatabaseCollection = await UserBrokers.connect(userId);
    const { name: brokerName, apiKeys }: BrokersDatabaseDocument = await brokersCollection.getBroker(brokerId);

    if (filters.dataType === BrokerDataType.ACCOUNT) {
      const result: BrokerAccounts = {
        dataType: BrokerDataType.ACCOUNT,
        real: [],
        demo: [],
      };

      result.real = await brokersDataApi.getAccounts({
        accountType: BrokerAccountType.REAL,
        apiKeys,
        brokerName,
      });

      if (filters.allowDemoAccount) {
        result.demo = await brokersDataApi.getAccounts({
          accountType: BrokerAccountType.DEMO,
          apiKeys,
          brokerName,
        });
      }

      return result;
    }

    if (filters.dataType === BrokerDataType.MARKET) {
      const markets: BrokerMarket[] = await brokersDataApi.getMarkets({
        accountType: filters.accountType || BrokerAccountType.REAL,
        accountCurrency: filters.accountCurrency,
        apiKeys,
        brokerName,
      });

      return {
        dataType: BrokerDataType.MARKET,
        markets,
      };
    }

    if (filters.dataType === BrokerDataType.MARKET_LEVERAGE) {
      const leverages: BrokerApiLeverageResponse = await brokersDataApi.getMarketLeverages({
        accountType: filters.accountType || BrokerAccountType.REAL,
        marketSymbol: filters.marketSymbol,
        apiKeys,
        brokerName,
      });

      return {
        dataType: BrokerDataType.MARKET_LEVERAGE,
        ...leverages,
      };
    }

    throw new AppError(StatusCode.INTERNAL_SERVER_ERROR, {
      message: `Unknown data type filter '${filters.dataType}'`,
    });
  },

  async [ActionType.BROKERS_GET_ACCOUNT](
    userId: string,
    { id: brokerId, ...filters }: GetBrokerDataPayload
  ): Promise<BrokerAccount> {
    const brokersCollection: BrokersDatabaseCollection = await UserBrokers.connect(userId);
    const { name: brokerName, apiKeys }: BrokersDatabaseDocument = await brokersCollection.getBroker(brokerId);

    const brokerAccounts: BrokerAccount[] = await brokersDataApi.getAccounts({
      accountType: filters.accountType || BrokerAccountType.REAL,
      apiKeys,
      brokerName,
    });

    const foundBrokerAccount = brokerAccounts.find(({ accountId }) => accountId === filters.accountId);

    if (!foundBrokerAccount) {
      console.error(` - error: [database] cannot found broker account with id '${filters.accountId}'`);

      throw new AppError(StatusCode.BAD_REQUEST, {
        message: `Cannot found broker account with id '${brokerId}'`,
      });
    }

    return foundBrokerAccount;
  },

  async [ActionType.BROKERS_GET_API_KEYS](userId: string, { id: brokerId }: OnlyIdPayload): Promise<BrokerApiKeys> {
    const brokersCollection: BrokersDatabaseCollection = await UserBrokers.connect(userId);

    return await brokersCollection.getApiKeys(brokerId);
  },

  async [ActionType.BROKERS_CONNECT](userId: string, newBroker: NewBroker): Promise<Broker> {
    const { name, apiKeys } = newBroker;

    await brokersApiKeys.check({
      brokerName: name,
      accountType: BrokerAccountType.REAL,
      apiKeys,
    });

    const brokersCollection: BrokersDatabaseCollection = await UserBrokers.connect(userId);
    const createdBroker: BrokersDatabaseDocument = await brokersCollection.createBroker(newBroker);

    return {
      id: createdBroker.id,
      expiresAt: createdBroker.expiresAt,
      bots: [],
      name,
    };
  },

  async [ActionType.BROKERS_UPDATE](userId: string, { id, name, updates }: UpdateBrokerPayload): Promise<void> {
    const { apiKeys } = updates;

    await brokersApiKeys.check({
      brokerName: name,
      accountType: BrokerAccountType.REAL,
      apiKeys,
    });

    const brokersCollection: BrokersDatabaseCollection = await UserBrokers.connect(userId);
    await brokersCollection.updateBroker(id, updates);

    const botsCollection: BotsDatabaseCollection = await UserBots.connect(userId);
    const activeBots: Bot[] = await botsCollection.getBots({ active: true });

    for (const activeBot of activeBots) {
      await runAction<Bot, void>({
        type: ActionType.BOT_MANAGER_ACTIVATE_BOT,
        userId,
        payload: activeBot,
      });
    }
  },

  async [ActionType.BROKERS_DELETE](userId: string, { id: brokerId }: OnlyIdPayload): Promise<void> {
    await runAction<BotsGetFilters, BotClientInfo[]>({
      type: ActionType.BOTS_DELETE,
      userId,
      payload: { brokerId },
    });

    const brokersCollection: BrokersDatabaseCollection = await UserBrokers.connect(userId);
    await brokersCollection.deleteBroker(brokerId);
  },
};
