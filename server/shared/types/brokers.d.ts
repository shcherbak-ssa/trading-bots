import { BrokerName } from 'global/constants';

import { CreationDocument } from 'shared/types/database';


// Api Database
export type BrokersDatabaseDocument = {
  id: string;
  name: BrokerName;
  expiresDate: Date;
  apiKeys: {
    [p: string]: string;
  };
}

export interface BrokersDatabaseCollection {
  getBrokers(): Promise<BrokersDatabaseDocument[]>;
  saveBroker(broker: CreationDocument<BrokersDatabaseDocument>): Promise<BrokersDatabaseDocument>;
  deleteBroker(id: string): Promise<void>;
}


// Api Brokers
export interface BrokersApiKeys {
  check(brokerName: BrokerName, apiKeys: { [p: string]: string }): Promise<void>;
}
