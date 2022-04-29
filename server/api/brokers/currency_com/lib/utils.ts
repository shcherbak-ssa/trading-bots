import { BrokerAccountType } from 'global/constants';

import { REAL_ACCOUNT_API_URL, DEMO_ACCOUNT_API_URL } from './constants';


export function getApiUrl(accountType: BrokerAccountType): string {
  return accountType === BrokerAccountType.DEMO ? DEMO_ACCOUNT_API_URL : REAL_ACCOUNT_API_URL;
}
