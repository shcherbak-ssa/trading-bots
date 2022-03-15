import {
  BotBroker,
  BotBrokerFactory,
  BotBrokerPosition,
  BotPosition,
  BotSettings,
  BotSignal
} from './types';

import { Calculation } from './calculation';


export class Bot {
  constructor(
    private settings: BotSettings,
    private broker: BotBroker,
    private calculation: Calculation,
    private position: BotBrokerPosition | null = null,
  ) {}


  static brokerFactory: BotBrokerFactory = new BotBrokerFactory();

  static async create(settings: BotSettings): Promise<Bot> {
    const broker: BotBroker = await Bot.brokerFactory.setupBroker(settings);
    const calculation: Calculation = new Calculation(settings, broker);

    return new Bot(settings, broker, calculation);
  }


  async processSignal(signal: BotSignal): Promise<void> {
    this.checkSignal(signal);

    const position: BotPosition = this.calculation.calculatePosition(signal);

    await this.closeOpenPosition();
    this.position = await this.broker.openPosition(position);
  }

  async updateOpenPosition(signal: BotSignal): Promise<void> {
    this.checkSignal(signal);
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
    if (this.position) {
      // @TODO: save position results
      await this.position.closePosition();
      this.position = null;
    }
  }

  private async checkPosition(): Promise<void> {}

  private async checkCloseTime(): Promise<void> {}
}
