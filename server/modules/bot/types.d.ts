import type { Bot, BrokerApiKeys } from 'global/types';
import { BrokerName } from 'global/constants';


// Bot
export type BotSettings = Bot & {
  brokerApiKeys: BrokerApiKeys;
}

export type BotSignal = {
  isLong: boolean;
  stopLossPrice: number;
}

export interface BotPosition {
  id: string;
  brokerPositionIds: string[];
  isLong: boolean;
  riskSize: number;
  marketSymbol: string;
  quantity: number;
  stopLossPrice: number;
  stopLossSize: number;
  takeProfitPrice: number;
  takeProfitSize: number;
  feeOpen: number;
  feeClose: number;
  result: number;
}


// Bot Broker
export interface BotBrokerFactory {
  setupBroker(settings: BotSettings): Promise<BotBroker>;
}

export interface BotBroker {
  name: BrokerName;
  market: BotBrokerMarket;
  account: BotBrokerAccount;
  openPosition(position: BotPosition): Promise<void>;
  closePosition(position: BotPosition): Promise<void>;
}

export interface BotBrokerMarket {
  symbol: string;
  minQuantity: number;
  tickSize: number;
  leverage: number;
  commission: number;
  currentPrice: number;
  currentSpread: number;
  getCloseTime(): string;
  subscribeToPriceUpdates(callback: () => void): void;
  unsubscribeToPriceUpdates(): void;
}

export interface BotBrokerAccount {
  availableAmount: number;
  totalAmount: number;
}
