import type { BrokersApiKeys } from 'shared/types';
import { BrokerName, StatusCode } from 'global/constants';

import { CurrencyComApiKeys } from './currency_com';
import { AppError } from 'shared/exceptions';


export class ApiKeys implements BrokersApiKeys {
  async check(brokerName: BrokerName, apiKeys: { [p: string]: string }): Promise<void> {
    switch (brokerName) {
      case BrokerName.CURRENCY_COM:
        return await CurrencyComApiKeys.check(apiKeys);
    }

    throw new AppError(StatusCode.NOT_IMPLEMENTED, {
      message: `Broker API [${brokerName}] not implemented yet`,
    });
  }
}
