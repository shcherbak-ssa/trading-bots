import { PositionType } from 'shared/types';


/* Bot */
export type BotSettings = {
  id: string;
  brokerName: string;
  brokerApiKeys: string[];
  brokerMarketSymbol: string;
  brokerAccountId: string;
  accountAmountPerPositionPercent: number;
  riskPercent: number;
  useTakeProfit: boolean;
  takeProfitPL: number;
  closeAtDayEnd: boolean;
  closeAtWeekEnd: boolean;
}

export type BotSignal = {
  botId: string;
  type: PositionType;
  brokerName: string;
  marketSymbol: string;
  stopLossPrice: number;
}

export type BotPosition = {
  type: PositionType;
  riskSize: number;
  positionSize: number;
  stopLossPrice: number;
  stopLossSize: number
  takeProfitPrice: number | null;
  takeProfitSize: number | null;
}


/* Bot Broker */
export class BotBrokerFactory {
  abstract setupBroker(settings: BotSettings): Promise<BotBroker>;
}

export interface BotBroker {
  market: BotBrokerMarket;
  account: BotBrokerAccount;
  isCorrectBroker(name: string): boolean;
  openPosition(position: BotPosition): Promise<BotBrokerPosition>;
}

export interface BotBrokerMarket {
  isCorrectSymbol(marketSymbol): boolean;
  getMinTradeSize(): number;
  getCurrentPrice(): number;
  getCurrentPriceByAccountCurrency(): number;
  getCurrentSpread(): number;
  getLeverage(): number;
  getCloseTime(): string;
}

export interface BotBrokerAccount {
  getAvailableAmount(): number;
  getTotalAmount(): number;
}

export interface BotBrokerPosition {
  isClose(): boolean;
  getPositionType(): PositionType;
  getStopLossPrice(): number;
  getTakeProfitPrice(): number;
  updateStopLoss(price: number): Promise<void>;
  updateTakeProfit(price: number): Promise<void>;
  closePosition(): Promise<BotPosition>;
}
