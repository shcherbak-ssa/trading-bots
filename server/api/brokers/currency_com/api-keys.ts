import { StatusCode } from 'global/constants';
import { AppError } from 'shared/exceptions';

import type { AccountResponse } from './lib/types';
import { RestApi } from './lib/rest-api';
import { AccountApi } from './lib/account';


export class ApiKeys {
  static async check({ apiKey, secretKey }: { [p: string]: string }): Promise<void> {
    const api: RestApi = new RestApi(apiKey, secretKey);
    const accountApi: AccountApi = new AccountApi(api);

    const { canTrade }: AccountResponse = await accountApi.loadAccountsInfo(true);

    if (!canTrade) {
      throw new AppError(StatusCode.BAD_REQUEST, {
        message: `API keys are valid, but you cannot use trade API.<br>Please, check permissions or wait account verification.`,
      });
    }
  }
}
