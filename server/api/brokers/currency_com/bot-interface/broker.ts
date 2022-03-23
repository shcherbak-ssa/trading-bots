import type { BotBroker, BotBrokerAccount, BotBrokerMarket, BotPosition, BotSettings } from 'modules/bot/types';
import { BrokerList } from 'global/constants';

import type { ActiveParsedPosition, ClosedParsedPosition } from '../types';
import { OrderSide } from '../constants';
import { PositionApi } from '../api/position';
import { RestApi } from '../rest-api';

import { BrokerMarket } from './market';
import { BrokerAccount } from './account';


export class Broker implements BotBroker {
  name: string = BrokerList.CURRENCY_COM;
  market: BotBrokerMarket;
  account: BotBrokerAccount;


  constructor(
    private botSettings: BotSettings,
    private positionApi: PositionApi,
  ) {}


  static async setup(botSettings: BotSettings): Promise<Broker> {
    const [ apiKey, secretKey ] = botSettings.brokerApiKeys;

    const restApi: RestApi = new RestApi(apiKey, secretKey);
    restApi.setAccountType(botSettings.brokerAccountType);

    const positionApi: PositionApi = new PositionApi(restApi);
    const broker: Broker = new Broker(botSettings, positionApi);

    broker.account = await BrokerAccount.setup(botSettings, restApi);
    broker.market = await BrokerMarket.setup(botSettings, restApi);

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
