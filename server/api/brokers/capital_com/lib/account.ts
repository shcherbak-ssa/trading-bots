import { BrokerName } from 'global/constants';

import { BrokerApiError } from 'shared/exceptions';

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

    throw new BrokerApiError(`Cannot found account with id '${accountId}'`, BrokerName.CAPITAL_COM);
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
