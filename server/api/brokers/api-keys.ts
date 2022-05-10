import type { BrokersApiKeys, BrokersApiPayload } from 'shared/types';
import { BrokerName, StatusCode } from 'global/constants';

import { AppError } from 'shared/exceptions';
import { getBrokerLabel } from 'shared/utils';

import { CurrencyComApiKeys } from './currency_com';


export class ApiKeys implements BrokersApiKeys {
  async check({ brokerName, apiKeys }: BrokersApiPayload): Promise<void> {
    switch (brokerName) {
      case BrokerName.CURRENCY_COM:
        return await CurrencyComApiKeys.check(apiKeys);
    }

    throw new AppError({
      message: `${getBrokerLabel(brokerName)} API not implemented yet`,
      messageHeading: `Broker`,
    }, StatusCode.NOT_IMPLEMENTED);
  }
}
