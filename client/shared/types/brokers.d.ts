import type { BrokerClientInfo, NewBroker, ErrorPayload } from 'global/types';
import { BrokerName } from 'global/constants';

import { InputConfig } from './form';


export type Broker = {
  name: BrokerName;
  label: string;
  logo: string;
  inputs: InputConfig[];
}

export interface BrokersStore {
  loadBrokers(brokers: BrokerClientInfo[]): void;
  addBroker(broker: BrokerClientInfo): void;
  deleteBroker(id: string): void;
}

export interface BrokersApi {
  getBrokers(): Promise<BrokerClientInfo[] | ErrorPayload>;
  connectBroker(payload: NewBroker): Promise<BrokerClientInfo | ErrorPayload>;
  deleteBroker(id: string): Promise<{} | ErrorPayload>;
}
