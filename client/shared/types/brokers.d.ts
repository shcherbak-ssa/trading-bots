import type {
  Broker,
  NewBroker,
  LoadBrokersPayload,
  UpdateBrokerPayload,
  BrokerAccount,
  BrokerMarket,
  BrokerMarketLeverages,
  GetBrokerDataPayload,
  GetBrokerDataResult
} from 'global/types';

import { BrokerName } from 'global/constants';

import { InputConfig } from './form';


export type BrokerConnectConfig = {
  id: string;
  name: BrokerName;
  inputs: InputConfig[];
}

export type BrokerDeletePayload = {
  id: string;
  name: BrokerName;
}

export interface BrokersStore {
  setBrokers(brokers: Broker[]): void;
  addBroker(broker: Broker): void;
  updateBroker(id: string, expiresAt: Date): void;
  updateBrokerAccounts(accounts: BrokerAccount[]): void;
  updateBrokerMarkets(markets: BrokerMarket[]): void;
  updateBrokerMarketLeverage(marketLeverage: Omit<BrokerMarketLeverages, 'dataType'>): void;
  deleteBroker(id: string): void;
}

export interface BrokersApi {
  loadBrokers(payload: LoadBrokersPayload): Promise<Broker[]>;
  getBrokerData(payload: GetBrokerDataPayload): Promise<GetBrokerDataResult>;
  connectBroker(payload: NewBroker): Promise<Broker>;
  updateBroker(payload: UpdateBrokerPayload): Promise<void>;
  deleteBroker(id: string): Promise<void>;
}
