import { StatusCode } from 'global/constants';
import { ProcessError } from 'shared/exceptions';

import { Endpoint } from '../constants';

import type { AccountBalance, AccountRequest, AccountRequestSettings, AccountResponse, ParsedBalance } from './types';
import type { RestApi } from './rest-api';


export class AccountApi {
  constructor(
    private restApi: RestApi,
  ) {}


  async loadAccounts({ showZeroBalance = true }: AccountRequestSettings): Promise<ParsedBalance[]> {
    const { balances }: AccountResponse = await this.loadAccountsInfo(showZeroBalance);

    return balances.map(AccountApi.parseBalance);
  }

  async loadConcreteAccount(
    { showZeroBalance = true, accountId }: AccountRequestSettings,
  ): Promise<ParsedBalance> {
    const { balances }: AccountResponse = await this.loadAccountsInfo(showZeroBalance);
    const foundBalance: AccountBalance | undefined = balances.find(({ accountId: id }) => accountId === id);

    if (foundBalance) {
      return AccountApi.parseBalance(foundBalance);
    }

    throw new ProcessError(`Cannot found account with id '${accountId}'`, StatusCode.BAD_REQUEST);
  }


  private async loadAccountsInfo(showZeroBalance: boolean): Promise<AccountResponse> {
    return await this.restApi.get<AccountRequest, AccountResponse>(Endpoint.ACCOUNT, {
      showZeroBalance,
      timestamp: Date.now(),
    });
  }

  private static parseBalance(
    { accountId, asset, free, locked }: AccountBalance,
  ): ParsedBalance {
    return {
      id: accountId,
      currency: asset,
      availableAmount: free,
      totalAmount: free + locked,
    };
  }
}
