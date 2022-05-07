import { ApiError } from 'shared/exceptions';

import type { AccountItem, AccountResponse, EmptyRequest, ParsedAccount } from '../types';
import { Endpoint } from '../constants';

import type { RestApi } from './rest-api';


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

    throw new ApiError({
      message: `Cannot found account (${accountId})`,
      messageLabel: `Broker Capital.com`,
    });
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
