import type { BotBrokerAccount, BotSettings } from 'modules/bot/types';
import { BotErrorPlace, BotEvents } from 'modules/bot';

import type { ParsedAccount } from './types';
import { ACCOUNT_UPDATE_INTERVAL } from './constants';

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

    await brokerAccount.updateCurrentAccount();
    setInterval(brokerAccount.updateCurrentAccount.bind(brokerAccount, ACCOUNT_UPDATE_INTERVAL));

    return brokerAccount;
  }


  async updateCurrentAccount(): Promise<void> {
    try {
      const { availableAmount, totalAmount }: ParsedAccount
        = await this.api.loadConcreteAccount(this.botSettings.brokerAccountId);

      this.availableAmount = availableAmount;
      this.totalAmount = totalAmount;
    } catch (e: any) {
      BotEvents.processError(this.botSettings.token, BotErrorPlace.ACCOUNT_AMOUNT_UPDATE, e.message);
    }
  }
}
