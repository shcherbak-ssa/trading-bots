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
    const { currentSpread: marketCurrentSpread } = this.broker.market;

    position.isLong = isLong;
    position.stopLossPrice = stopLossPrice + ( isLong ? 0 : marketCurrentSpread );
    position.marketSymbol = this.botSettings.brokerMarketSymbol;

    this.calculateStopLossSize(position);
    this.calculatePositionSize(position);
    this.calculateTakeProfit(position);

    return position;
  }


  // Calculations
  private calculateStopLossSize(position: BotPosition): void {
    const { tickSize: marketTickSize } = this.broker.market;
    const openPrice: number = this.getOpenPrice(position);

    const stopLossSize: number = position.isLong
      ? openPrice - position.stopLossPrice
      : position.stopLossPrice - openPrice;

    position.stopLossSize = roundNumber(stopLossSize, getFractionDigits(marketTickSize));
  }

  private calculatePositionSize(position: BotPosition): void {
    const { commission: marketCommission, minPositionSize: marketMinPositionSize } = this.broker.market;

    const openCommission: number = this.getOpenCommission(position);
    const closeCommission: number = position.stopLossPrice * marketCommission / ONE_HUNDRED;
    const totalCommission: number = openCommission + closeCommission;

    let riskSize: number = this.getRiskSize();
    let positionSize: number = riskSize / ( position.stopLossSize + totalCommission );

    const capitalAmount: number = this.getCapitalSize();
    const positionAmount: number = this.getPositionAmount(position, positionSize);

    if (positionAmount >= capitalAmount) {
      const openPrice: number = this.getOpenPrice(position);
      const marketLeverage: number = this.getMarketLeverage();

      positionSize = capitalAmount * marketLeverage / ( openPrice + totalCommission );
    }

    positionSize = this.roundPositionSize(positionSize);
    riskSize = positionSize * ( position.stopLossSize + totalCommission );

    position.riskSize = roundNumber(riskSize, FRACTION_DIGITS_TO_HUNDREDTHS);
    position.positionSize = roundNumber(positionSize, getFractionDigits(marketMinPositionSize));
  }

  private calculateTakeProfit(position: BotPosition): void {
    if (!this.botSettings.tradeWithTakeProfit) return;

    const { commission: marketCommission, tickSize: marketTickSize } = this.broker.market;
    const commissionFactor: number = marketCommission / ONE_HUNDRED;

    const openPrice: number = this.getOpenPrice(position);
    const openCommission: number = this.getOpenCommission(position);
    const closeCommissionFactor: number = position.isLong ? 1 - commissionFactor : 1 + commissionFactor;
    const profitWithoutCommission: number = position.riskSize * this.botSettings.tradeTakeProfitPL;

    const takeProfitSize: number
      = ( profitWithoutCommission / position.positionSize + 2 * openCommission ) / closeCommissionFactor;

    const takeProfitPrice: number = position.isLong
      ? openPrice + takeProfitSize
      : openPrice - takeProfitSize;

    const tickFractionDigits: number = getFractionDigits(marketTickSize);

    position.takeProfitSize = roundNumber(takeProfitSize, tickFractionDigits);
    position.takeProfitPrice = roundNumber(takeProfitPrice, tickFractionDigits);
  }


  // Helpers
  private getOpenPrice({ isLong }: BotPosition): number {
    const { currentPrice: marketCurrentPrice, currentSpread: marketCurrentSpread } = this.broker.market;

    return marketCurrentPrice + ( isLong ? marketCurrentSpread : 0 );
  }

  private getRiskSize(): number {
    return this.getCapitalSize() * this.botSettings.tradeRiskPercent / ONE_HUNDRED;
  }

  private getCapitalSize(): number {
    return this.broker.account.totalAmount * this.botSettings.tradeCapitalPercent / ONE_HUNDRED;
  }

  private getPositionAmount(position: BotPosition, positionSize: number): number {
    const openPrice: number = this.getOpenPrice(position);
    const marketLeverage: number = this.getMarketLeverage();

    return roundNumber(positionSize * openPrice / marketLeverage, FRACTION_DIGITS_TO_HUNDREDTHS);
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

  private getOpenCommission(position: BotPosition): number {
    const { commission: marketCommission } = this.broker.market;

    return this.getOpenPrice(position) * marketCommission / ONE_HUNDRED;
  }
}
