import { FRACTION_DIGITS_TO_HUNDREDTHS, ONE_HUNDRED } from 'shared/constants';
import { getFractionDigits, roundNumber } from 'shared/utils';

import type { BotBroker, BotPosition, BotSettings, BotSignal } from './types';
import { Position } from './position';


export class PositionCalculation {
  constructor(
    private botSettings: BotSettings,
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
    // @TODO: add commission calculation

    const { currentPrice: marketCurrentPrice, currentSpread: marketCurrentSpread } = this.broker.market;

    const stopLossSizeWithoutSpread: number = position.isLong
      ? marketCurrentPrice - position.stopLossPrice
      : position.stopLossPrice - marketCurrentPrice;

    position.stopLossSize = marketCurrentSpread + stopLossSizeWithoutSpread;
  }

  private calculatePositionSize(position: BotPosition): void {
    let riskSize: number, positionSize: number;

    const maxAmountSize: number = this.getMaxAmountSize();

    riskSize = this.getRiskSize();
    positionSize = riskSize / position.stopLossSize;
    positionSize = this.roundPositionSize(positionSize);

    const positionAmount: number = this.getPositionAmount(positionSize);

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
    if (!this.botSettings.useTakeProfit) return;

    const {
      currentPrice: marketCurrentPrice,
      currentSpread: marketCurrentSpread,
      tickSize: marketTickSize,
    } = this.broker.market;

    const takeProfitSize: number = position.stopLossSize * this.botSettings.takeProfitPL;
    const takeProfitSizeWithSpread: number = marketCurrentSpread + takeProfitSize;

    const takeProfitPrice: number = position.isLong
      ? takeProfitSizeWithSpread + marketCurrentPrice
      : marketCurrentPrice - takeProfitSizeWithSpread;

    position.takeProfitSize = takeProfitSize;
    position.takeProfitPrice = roundNumber(takeProfitPrice, getFractionDigits(marketTickSize));
  }


  // Helpers
  private getRiskSize(): number {
    return (this.getAccountTotalAmount() * this.botSettings.riskPercent) / ONE_HUNDRED;
  }

  private getMaxAmountSize(): number {
    return (this.getAccountTotalAmount() * this.botSettings.accountAmountPerPositionPercent) / ONE_HUNDRED;
  }

  private getPositionAmount(positionSize: number): number {
    const { market } = this.broker;
    const { leverage: marketLeverage } = market;
    const marketCurrentPriceByAccountCurrency: number = market.getCurrentPriceByAccountCurrency();

    return roundNumber(
      positionSize * marketCurrentPriceByAccountCurrency / marketLeverage,
      FRACTION_DIGITS_TO_HUNDREDTHS
    );
  }

  private getAccountTotalAmount(): number {
    return this.broker.account.totalAmount;
  }

  private roundPositionSize(positionSize: number): number {
    const { minPositionSize: marketMinPositionSize } = this.broker.market;

    let roundedPositionSize: number = positionSize / marketMinPositionSize;
    roundedPositionSize = Math.floor(roundedPositionSize);
    roundedPositionSize *= marketMinPositionSize;

    return roundedPositionSize;
  }
}
