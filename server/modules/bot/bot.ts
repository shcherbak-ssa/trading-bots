import { ErrorReason, ErrorSolution } from 'shared/constants';
import { BotError } from 'shared/exceptions';
import { BrokerFactory } from 'api/brokers/bot-broker-factory';

import type { BotBroker, BotBrokerFactory, BotPosition, BotSettings, BotSignal, ClosePositionHandler } from './types';
import { PositionCalculation } from './position-calculation';
import { PositionCheck } from './position-check';


export class Bot {
  constructor(
    private settings: BotSettings,
    private broker: BotBroker,
    private calculation: PositionCalculation,
    private check: PositionCheck,
    private closePositionHandler: ClosePositionHandler,
  ) {}


  static brokerFactory: BotBrokerFactory = new BrokerFactory();

  static async create(settings: BotSettings, closePositionHandler: ClosePositionHandler): Promise<Bot> {
    const broker: BotBroker = await Bot.brokerFactory.setupBroker(settings);
    const calculation: PositionCalculation = new PositionCalculation(settings, broker);
    const check: PositionCheck = new PositionCheck(settings);

    // @TODO: check if min position size is zero

    return new Bot(
      settings,
      broker,
      calculation,
      check,
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
      throw new BotError('Incorrect Broker', {
        reason: ErrorReason.INVALID_SIGNAL,
        expected: this.broker.name,
        actual: brokerName,
        solution: ErrorSolution.CHECK_STRATEGY_SCRIPT,
      });
    }

    if (!this.broker.market.isCorrectSymbol(marketSymbol)) {
      throw new BotError('Incorrect Symbol', {
        reason: ErrorReason.INVALID_SIGNAL,
        expected: this.broker.market.symbol,
        actual: marketSymbol,
        solution: ErrorSolution.CHECK_STRATEGY_SCRIPT,
      });
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
      this.check.closeByStopLoss(currentPosition, market.currentPrice) ||
      this.check.closeByTakeProfit(currentPosition, market.currentPrice)
    );

    if (closePosition) {
      return await this.closeOpenPosition();
    }
  }

  private async checkCloseTime(): Promise<void> {
    // @TODO: implement
  }
}
