import { BrokerName, StatusCode } from 'global/constants';

import type { BrokersPositionsApi, BrokersPositionsApiPayload } from 'shared/types';
import { AppError } from 'shared/exceptions';
import { getBrokerLabel } from 'shared/utils';

import { CurrencyComPositionApi } from './currency_com';


export class BrokersPositions implements BrokersPositionsApi {
  async checkPositionClose(
    { accountType, apiKeys, brokerName, position }: BrokersPositionsApiPayload
  ): Promise<number | null> {
    switch (brokerName) {
      case BrokerName.CURRENCY_COM:
        return await CurrencyComPositionApi.checkPositionClose(accountType, apiKeys, position);
    }

    throw new AppError({
      message: `${getBrokerLabel(brokerName)} data API not implemented yet`,
      messageHeading: `Broker`,
    }, StatusCode.NOT_IMPLEMENTED);
  }
}
