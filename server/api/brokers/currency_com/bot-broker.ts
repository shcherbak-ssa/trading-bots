import { BrokerList } from 'global/constants';
import type { BotBroker as Broker, BotBrokerAccount, BotBrokerMarket, BotPosition, BotSettings } from 'modules/bot/types';

import type { ActiveParsedPosition, ClosedParsedPosition } from './lib/types';
import { PositionApi } from './lib/position';
import { RestApi } from './lib/rest-api';

import { OrderSide } from './constants';
import { BotMarket } from './bot-market';
import { BotAccount } from './bot-account';


export class BotBroker implements Broker {
  name: string = BrokerList.CURRENCY_COM;
  market: BotBrokerMarket;
  account: BotBrokerAccount;


  constructor(
    private botSettings: BotSettings,
    private positionApi: PositionApi,
  ) {}


  static async setup(botSettings: BotSettings): Promise<BotBroker> {
    const [ apiKey, secretKey ] = botSettings.brokerApiKeys;

    const restApi: RestApi = new RestApi(apiKey, secretKey);
    restApi.setAccountType(botSettings.brokerAccountType);

    const positionApi: PositionApi = new PositionApi(restApi);
    const broker: BotBroker = new BotBroker(botSettings, positionApi);

    broker.account = await BotAccount.setup(botSettings, restApi);
    broker.market = await BotMarket.setup(botSettings, restApi);

    return broker;
  }


  // Implementations
  isCorrectBroker(name: string): boolean {
    return name === this.name;
  }

  async openPosition(position: BotPosition): Promise<void> {
    const { brokerAccountId, brokerMarketSymbol } = this.botSettings;

    const openPosition: ActiveParsedPosition = await this.positionApi.openPosition({
      accountId: brokerAccountId,
      quantity: position.positionSize,
      symbol: brokerMarketSymbol,
      side: position.isLong ? OrderSide.BUY : OrderSide.SELL,
    });

    position.id = openPosition.id;
    position.feeOpen = openPosition.fee;
  }

  async closePosition(position: BotPosition): Promise<void> {
    const { id, marketSymbol } = position;

    const closedPosition: ClosedParsedPosition = await this.positionApi.closePosition(id, marketSymbol);

    position.feeClose = closedPosition.fee;
    position.result = closedPosition.result;
  }
}
