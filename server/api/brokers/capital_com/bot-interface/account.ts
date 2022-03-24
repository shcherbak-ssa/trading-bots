import type { BotBrokerAccount, BotSettings } from 'modules/bot/types';
import { AliveBotErrorPlace, botController } from 'modules/bot';

import type { ParsedAccount } from '../types';
import type { RestApi } from '../rest-api';
import { ACCOUNT_UPDATE_INTERVAL } from '../constants';
import { AccountApi } from '../api/account';


export class BrokerAccount implements BotBrokerAccount {
  availableAmount: number;
  totalAmount: number;

  constructor(
    private botSettings: BotSettings,
    private api: AccountApi,
  ) {}


  static async setup(botSettings: BotSettings, restApi: RestApi): Promise<BrokerAccount> {
    const api: AccountApi = new AccountApi(restApi);
    const brokerAccount: BrokerAccount = new BrokerAccount(botSettings, api);

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
      botController.processAliveBotError(this.botSettings.id, AliveBotErrorPlace.ACCOUNT_AMOUNT_UPDATE, err.message);
    }
  }
}
