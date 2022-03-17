import { BrokerAccountType } from 'global/constants';
import { PositionType } from 'shared/constants';


// Bot
export type BotSettings = {
  id: string;
  brokerName: string;
  brokerApiKeys: string[];
  brokerMarketSymbol: string;
  brokerAccountId: string;
  brokerAccountType: BrokerAccountType;
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


// Bot Broker
export class BotBrokerFactory {
  abstract setupBroker(settings: BotSettings): Promise<BotBroker>;
}

export interface BotBroker {
  market: BotBrokerMarket;
  account: BotBrokerAccount;
  currentOpenPosition: BotPosition | null;
  isCorrectBroker(name: string): boolean;
  openPosition(position: BotPosition): Promise<void>;
  closePosition(): Promise<BotPosition>;
}

export interface BotBrokerMarket {
  isCorrectSymbol(marketSymbol: string): boolean;
  getMinPositionSize(): number;
  getTickSize(): number;
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
