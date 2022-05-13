import type { BrokerApiKeys, BrokerAccount, BrokerMarket, UpdateBrokerPayload } from 'global/types';
import { BrokerName } from 'global/constants';

import { BrokersApiPayload, CreationDocument } from 'shared/types';


// Database Api
export type BrokersDatabaseDocument = {
  id: string;
  name: BrokerName;
  expiresAt: string;
  apiKeys: string;
}

export type BrokersWithParsedKeysDatabaseDocument = {
  id: string;
  name: BrokerName;
  expiresAt: string;
  apiKeys: BrokerApiKeys;
}

export interface BrokersDatabaseCollection {
  getBroker(id: string): Promise<BrokersWithParsedKeysDatabaseDocument>;
  getBrokers(): Promise<BrokersWithParsedKeysDatabaseDocument[]>;
  getApiKeys(id: string): Promise<BrokerApiKeys>;
  createBroker(broker: CreationDocument<BrokersWithParsedKeysDatabaseDocument>): Promise<BrokersDatabaseDocument>;
  updateBroker(id: string, updates: UpdateBrokerPayload['updates']): Promise<void>;
  deleteBroker(id: string): Promise<void>;
}


// Brokers Api
export type BrokersDataApiPayload = BrokersApiPayload & {
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
  getAccounts(payload: BrokersDataApiPayload): Promise<BrokerAccount[]>;
  getMarkets(payload: BrokersDataApiPayload): Promise<BrokerMarket[]>;
  getMarketLeverages(payload: BrokersDataApiPayload): Promise<BrokerApiLeverageResponse>;
}
