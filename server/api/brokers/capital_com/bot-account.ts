import type { BotBrokerAccount, BotSettings } from 'modules/bot/types';
import { BotErrorPlace, BotEvents } from 'modules/bot';

import type { ParsedAccount } from './types';

import type { RestApi } from './lib/rest-api';
import { AccountApi } from './lib/account';


export class BotAccount implements BotBrokerAccount {
  availableAmount: number;
  totalAmount: number;

  constructor(
    private botSettings: BotSettings,
    private api: AccountApi,
  ) {}


  static async setup(botSettings: BotSettings, restApi: RestApi): Promise<BotAccount> {
    const api: AccountApi = new AccountApi(restApi);
    const brokerAccount: BotAccount = new BotAccount(botSettings, api);

    await brokerAccount.updateAccount();

    return brokerAccount;
  }


  async updateAccount(): Promise<void> {
    try {
      const { availableAmount, totalAmount }: ParsedAccount
        = await this.api.loadConcreteAccount(this.botSettings.brokerAccountId);

      this.availableAmount = availableAmount;
      this.totalAmount = totalAmount;
    } catch (e: any) {
      await BotEvents.processError(this.botSettings.token, BotErrorPlace.ACCOUNT_UPDATE, e.message);
    }
  }
}
