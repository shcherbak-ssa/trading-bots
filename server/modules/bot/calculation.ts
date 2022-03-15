import { ONE_HUNDRED } from 'shared/constants';
import { PositionType } from 'shared/types';
import { roundToHundredths } from 'shared/utils/math';

import type { BotBroker, BotPosition, BotSettings, BotSignal } from './types';
import { Position } from './position';


export class Calculation {
  constructor(
    private settings: BotSettings,
    private broker: BotBroker,
  ) {}


  calculatePosition({ type, stopLossPrice }: BotSignal): BotPosition {
    const position: BotPosition = new Position();

    position.type = type;
    position.stopLossPrice = stopLossPrice;

    this.calculateStopLossSize(position);
    this.calculatePositionSize(position);
    this.calculateTakeProfit(position);

    return position;
  }


  // Calculations
  private calculateStopLossSize(position: BotPosition): void {
    const { market } = this.broker;
    const marketCurrentPrice: number = market.getCurrentPrice();
    const marketCurrentSpread: number = market.getCurrentSpread();

    const stopLossSizeWithoutSpread: number = this.isLongSignal(position)
      ? marketCurrentPrice - position.stopLossPrice
      : position.stopLossPrice - marketCurrentPrice;

    position.stopLossSize = marketCurrentSpread + stopLossSizeWithoutSpread;
  }

  private calculatePositionSize(position: BotPosition): void {
    let riskSize: number, positionSize: number;

    const maxAmountSize: number = this.calculateMaxAmountSize();

    riskSize = this.calculateRiskSize();
    positionSize = riskSize / position.stopLossSize;
    positionSize = this.roundPositionSize(positionSize);

    const positionAmount: number = this.calculatePositionAmount(positionSize);

    if (positionAmount > maxAmountSize) {
      const { market } = this.broker;
      const marketCurrentPriceByAccountCurrency: number = market.getCurrentPriceByAccountCurrency();
      const marketLeverage: number = market.getLeverage();

      positionSize = maxAmountSize * marketLeverage / marketCurrentPriceByAccountCurrency;
      positionSize = this.roundPositionSize(positionSize);

      riskSize = roundToHundredths(positionSize * position.stopLossSize);
    }

    position.riskSize = riskSize;
    position.positionSize = positionSize;
  }

  private calculateTakeProfit(position: BotPosition): void {
    if (!this.settings.useTakeProfit) return;

    const { market } = this.broker;
    const marketCurrentPrice: number = market.getCurrentPrice();
    const marketCurrentSpread: number = market.getCurrentSpread();

    const takeProfitSize: number = position.stopLossSize * this.settings.takeProfitPL;
    const takeProfitSizeWithSpread: number = marketCurrentSpread + takeProfitSize;

    const takeProfitPrice: number = this.isLongSignal(position)
      ? takeProfitSizeWithSpread + marketCurrentPrice
      : marketCurrentPrice - takeProfitSizeWithSpread;

    position.takeProfitSize = takeProfitSize;
    position.takeProfitPrice = takeProfitPrice; // @TODO: add round to mintick
  }

  private calculateRiskSize(): number {
    return (this.getAccountTotalAmount() * this.settings.riskPercent) / ONE_HUNDRED;
  }

  private calculateMaxAmountSize(): number {
    return (this.getAccountTotalAmount() * this.settings.accountAmountPerPositionPercent) / ONE_HUNDRED;
  }

  private calculatePositionAmount(positionSize: number): number {
    const { market } = this.broker;
    const marketCurrentPriceByAccountCurrency: number = market.getCurrentPriceByAccountCurrency();
    const marketLeverage: number = market.getLeverage();

    return roundToHundredths(positionSize * marketCurrentPriceByAccountCurrency / marketLeverage);
  }


  // Helpers
  private isLongSignal(position: BotPosition): boolean {
    return position.type === PositionType.LONG;
  }

  private getAccountTotalAmount(): number {
    return this.broker.account.getTotalAmount();
  }

  private roundPositionSize(positionSize: number): number {
    const marketMinTradeSize: number = this.broker.market.getMinTradeSize();

    let roundedPositionSize: number = positionSize / marketMinTradeSize;
    roundedPositionSize = Math.floor(roundedPositionSize);
    roundedPositionSize *= marketMinTradeSize;

    return roundedPositionSize;
  }
}
