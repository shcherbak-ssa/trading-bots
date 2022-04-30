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
  brokerPositionId: string;
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
  name: BrokerName;
  market: BotBrokerMarket;
  account: BotBrokerAccount;
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
  getCloseTime(): string;
  subscribeToPriceUpdates(callback: () => void): void;
  unsubscribeToPriceUpdates(): void;
}

export interface BotBrokerAccount {
  availableAmount: number;
  totalAmount: number;
}
