import { BrokerName } from 'global/constants';

import type { BotBroker as Broker, BotBrokerAccount, BotBrokerMarket, BotPosition, BotSettings } from 'modules/bot/types';

import type { ActiveParsedPositions, ClosedParsedPositions } from './types';
import { OrderSide } from './constants';

import { PositionApi } from './lib/position';
import { RestApi } from './lib/rest-api';

import { BotMarket } from './bot-market';
import { BotAccount } from './bot-account';


export class BotBroker implements Broker {
  name: BrokerName = BrokerName.CURRENCY_COM;
  market: BotBrokerMarket;
  account: BotBrokerAccount;


  constructor(
    private botSettings: BotSettings,
    private positionApi: PositionApi,
  ) {}


  static async setup(botSettings: BotSettings): Promise<BotBroker> {
    const { apiKey, secretKey } = botSettings.brokerApiKeys;

    const restApi: RestApi = new RestApi(apiKey, secretKey);
    restApi.setAccountType(botSettings.brokerAccountType);

    const positionApi: PositionApi = new PositionApi(restApi);
    const broker: BotBroker = new BotBroker(botSettings, positionApi);

    broker.account = await BotAccount.setup(botSettings, restApi);
    broker.market = await BotMarket.setup(botSettings, restApi);

    return broker;
  }


  // Implementations
  async openPosition(position: BotPosition): Promise<void> {
    const { brokerAccountId, brokerMarketSymbol } = this.botSettings;

    const openPosition: ActiveParsedPositions = await this.positionApi.openPosition({
      accountId: brokerAccountId,
      quantity: position.quantity,
      symbol: brokerMarketSymbol,
      side: position.isLong ? OrderSide.BUY : OrderSide.SELL,
    });

    position.brokerPositionIds = openPosition.ids;
    position.feeOpen = openPosition.totalFee;
  }

  async closePosition(position: BotPosition): Promise<void> {
    const { brokerPositionIds, marketSymbol } = position;

    const closedPosition: ClosedParsedPositions = await this.positionApi.closePosition(brokerPositionIds, marketSymbol);

    position.feeClose = closedPosition.totalFee;
    position.result = closedPosition.result;
  }
}
