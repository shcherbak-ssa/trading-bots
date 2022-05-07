import type { BrokersApiKeys, BrokersApiPayload } from 'shared/types';
import { BrokerName, StatusCode } from 'global/constants';

import { AppError } from 'shared/exceptions';

import { CurrencyComApiKeys } from './currency_com';


export class ApiKeys implements BrokersApiKeys {
  async check({ brokerName, apiKeys }: BrokersApiPayload): Promise<void> {
    switch (brokerName) {
      case BrokerName.CURRENCY_COM:
        return await CurrencyComApiKeys.check(apiKeys);
    }

    throw new AppError({
      message: `API not implemented yet`,
      messageLabel: `Broker [${brokerName}]`,
    }, StatusCode.NOT_IMPLEMENTED);
  }
}
