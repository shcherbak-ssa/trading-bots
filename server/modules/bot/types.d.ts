import { BrokerAccountType } from 'global/constants';


// Bot
export type ClosePositionHandler = (position: BotPosition) => void;

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
  isLong: boolean;
  brokerName: string;
  marketSymbol: string;
  stopLossPrice: number;
}

export interface BotPosition {
  id: string;
  isLong: boolean;
  riskSize: number;
  positionSize: number;
  stopLossPrice: number;
  stopLossSize: number
  takeProfitPrice: number | null;
  takeProfitSize: number | null;
  feeOpen: number | null;
  feeClose: number | null;
}


// Bot Broker
export interface BotBrokerFactory {
  setupBroker(settings: BotSettings): Promise<BotBroker>;
}

export interface BotBroker {
  name: string;
  market: BotBrokerMarket;
  account: BotBrokerAccount;
  currentPosition: BotPosition | null;
  isCorrectBroker(name: string): boolean;
  openPosition(position: BotPosition): Promise<void>;
  closePosition(): Promise<BotPosition>;
}

export interface BotBrokerMarket {
  symbol: string;
  minPositionSize: number;
  tickSize: number;
  leverage: number;
  currentPrice: number;
  currentSpread: number;
  isCorrectSymbol(marketSymbol: string): boolean;
  getCurrentPriceByAccountCurrency(): number; // @TODO: implement and convert to property
  getCloseTime(): string;
  subscribeToPriceUpdates(callback: () => void): void;
  unsubscribeToPriceUpdates(): void;
}

export interface BotBrokerAccount {
  availableAmount: number;
  totalAmount: number;
}
