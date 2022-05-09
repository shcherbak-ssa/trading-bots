import type { BrokerApiKeys } from 'global/types';
import type { BrokerAccountType } from 'global/constants';

import type { OpenPosition } from 'shared/types';

import type { ClosedParsedPositions, ClosedPosition } from './types';

import { RestApi } from './lib/rest-api';
import { PositionApi as LibPositionApi } from './lib/position';


export class PositionApi {
  static async checkPositionClose(
    accountType: BrokerAccountType,
    { apiKey, secretKey }: BrokerApiKeys,
    position: OpenPosition,
  ): Promise<number | null> {
    const api: RestApi = new RestApi(apiKey, secretKey);
    api.setAccountType(accountType);

    const positionApi: LibPositionApi = new LibPositionApi(api);

    const closedPositions: ClosedPosition[]
      = await positionApi.getClosedPositions(position.brokerPositionIds, position.marketSymbol);

    if (closedPositions.length) {
      const { totalFee, result }: ClosedParsedPositions = positionApi.parseClosedPositions(closedPositions);

      position.feeClose = totalFee;
      position.result = result;

      return closedPositions.length;
    }

    return null;
  }
}
