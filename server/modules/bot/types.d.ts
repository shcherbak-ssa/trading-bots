import type { Bot, BrokerApiKeys } from 'global/types';
import { BrokerName } from 'global/constants';

import type { Bot as BotWorker } from './bot';


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

export type BotCloseTime = {
  day: number;
  nextDay: number;
  hour: number;
  minutes: number;
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
  getCloseTime(day: number | 'last'): Promise<BotCloseTime>;
  subscribeToPriceUpdates(callback: () => void): void;
  unsubscribeToPriceUpdates(): void;
  destroyConnection(): void;
}

export interface BotBrokerAccount {
  availableAmount: number;
  totalAmount: number;
  updateAccount(): Promise<void>
}


// Jobs
export interface BotJobs {
  startPositionCloseAtWeekEndJob(bot: BotWorker): Promise<void>;
  startPositionCloseAtDayEndJob(bot: BotWorker): Promise<void>;
  stopPositionCloseJob(botToken: string): void;

  startUpdateAccountJob(bot: BotWorker): void;
  stopUpdateAccountJob(botToken: string): void;
}
