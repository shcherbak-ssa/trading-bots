import type { BotBrokerAccount, BotSettings } from 'modules/bot/types';
import { AliveBotErrorPlace, BotEvents } from 'modules/bot';

import type { ParsedAccount } from './lib/types';
import type { RestApi } from './lib/rest-api';
import { AccountApi } from './lib/account';

import { ACCOUNT_UPDATE_INTERVAL } from './constants';


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
    } catch (err: any) {
      BotEvents.processAliveError(this.botSettings.id, AliveBotErrorPlace.ACCOUNT_AMOUNT_UPDATE, err.message);
    }
  }
}
