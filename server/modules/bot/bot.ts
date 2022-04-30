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
    console.log('open', signal);

    // if (this.currentPosition !== null) {
    //   await this.closeOpenPosition();
    // }
    //
    // const position: BotPosition = this.calculation.calculatePosition(signal);
    // await this.broker.openPosition(position);
    //
    // this.broker.market.subscribeToPriceUpdates(this.checkPosition.bind(this));
  }

  async updateOpenPosition(signal: BotSignal): Promise<void> {
    console.log('update', signal);

    // if (this.currentPosition === null) return;
    //
    // this.currentPosition.stopLossPrice = signal.stopLossPrice;
  }

  async closeOpenPosition(): Promise<void> {
    if (this.currentPosition === null) return;

    this.broker.market.unsubscribeToPriceUpdates();

    await this.broker.closePosition(this.currentPosition);

    BotEvents.processPositionClosing(this.settings.token, this.currentPosition);

    this.currentPosition = null;
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
