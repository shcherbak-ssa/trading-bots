import type { BotBroker, BotBrokerAccount, BotBrokerMarket, BotPosition, BotSettings } from 'modules/bot/types';

import type { AccountParsedBalance, Market, MarketPrice } from './types';
import { RestApi } from './rest-api';
import { AccountApi } from './api/account';
import { MarketApi } from './api/market';


export  class BrokerMarket implements BotBrokerMarket {
  constructor(
    private market: Market,
    private api: MarketApi,
  ) {}


  static async setup(marketSymbol: string, restApi: RestApi): Promise<BrokerMarket> {
    const api: MarketApi = new MarketApi(restApi);
    const market: Market = await api.loadMarketData(marketSymbol);

    const brokerMarket: BrokerMarket = new BrokerMarket(market, api);
    setInterval(brokerMarket.updateMarketPrice.bind(brokerMarket), 250);

    return brokerMarket;
  }


  async updateMarketPrice(): Promise<void> {
    const { price, spread }: MarketPrice = await this.api.loadMarketPrice(this.market.marketSymbol);

    this.market.price = price;
    this.market.spread = spread;
    console.log(this.market.price, new Date(Date.now()).toISOString());
  }


  // Implementations
  isCorrectSymbol(marketSymbol: string): boolean {
    return marketSymbol === this.market.marketSymbol;
  }

  getMinPositionSize(): number {
    return this.market.minPositionSize;
  }

  getTickSize(): number {
    return this.market.tickSize;
  }

  getCurrentPrice(): number {
    return this.market.price;
  }

  getCurrentPriceByAccountCurrency(): number {
    return this.market.price; // @TODO: implement
  }

  getCurrentSpread(): number {
    return this.market.spread;
  }

  getLeverage(): number {
    return this.market.leverage;
  }

  getCloseTime(): string {
    throw new Error(''); // @TODO: implement
  }
}


class BrokerAccount implements BotBrokerAccount {
  private currentAccount: AccountParsedBalance;

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
    this.currentAccount = await this.api.loadConcreteAccount({
      accountId: this.accountId,
    });
  }


  // Implementations
  getAvailableAmount(): number {
    return this.currentAccount.availableAmount;
  }

  getTotalAmount(): number {
    return this.currentAccount.totalAmount;
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
