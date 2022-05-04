import { SignalError } from 'shared/exceptions';

import { BrokerFactory } from 'api/brokers/bot-broker-factory';

import type { BotBroker, BotBrokerFactory, BotPosition, BotSettings, BotSignal } from './types';
import { BotErrorPlace } from './constants';
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

  setCurrentPosition(position: BotPosition): void {
    this.currentPosition = position;
    this.broker.market.subscribeToPriceUpdates(this.checkPosition.bind(this));
  }

  async openPosition(signal: BotSignal): Promise<void> {
    if (this.currentPosition !== null) {
      await this.closeOpenPosition();
    }

    const position: BotPosition = this.calculation.calculatePosition(signal);

    if (position.stopLossSize < 0) {
      throw new SignalError('Invalid position direction', {});
    }

    if (position.quantity === 0) {
      throw new SignalError('Position stop-loss is too far', {});
    }

    try {
      await this.broker.openPosition(position);

      this.setCurrentPosition(position);

      await BotEvents.processPositionOpen(this.settings.token, position);
    } catch (e: any) {
      await BotEvents.processError(this.settings.token, BotErrorPlace.POSITION_OPEN, e);
    }
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

    await BotEvents.processPositionUpdate(this.settings.token, this.currentPosition);
  }

  async closeOpenPosition(): Promise<void> {
    if (this.currentPosition === null) return;

    const position: BotPosition = this.currentPosition;
    this.currentPosition = null;

    try {
      this.broker.market.unsubscribeToPriceUpdates();

      await this.broker.closePosition(position);

      await BotEvents.processPositionClose(this.settings.token, position);
    } catch (e: any) {
      await BotEvents.processError(this.settings.token, BotErrorPlace.POSITION_CLOSE, e, position);
    }
  }


  private async checkPosition(): Promise<void> {
    if (this.currentPosition === null) return;

    const { currentPrice: marketCurrentPrice } = this.broker.market;

    const closePosition: boolean = (
      this.check.closeByStopLoss(this.currentPosition, marketCurrentPrice) ||
      this.check.closeByTakeProfit(this.currentPosition, marketCurrentPrice)
    );

    if (closePosition) {
      return await this.closeOpenPosition();
    }
  }

  private async checkCloseTime(): Promise<void> {
    throw new Error('TODO: implement');
  }
}
