import { ONE_HUNDRED, FRACTION_DIGITS_TO_HUNDREDTHS } from 'global/constants';
import { calculateProportion, roundNumber } from 'global/utils';

import { getFractionDigits } from 'shared/utils';

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
    this.calculateQuantity(position);
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

  private calculateQuantity(position: BotPosition): void {
    const { commission: marketCommission, minQuantity: marketMinQuantity } = this.broker.market;

    const openCommission: number = this.getOpenCommission(position);
    const closeCommission: number = calculateProportion(position.stopLossPrice, marketCommission);
    const totalCommission: number = openCommission + closeCommission;

    let riskSize: number = this.getRiskSize();
    let quantity: number = riskSize / ( position.stopLossSize + totalCommission );

    const capitalAmount: number = this.getCapitalSize();
    const positionAmount: number = this.getPositionAmount(position, quantity);

    if (positionAmount >= capitalAmount) {
      const openPrice: number = this.getOpenPrice(position);
      const marketLeverage: number = this.getMarketLeverage();

      quantity = capitalAmount * marketLeverage / ( openPrice + totalCommission );
    }

    quantity = this.roundQuantity(quantity);
    riskSize = quantity * ( position.stopLossSize + totalCommission );

    position.riskSize = roundNumber(riskSize, FRACTION_DIGITS_TO_HUNDREDTHS);
    position.quantity = roundNumber(quantity, getFractionDigits(marketMinQuantity));
  }

  private calculateTakeProfit(position: BotPosition): void {
    if (!this.botSettings.tradeWithTakeProfit) return;

    const { commission: marketCommission, tickSize: marketTickSize } = this.broker.market;
    const commissionFactor: number = marketCommission / ONE_HUNDRED;

    const openPrice: number = this.getOpenPrice(position);
    const openCommission: number = this.getOpenCommission(position);
    const closeCommissionFactor: number = position.isLong ? 1 - commissionFactor : 1 + commissionFactor;
    const profitWithoutCommission: number = this.getRiskSize() * this.botSettings.tradeTakeProfitPL;

    const takeProfitSize: number
      = ( profitWithoutCommission / position.quantity + 2 * openCommission ) / closeCommissionFactor;

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
    return calculateProportion(this.getCapitalSize(), this.botSettings.tradeRiskPercent);
  }

  private getCapitalSize(): number {
    return calculateProportion(this.broker.account.totalAmount, this.botSettings.tradeCapitalPercent);
  }

  private getPositionAmount(position: BotPosition, positionSize: number): number {
    const openPrice: number = this.getOpenPrice(position);
    const marketLeverage: number = this.getMarketLeverage();

    return roundNumber(positionSize * openPrice / marketLeverage, FRACTION_DIGITS_TO_HUNDREDTHS);
  }

  private getMarketLeverage(): number {
    if (this.botSettings.tradeWithCustomMarketLeverage) {
      return this.botSettings.tradeCustomMarketLeverage;
    }

    return this.broker.market.leverage;
  }

  private roundQuantity(quantity: number): number {
    const { minQuantity: marketMinQuantity } = this.broker.market;

    let roundedQuantity: number = quantity / marketMinQuantity;
    roundedQuantity = Math.floor(roundedQuantity);
    roundedQuantity = roundedQuantity * marketMinQuantity;

    return roundedQuantity;
  }

  private getOpenCommission(position: BotPosition): number {
    const { commission: marketCommission } = this.broker.market;

    return calculateProportion(this.getOpenPrice(position), marketCommission);
  }
}
