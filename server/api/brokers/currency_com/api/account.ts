import { BrokerError } from 'shared/exceptions';

import type {
  AccountBalance,
  AccountParsedBalance,
  AccountRequest,
  AccountRequestSettings,
  AccountResponse
} from '../types';

import { Endpoint } from '../constants';
import type { RestApi } from '../rest-api';


export class AccountApi {
  constructor(
    private restApi: RestApi,
  ) {}


  async loadAccounts({ showZeroBalance = true }: AccountRequestSettings): Promise<AccountParsedBalance[]> {
    const { balances }: AccountResponse = await this.loadAccountInfo(showZeroBalance);

    return balances.map(AccountApi.parseBalance);
  }

  async loadConcreteAccount(
    { showZeroBalance = true, accountId }: AccountRequestSettings,
  ): Promise<AccountParsedBalance> {
    const { balances }: AccountResponse = await this.loadAccountInfo(showZeroBalance);
    const foundBalance: AccountBalance | undefined = balances.find(({ accountId: id }) => accountId === id);

    if (foundBalance) {
      return AccountApi.parseBalance(foundBalance);
    }

    throw new BrokerError(`Cannot found broker account with id '${accountId}'.`);
  }


  private async loadAccountInfo(showZeroBalance: boolean): Promise<AccountResponse> {
    return await this.restApi.get<AccountRequest, AccountResponse>(Endpoint.ACCOUNT, {
      showZeroBalance,
      timestamp: Date.now(),
    });
  }

  private static parseBalance(
    { accountId, asset, free, locked }: AccountBalance,
  ): AccountParsedBalance {
    return {
      id: accountId,
      currency: asset,
      availableAmount: free,
      totalAmount: free + locked,
    };
  }
}
