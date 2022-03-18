import type { BotBroker, BotBrokerAccount, BotBrokerMarket, BotPosition, BotSettings } from 'modules/bot/types';

import type { AccountParsedBalance, Market, MarketPrice } from './types';
import { RestApi } from './rest-api';
import { AccountApi } from './api/account';
import { MarketApi } from './api/market';


export  class BrokerMarket implements BotBrokerMarket {
  minPositionSize: number;
  tickSize: number;
  leverage: number;
  currentPrice: number;
  currentSpread: number;

  private subscribeHandler: () => void;

  constructor(
    private market: Market,
    private api: MarketApi,
  ) {}


  static async setup(marketSymbol: string, restApi: RestApi): Promise<BrokerMarket> {
    const api: MarketApi = await MarketApi.setup(restApi);
    const market: Market = await api.loadMarketData(marketSymbol);

    const brokerMarket: BrokerMarket = new BrokerMarket(market, api);
    brokerMarket.minPositionSize = market.minPositionSize;
    brokerMarket.tickSize = market.tickSize;
    brokerMarket.leverage = market.leverage;
    brokerMarket.currentPrice = market.price;
    brokerMarket.currentSpread = market.spread;

    api.subscribeToMarketPriceUpdates(marketSymbol, brokerMarket.updateMarketPrice.bind(brokerMarket));

    return brokerMarket;
  }


  updateMarketPrice({ price, spread }: MarketPrice): void {
    this.currentPrice = price;
    this.currentSpread = spread;

    this.subscribeHandler();
  }


  // Implementations
  isCorrectSymbol(marketSymbol: string): boolean {
    return marketSymbol === this.market.marketSymbol;
  }

  getCurrentPriceByAccountCurrency(): number {
    return this.market.price; // @TODO: implement
  }

  getCloseTime(): string {
    throw new Error(''); // @TODO: implement
  }

  subscribeToPriceUpdate(callback: () => void): void {
    this.subscribeHandler = callback;
  }
}


class BrokerAccount implements BotBrokerAccount {
  availableAmount: number;
  totalAmount: number;

  constructor(
    private accountId: string,
    private api: AccountApi,
  ) {}


  static async setup(accountId: string, restApi: RestApi): Promise<BrokerAccount> {
    const api: AccountApi = new AccountApi(restApi);
    const brokerAccount: BrokerAccount = new BrokerAccount(accountId, api);

    await brokerAccount.updateCurrentAccount();
    setInterval(brokerAccount.updateCurrentAccount.bind(brokerAccount), 60000); // @TODO: remove number literal

    return brokerAccount;
  }

  async updateCurrentAccount(): Promise<void> {
    const { availableAmount, totalAmount }: AccountParsedBalance = await this.api.loadConcreteAccount({
      accountId: this.accountId,
    });

    this.availableAmount = availableAmount;
    this.totalAmount = totalAmount;
  }
}


export class Broker implements BotBroker {
  market: BotBrokerMarket;
  account: BotBrokerAccount;
  currentOpenPosition: BotPosition | null = null;

  private name: string = ''; // @TODO: implement

  constructor(
    private restApi: RestApi,
  ) {}


  static async setup(settings: BotSettings): Promise<Broker> {
    const [ apiKey, secretKey ] = settings.brokerApiKeys;

    const restApi: RestApi = new RestApi(apiKey, secretKey).setAccountType(settings.brokerAccountType);
    const broker: Broker = new Broker(restApi);

    broker.account = await BrokerAccount.setup(settings.brokerAccountId, restApi);
    broker.market = await BrokerMarket.setup(settings.brokerMarketSymbol, restApi);

    return broker;
  }


  // Implementations
  isCorrectBroker(name: string): boolean {
    return name === this.name;
  }

  async openPosition(position: BotPosition): Promise<void> {
    // @TODO: implement
    throw new Error('');
  }

  async closePosition(): Promise<BotPosition> {
    // @TODO: implement
    throw new Error('');
  }
}
