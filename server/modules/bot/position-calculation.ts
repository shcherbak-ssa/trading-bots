import { FRACTION_DIGITS_TO_HUNDREDTHS, ONE_HUNDRED } from 'shared/constants';
import { getFractionDigits, roundNumber } from 'shared/utils';

import type { BotBroker, BotPosition, BotSettings, BotSignal } from './types';
import { TAKE_COMMISSION_TIMES, ZERO_COMMISSION } from './constants';
import { Position } from './position';


export class PositionCalculation {
  constructor(
    private botSettings: BotSettings,
    private broker: BotBroker,
  ) {}


  calculatePosition({ isLong, stopLossPrice, marketSymbol }: BotSignal): BotPosition {
    const position: BotPosition = new Position();

    position.isLong = isLong;
    position.stopLossPrice = stopLossPrice;
    position.marketSymbol = marketSymbol;

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
    let riskSize: number = this.getRiskSize();

    let positionSize: number = this.broker.market.commission === ZERO_COMMISSION
      ? this.getPositionSizeWithoutCommission(position)
      : this.getPositionSizeWithCommission(position);

    // @TODO: compare position size with min lot size

    const capitalSize: number = this.getCapitalSize();
    const positionAmount: number = this.getPositionAmount(positionSize);

    if (positionAmount > capitalSize) {
      const { currentPrice: marketCurrentPrice } = this.broker.market;
      const marketLeverage = this.getMarketLeverage();

      positionSize = capitalSize * marketLeverage / marketCurrentPrice;
      riskSize = positionSize * position.stopLossSize;
    }

    position.riskSize = roundNumber(riskSize, FRACTION_DIGITS_TO_HUNDREDTHS);
    position.positionSize = this.roundPositionSize(positionSize);
  }

  private calculateTakeProfit(position: BotPosition): void {
    if (!this.botSettings.tradeWithTakeProfit) return;

    const {
      currentPrice: marketCurrentPrice,
      currentSpread: marketCurrentSpread,
      tickSize: marketTickSize,
    } = this.broker.market;

    const takeProfitSize: number = position.stopLossSize * this.botSettings.tradeTakeProfitPL;
    const takeProfitSizeWithSpread: number = marketCurrentSpread + takeProfitSize;

    const takeProfitPrice: number = position.isLong
      ? takeProfitSizeWithSpread + marketCurrentPrice
      : marketCurrentPrice - takeProfitSizeWithSpread;

    position.takeProfitSize = takeProfitSize;
    position.takeProfitPrice = roundNumber(takeProfitPrice, getFractionDigits(marketTickSize));
  }


  // Helpers
  private getRiskSize(): number {
    return this.getCapitalSize() * this.botSettings.tradeRiskPercent / ONE_HUNDRED;
  }

  private getCapitalSize(): number {
    return this.broker.account.totalAmount * this.botSettings.tradeCapitalPercent / ONE_HUNDRED;
  }

  private getPositionAmount(positionSize: number): number {
    const { currentPrice: marketCurrentPrice } = this.broker.market;
    const marketLeverage = this.getMarketLeverage();

    return roundNumber(positionSize * marketCurrentPrice / marketLeverage, FRACTION_DIGITS_TO_HUNDREDTHS);
  }

  private getMarketLeverage(): number {
    if (this.botSettings.tradeWithCustomMarketLeverage) {
      return this.botSettings.tradeMarketLeverage;
    }

    return this.broker.market.leverage;
  }

  private roundPositionSize(positionSize: number): number {
    const { minPositionSize: marketMinPositionSize } = this.broker.market;

    let roundedPositionSize: number = positionSize / marketMinPositionSize;
    roundedPositionSize = Math.floor(roundedPositionSize);
    roundedPositionSize = roundedPositionSize * marketMinPositionSize;

    return roundedPositionSize;
  }

  private getPositionSizeWithoutCommission({ stopLossSize }: BotPosition): number {
    return this.getRiskSize() / stopLossSize;
  }

  private getPositionSizeWithCommission({ stopLossSize }: BotPosition): number {
    const { currentPrice: marketCurrentPrice, commission: marketCommission } = this.broker.market;

    return (
      this.getRiskSize() /
      (TAKE_COMMISSION_TIMES * marketCurrentPrice * marketCommission / ONE_HUNDRED + stopLossSize)
    );
  }
}
