import { SignalError } from 'shared/exceptions';

import { BrokerFactory } from 'api/brokers/bot-broker-factory';

import type { BotBroker, BotBrokerFactory, BotPosition, BotSettings, BotSignal } from './types';
import { AliveBotErrorPlace } from './constants';
import { BotEvents } from './bot-events';
import { PositionCalculation } from './position-calculation';
import { PositionCheck } from './position-check';


export class Bot {
  currentPosition: BotPosition | null = null;

  constructor(
    public settings: BotSettings,
    public broker: BotBroker,
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


  async openPosition(signal: BotSignal): Promise<void> {
    if (this.currentPosition !== null) {
      await this.closeOpenPosition();
    }

    const position: BotPosition = this.calculation.calculatePosition(signal);

    if (position.stopLossSize < 0) {
      throw new SignalError('Invalid position direction', {});
    }

    if (position.positionSize === 0) {
      throw new SignalError('Position stop-loss is too far', {});
    }

    await this.broker.openPosition(position);

    this.currentPosition = position;

    this.broker.market.subscribeToPriceUpdates(this.checkPosition.bind(this));

    console.info(` - info: [bot] open position - ${JSON.stringify(this.currentPosition)}`);
  }

  async updateOpenPosition(signal: BotSignal): Promise<void> {
    if (this.currentPosition === null) return;

    const { isLong, stopLossPrice } = this.currentPosition;
    const { currentPrice: marketCurrentPrice, currentSpread: marketCurrentSpread } = this.broker.market;

    const signalStopLossPrice: number = signal.stopLossPrice + ( isLong ? 0 : marketCurrentSpread );

    if (
      (isLong && (signalStopLossPrice < stopLossPrice || signalStopLossPrice >= marketCurrentPrice))
      ||
      (!isLong && (signalStopLossPrice > stopLossPrice || signalStopLossPrice <= marketCurrentPrice))
    ) {
      throw new SignalError('Received invalid stop-loss price for update', {});
    }

    this.currentPosition.stopLossPrice = signalStopLossPrice;
    console.info(` - info: [bot] update position - ${JSON.stringify(this.currentPosition)}`);
  }

  async closeOpenPosition(): Promise<void> {
    if (this.currentPosition === null) return;

    this.broker.market.unsubscribeToPriceUpdates();

    try {
      await this.broker.closePosition(this.currentPosition);

      const position: BotPosition = this.currentPosition;
      this.currentPosition = null;

      BotEvents.processPositionClosing(this.settings.token, position);
    } catch (e) {
      this.currentPosition = null;

      throw e;
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
      BotEvents.processAliveError(this.settings.token, AliveBotErrorPlace.POSITION_CLOSE, err.message);
    }
  }

  private async checkCloseTime(): Promise<void> {
    throw new Error('TODO: implement');
  }
}
