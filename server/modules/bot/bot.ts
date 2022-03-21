import { BrokerFactory } from 'api/brokers/bot-factory';

import type { BotBroker, BotBrokerFactory, BotPosition, BotSettings, BotSignal, ClosePositionHandler } from './types';
import { Calculation } from './calculation';
import { PositionCheck } from './position-check';


export class Bot {
  constructor(
    private settings: BotSettings,
    private broker: BotBroker,
    private calculation: Calculation,
    private positionCheck: PositionCheck,
    private closePositionHandler: ClosePositionHandler,
  ) {}


  static brokerFactory: BotBrokerFactory = new BrokerFactory();

  static async create(settings: BotSettings, closePositionHandler: ClosePositionHandler): Promise<Bot> {
    const broker: BotBroker = await Bot.brokerFactory.setupBroker(settings);
    const calculation: Calculation = new Calculation(settings, broker);
    const positionCheck: PositionCheck = new PositionCheck(settings);

    return new Bot(
      settings,
      broker,
      calculation,
      positionCheck,
      closePositionHandler,
    );
  }


  async processSignal(signal: BotSignal): Promise<void> {
    this.checkSignal(signal);

    const position: BotPosition = this.calculation.calculatePosition(signal);
    await this.broker.openPosition(position);

    this.broker.market.subscribeToPriceUpdates(this.checkPosition.bind(this));
  }

  async updateOpenPosition(signal: BotSignal): Promise<void> {
    this.checkSignal(signal);

    if (this.broker.currentPosition === null) return;

    this.broker.currentPosition.stopLossPrice = signal.stopLossPrice;
  }


  private checkSignal({ brokerName, marketSymbol }: BotSignal): void {
    if (!this.broker.isCorrectBroker(brokerName)) {
      throw new Error(''); // @TODO: add extensions
    }

    if (!this.broker.market.isCorrectSymbol(marketSymbol)) {
      throw new Error(''); // @TODO: add extensions
    }
  }

  private async closeOpenPosition(): Promise<void> {
    this.broker.market.unsubscribeToPriceUpdates();

    const position: BotPosition = await this.broker.closePosition();
    this.closePositionHandler(position);
  }

  private async checkPosition(): Promise<void> {
    if (this.broker.currentPosition === null) return;

    // @TODO: check if position closed by broker system

    const { currentPosition, market } = this.broker;

    const closePosition: boolean = (
      this.positionCheck.closeByStopLoss(currentPosition, market.currentPrice) ||
      this.positionCheck.closeByTakeProfit(currentPosition, market.currentPrice)
    );

    if (closePosition) {
      return await this.closeOpenPosition();
    }
  }

  private async checkCloseTime(): Promise<void> {
    // @TODO: implement
  }
}
