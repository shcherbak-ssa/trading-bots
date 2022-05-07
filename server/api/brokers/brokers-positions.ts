import { BrokerName, StatusCode } from 'global/constants';

import type { BrokersPositionsApi, BrokersPositionsApiPayload } from 'shared/types';
import { AppError } from 'shared/exceptions';

import { CurrencyComPositionApi } from 'api/brokers/currency_com';


export class BrokersPositions implements BrokersPositionsApi {
  async checkPositionClose(
    { accountType, apiKeys, brokerName, position }: BrokersPositionsApiPayload
  ): Promise<number | null> {
    switch (brokerName) {
      case BrokerName.CURRENCY_COM:
        return await CurrencyComPositionApi.positionExist(accountType, apiKeys, position);
    }

    throw new AppError({
      message: `data API not implemented yet`,
      messageLabel: `Broker [${brokerName}]`,
    }, StatusCode.NOT_IMPLEMENTED);
  }
}
