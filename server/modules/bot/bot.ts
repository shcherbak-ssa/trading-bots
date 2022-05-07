import type { Signal } from 'shared/types';
import { SignalError } from 'shared/exceptions';

import { BrokerFactory } from 'api/brokers/bot-broker-factory';

import type { BotBroker, BotBrokerFactory, BotPosition, BotSettings, BotSignal } from './types';
import { BotErrorPlace } from './constants';
import { BotEvents } from './bot-events';
import { PositionCalculation } from './position-calculation';
import { PositionCheck } from './position-check';


export class Bot {
  currentPosition: BotPosition | null = null;
  private checkInProgress: boolean = false;

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

  setCurrentPosition(position: BotPosition | null): void {
    this.currentPosition = position;

    if (position) {
      this.broker.market.subscribeToPriceUpdates(this.checkPosition.bind(this));
    } else {
      this.broker.market.unsubscribeToPriceUpdates();
    }
  }

  async openPosition(botSignal: BotSignal, signal: Signal): Promise<void> {
    if (this.currentPosition !== null) {
      await this.closeOpenPosition();
    }

    const position: BotPosition = this.calculation.calculatePosition(botSignal);

    if (position.stopLossSize < 0) {
      throw new SignalError('Invalid position direction.', this.settings, signal);
    }

    if (position.quantity === 0) {
      throw new SignalError('Position stop-loss is too far.', this.settings, signal);
    }

    try {
      await this.broker.openPosition(position);

      this.setCurrentPosition(position);

      await BotEvents.processPositionOpen(this.settings.token, position);
    } catch (e: any) {
      await BotEvents.processError(this.settings.token, BotErrorPlace.POSITION_OPEN, e);
    }
  }

  async updateOpenPosition(botSignal: BotSignal, signal: Signal): Promise<void> {
    if (this.currentPosition === null) return;

    const { isLong, stopLossPrice } = this.currentPosition;
    const { currentPrice: marketCurrentPrice, currentSpread: marketCurrentSpread } = this.broker.market;

    const signalStopLossPrice: number = botSignal.stopLossPrice + ( isLong ? 0 : marketCurrentSpread );

    if (
      (isLong && (signalStopLossPrice <= stopLossPrice || signalStopLossPrice >= marketCurrentPrice))
      ||
      (!isLong && (signalStopLossPrice >= stopLossPrice || signalStopLossPrice <= marketCurrentPrice))
    ) {
      throw new SignalError('Received invalid stop-loss price for update.', this.settings, signal);
    }

    this.currentPosition.stopLossPrice = signalStopLossPrice;

    await BotEvents.processPositionUpdate(this.settings.token, this.currentPosition);
  }

  async closeOpenPosition(): Promise<void> {
    if (this.currentPosition === null) return;

    try {
      const position: BotPosition = this.currentPosition;

      await this.broker.closePosition(position);

      this.setCurrentPosition(null);

      await BotEvents.processPositionClose(this.settings.token, position);
    } catch (e: any) {
      await BotEvents.processError(this.settings.token, BotErrorPlace.POSITION_CLOSE, e);
    }
  }


  private async checkPosition(): Promise<void> {
    if (this.currentPosition === null || this.checkInProgress) return;

    this.checkInProgress = true;

    const { currentPrice: marketCurrentPrice } = this.broker.market;

    const needToClosePosition: boolean = (
      this.check.closeByStopLoss(this.currentPosition, marketCurrentPrice) ||
      this.check.closeByTakeProfit(this.currentPosition, marketCurrentPrice)
    );

    if (needToClosePosition) {
      await this.closeOpenPosition();
    }

    this.checkInProgress = false;
  }
}
