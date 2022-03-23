import { BrokerList } from 'global/constants';
import type { BotBroker, BotBrokerFactory, BotSettings } from 'modules/bot/types';

import { Broker as CurrencyComBroker } from './currency_com/bot-interface';


export class BrokerFactory implements BotBrokerFactory {
  async setupBroker(settings: BotSettings): Promise<BotBroker> {
    switch (settings.brokerName) {
      case BrokerList.CURRENCY_COM:
        return await CurrencyComBroker.setup(settings);
    }

    throw new Error(''); // @TODO: implement
  }
}
