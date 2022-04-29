import type { BrokerApiKeys, BrokerAccount, BrokerMarket, UpdateBrokerPayload } from 'global/types';
import { BrokerAccountType, BrokerName } from 'global/constants';

import { CreationDocument } from './database';


// Api Database
export type BrokersDatabaseDocument = {
  id: string;
  name: BrokerName;
  expiresAt: Date;
  apiKeys: {
    [p: string]: string;
  };
}

export interface BrokersDatabaseCollection {
  getBroker(id: string): Promise<BrokersDatabaseDocument>;
  getBrokers(): Promise<BrokersDatabaseDocument[]>;
  getApiKeys(id: string): Promise<BrokerApiKeys>;
  createBroker(broker: CreationDocument<BrokersDatabaseDocument>): Promise<BrokersDatabaseDocument>;
  updateBroker(id: string, updates: UpdateBrokerPayload['updates']): Promise<void>;
  deleteBroker(id: string): Promise<void>;
}


// Api Brokers
export type BrokersApiPayload = {
  accountType: BrokerAccountType;
  apiKeys: { [p: string]: string };
  brokerName: BrokerName;
  accountCurrency?: string,
  marketSymbol?: string;
}

export type BrokerApiLeverageResponse = {
  current: number;
  available: number[];
}

export interface BrokersApiKeys {
  check(payload: BrokersApiPayload): Promise<void>;
}

export interface BrokersDataApi {
  getAccounts(payload: BrokersApiPayload): Promise<BrokerAccount[]>;
  getMarkets(payload: BrokersApiPayload): Promise<BrokerMarket[]>;
  getMarketLeverages(payload: BrokersApiPayload): Promise<BrokerApiLeverageResponse>;
}
