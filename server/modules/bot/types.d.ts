import { BrokerAccountType, BrokerName } from 'global/constants';


// Bot
export type BotSettings = {
  botId: string;
  brokerName: BrokerName;
  brokerApiKeys: string[];
  brokerMarketSymbol: string;
  brokerAccountId: string;
  brokerAccountType: BrokerAccountType;
  accountAmountPercentUseForBot: number;
  riskPercent: number;
  useTakeProfit: boolean;
  takeProfitPL: number;
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
  marketSymbol: string;
  positionSize: number;
  stopLossPrice: number;
  stopLossSize: number
  takeProfitPrice: number | null;
  takeProfitSize: number | null;
  feeOpen: number | null;
  feeClose: number | null
  result: number;
}


// Bot Broker
export interface BotBrokerFactory {
  setupBroker(settings: BotSettings): Promise<BotBroker>;
}

export interface BotBroker {
  name: string;
  market: BotBrokerMarket;
  account: BotBrokerAccount;
  isCorrectBroker(name: string): boolean;
  openPosition(position: BotPosition): Promise<void>;
  closePosition(position: BotPosition): Promise<void>;
}

export interface BotBrokerMarket {
  symbol: string;
  minPositionSize: number;
  tickSize: number;
  leverage: number;
  commission: number;
  currentPrice: number;
  currentSpread: number;
  isCorrectSymbol(marketSymbol: string): boolean;
  getCloseTime(): string;
  subscribeToPriceUpdates(callback: () => void): void;
  unsubscribeToPriceUpdates(): void;
}

export interface BotBrokerAccount {
  availableAmount: number;
  totalAmount: number;
}
