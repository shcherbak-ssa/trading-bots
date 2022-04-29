import { BotState, BrokerAccountType, BrokerDataType, BrokerName } from '../constants';


export type Broker = {
  id: string;
  name: BrokerName;
  expiresAt: Date;
  bots: BrokerBot[];
}

export type BrokerBot = {
  id: string;
  active: boolean;
  state: BotState;
}

export type NewBroker = {
  name: BrokerName;
  expiresAt: Date;
  apiKeys: {
    [p: string]: string;
  };
}

export type UpdateBrokerPayload = {
  id: string;
  name: BrokerName;
  updates: Pick<NewBroker, 'expiresAt' | 'apiKeys'>;
}

export type LoadBrokersPayload = {
  withBots: boolean;
}

export type GetBrokerDataPayload = {
  id: string;
  dataType: BrokerDataType;
  accountId?: string;
  accountType?: BrokerAccountType;
  allowDemoAccount?: boolean;
  accountCurrency?: string;
  marketSymbol?: string;
}

export type GetBrokerDataResult = BrokerAccounts | BrokerMarkets | BrokerMarketLeverages;


// Data
export type BrokerAccounts = {
  dataType: BrokerDataType.ACCOUNT;
  real: BrokerAccount[];
  demo: BrokerAccount[];
}

export type BrokerMarkets = {
  dataType: BrokerDataType.MARKET;
  markets: BrokerMarket[];
}

export type BrokerMarketLeverages = {
  dataType: BrokerDataType.MARKET_LEVERAGE,
  current: number;
  available: number[];
}

export type BrokerAccount = {
  type: BrokerAccountType;
  accountId: string;
  amount: number;
  currency: string;
  name: string;
}

export type BrokerMarket = {
  name: string;
  symbol: string;
  currency: string;
}
