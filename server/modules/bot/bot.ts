import { BotError } from 'shared/exceptions';
import { BrokerFactory } from 'api/brokers/bot-broker-factory';

import type { BotBroker, BotBrokerFactory, BotPosition, BotSettings, BotSignal } from './types';
import { AliveBotErrorPlace } from './constants';
import { botController } from './bot-controller';
import { PositionCalculation } from './position-calculation';
import { PositionCheck } from './position-check';


export class Bot {
  currentPosition: BotPosition | null = null;

  constructor(
    public settings: BotSettings,
    private broker: BotBroker,
    private calculation: PositionCalculation,
    private check: PositionCheck,
  ) {}


  static brokerFactory: BotBrokerFactory = new BrokerFactory();

  static async create(settings: BotSettings): Promise<Bot> {
    const broker: BotBroker = await Bot.brokerFactory.setupBroker(settings);
    const calculation: PositionCalculation = new PositionCalculation(settings, broker);
    const check: PositionCheck = new PositionCheck(settings);

    return new Bot(
      settings,
      broker,
      calculation,
      check,
    );
  }


  async processSignal(signal: BotSignal): Promise<void> {
    this.checkSignal(signal);

    if (this.currentPosition !== null) {
      await this.closeOpenPosition();
    }

    const position: BotPosition = this.calculation.calculatePosition(signal);
    await this.broker.openPosition(position);

    this.broker.market.subscribeToPriceUpdates(this.checkPosition.bind(this));
  }

  async updateOpenPosition(signal: BotSignal): Promise<void> {
    this.checkSignal(signal);

    if (this.currentPosition === null) return;

    this.currentPosition.stopLossPrice = signal.stopLossPrice;
  }

  async closeOpenPosition(): Promise<void> {
    if (this.currentPosition === null) return;

    this.broker.market.unsubscribeToPriceUpdates();

    await this.broker.closePosition(this.currentPosition);

    botController.processPositionClosing(this.settings.id, this.currentPosition);

    this.currentPosition = null;
  }


  private checkSignal({ brokerName, marketSymbol }: BotSignal): void {
    if (!this.broker.isCorrectBroker(brokerName)) {
      throw new BotError(`Incorrect Broker - expected ${this.broker.name}, actual ${brokerName}`);
    }

    if (!this.broker.market.isCorrectSymbol(marketSymbol)) {
      throw new BotError(`Incorrect Symbol - expected ${this.broker.market.symbol}, actual ${marketSymbol}`);
    }
  }

  private async checkPosition(): Promise<void> {
    try {
      if (this.currentPosition === null) return;

      const { currentPrice: marketCurrentPrice } = this.broker.market;

      const closePosition: boolean = (
        this.check.closeByStopLoss(this.currentPosition, marketCurrentPrice) ||
        this.check.closeByTakeProfit(this.currentPosition, marketCurrentPrice)
      );

      if (closePosition) {
        return await this.closeOpenPosition();
      }
    } catch (err: any) {
      botController.processAliveBotError(this.settings.id, AliveBotErrorPlace.POSITION_CLOSE, err.message);
    }
  }

  private async checkCloseTime(): Promise<void> {
    throw new Error('TODO: implement');
  }
}
