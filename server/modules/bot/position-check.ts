import type { BotPosition, BotSettings } from './types';


export class PositionCheck {
  constructor(
    private botSettings: BotSettings,
  ) {}


  closeByStopLoss({ isLong, stopLossPrice }: BotPosition, currentMarketPrice: number): boolean {
    if (stopLossPrice === currentMarketPrice) return true;

    if (isLong && stopLossPrice > currentMarketPrice) return true;

    if (!isLong && stopLossPrice < currentMarketPrice) return true;

    return false;
  }

  closeByTakeProfit({ isLong, takeProfitPrice }: BotPosition, currentMarketPrice: number): boolean {
    if (!this.botSettings.tradeWithTakeProfit || takeProfitPrice === 0) return false;

    if (takeProfitPrice === currentMarketPrice) return true;

    if (isLong && takeProfitPrice < currentMarketPrice) return true;

    if (!isLong && takeProfitPrice > currentMarketPrice) return true;

    return false;
  }
}
