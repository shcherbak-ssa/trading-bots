import { BrokerAccountType, StatusCode } from 'global/constants';

import { AppError } from 'shared/exceptions';

import type { AccountResponse } from './types';
import { RestApi } from './lib/rest-api';
import { AccountApi } from './lib/account';


export class ApiKeys {
  static async check({ apiKey, secretKey }: { [p: string]: string }): Promise<void> {
    const api: RestApi = new RestApi(apiKey, secretKey);
    api.setAccountType(BrokerAccountType.REAL);

    const accountApi: AccountApi = new AccountApi(api);

    const { canTrade }: AccountResponse = await accountApi.loadAccountsInfo(true);

    if (!canTrade) {
      throw new AppError({
        message: `API keys are valid, but you cannot use trade API.\n\nPlease, check permissions or wait account verification.`,
        messageLabel: 'Broker Currency.com',
      }, StatusCode.BAD_REQUEST);
    }
  }
}
