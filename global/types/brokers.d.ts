import { BrokerName } from '../constants';


export type BrokerClientInfo = {
  id: string;
  name: BrokerName;
  expiresDate: Date;
  bots: BrokerClientBotsInfo[];
}

export type BrokerClientBotsInfo = {
  id: string;
  active: boolean;
}

export type NewBroker = {
  name: BrokerName;
  expiresDate: Date;
  apiKeys: {
    [p: string]: string;
  };
}
