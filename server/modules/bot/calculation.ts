import { FRACTION_DIGITS_TO_HUNDREDTHS, ONE_HUNDRED } from 'shared/constants';
import { roundNumber } from 'shared/utils';

import type { BotBroker, BotPosition, BotSettings, BotSignal } from './types';
import { Position } from './position';


export class Calculation {
  constructor(
    private settings: BotSettings,
    private broker: BotBroker,
  ) {}


  calculatePosition({ isLong, stopLossPrice }: BotSignal): BotPosition {
    const position: BotPosition = new Position();

    position.isLong = isLong;
    position.stopLossPrice = stopLossPrice;

    this.calculateStopLossSize(position);
    this.calculatePositionSize(position);
    this.calculateTakeProfit(position);

    return position;
  }


  // Calculations
  private calculateStopLossSize(position: BotPosition): void {
    const { currentPrice: marketCurrentPrice, currentSpread: marketCurrentSpread } = this.broker.market;

    const stopLossSizeWithoutSpread: number = position.isLong
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
      const { leverage: marketLeverage } = market;
      const marketCurrentPriceByAccountCurrency: number = market.getCurrentPriceByAccountCurrency();

      positionSize = maxAmountSize * marketLeverage / marketCurrentPriceByAccountCurrency;
      positionSize = this.roundPositionSize(positionSize);

      riskSize = roundNumber(positionSize * position.stopLossSize, FRACTION_DIGITS_TO_HUNDREDTHS);
    }

    position.riskSize = riskSize;
    position.positionSize = positionSize;
  }

  private calculateTakeProfit(position: BotPosition): void {
    if (!this.settings.useTakeProfit) return;

    const { currentPrice: marketCurrentPrice, currentSpread: marketCurrentSpread } = this.broker.market;

    const takeProfitSize: number = position.stopLossSize * this.settings.takeProfitPL;
    const takeProfitSizeWithSpread: number = marketCurrentSpread + takeProfitSize;

    const takeProfitPrice: number = position.isLong
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
    const { leverage: marketLeverage } = market;
    const marketCurrentPriceByAccountCurrency: number = market.getCurrentPriceByAccountCurrency();

    return roundNumber(
      positionSize * marketCurrentPriceByAccountCurrency / marketLeverage,
      FRACTION_DIGITS_TO_HUNDREDTHS
    );
  }


  // Helpers
  private getAccountTotalAmount(): number {
    return this.broker.account.totalAmount;
  }

  private roundPositionSize(positionSize: number): number {
    // @TODO: add zero position size calculations
    const { minPositionSize: marketMinPositionSize } = this.broker.market;

    let roundedPositionSize: number = positionSize / marketMinPositionSize;
    roundedPositionSize = Math.floor(roundedPositionSize);
    roundedPositionSize *= marketMinPositionSize;

    return roundedPositionSize;
  }
}
