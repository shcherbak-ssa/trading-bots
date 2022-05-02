import { BrokerApiKeys } from 'global/types';
import { BrokerAccountType, BrokerName } from 'global/constants';


// Database
export type CreationDocument<Document> = Omit<Document, 'id'>;


// Brokers
export type BrokersApiPayload = {
  accountType: BrokerAccountType;
  apiKeys: BrokerApiKeys;
  brokerName: BrokerName;
}
