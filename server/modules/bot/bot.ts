import { BotBroker, BotBrokerFactory, BotPosition, BotSettings, BotSignal } from './types';
import { Calculation } from './calculation';


export class Bot {
  constructor(
    private settings: BotSettings,
    private broker: BotBroker,
    private calculation: Calculation,
  ) {}


  static brokerFactory: BotBrokerFactory = new BotBrokerFactory();

  static async create(settings: BotSettings): Promise<Bot> {
    const broker: BotBroker = await Bot.brokerFactory.setupBroker(settings);
    const calculation: Calculation = new Calculation(settings, broker);

    return new Bot(settings, broker, calculation);
  }


  async processSignal(signal: BotSignal): Promise<void> {
    this.checkSignal(signal);

    // @TODO: implement
  }

  async updateOpenPosition(signal: BotSignal): Promise<void> {
    this.checkSignal(signal);

    // @TODO: implement
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
    // @TODO: implement
  }

  private async checkPosition(): Promise<void> {
    // @TODO: implement
  }

  private async checkCloseTime(): Promise<void> {
    // @TODO: implement
  }
}
