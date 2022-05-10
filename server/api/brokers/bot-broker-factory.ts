import { BrokerName, StatusCode } from 'global/constants';

import { AppError } from 'shared/exceptions';
import { getBrokerLabel } from 'shared/utils';

import type { BotBroker, BotBrokerFactory, BotSettings } from 'modules/bot/types';

import { CurrencyComBotBroker } from './currency_com';


export class BrokerFactory implements BotBrokerFactory {
  async setupBroker(settings: BotSettings): Promise<BotBroker> {
    switch (settings.brokerName) {
      case BrokerName.CURRENCY_COM:
        return await CurrencyComBotBroker.setup(settings);
    }

    throw new AppError({
      message: `${getBrokerLabel(settings.brokerName)} API not implemented yet`,
      messageHeading: `Broker`,
    }, StatusCode.NOT_IMPLEMENTED);
  }
}
