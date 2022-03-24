import { BrokerError } from 'shared/exceptions';

import type { AccountItem, AccountResponse, EmptyRequest, ParsedAccount } from '../types';
import type { RestApi } from '../rest-api';
import { Endpoint } from '../constants';


export class AccountApi {
  constructor(
    private restApi: RestApi,
  ) {}


  async loadAccounts(): Promise<ParsedAccount[]> {
    const { accounts }: AccountResponse = await this.loadAccountsInfo();

    return accounts.map(AccountApi.parseAccount);
  }

  async loadConcreteAccount(accountId: string): Promise<ParsedAccount> {
    const { accounts }: AccountResponse = await this.loadAccountsInfo();
    const foundAccount: AccountItem | undefined = accounts.find(({ accountId: id }) => id === accountId);

    if (foundAccount) {
      return AccountApi.parseAccount(foundAccount);
    }

    throw new BrokerError(`Cannot found account with id '${accountId}'.`);
  }


  private async loadAccountsInfo(): Promise<AccountResponse> {
    return await this.restApi.get<EmptyRequest, AccountResponse>(Endpoint.ACCOUNTS, {});
  }

  private static parseAccount(
    { accountId, accountName, balance, currency }: AccountItem,
  ): ParsedAccount {
    return {
      id: accountId,
      name: accountName,
      currency,
      availableAmount: balance.available,
      totalAmount: balance.deposit,
    };
  }
}
