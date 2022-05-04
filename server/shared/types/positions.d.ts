import type { Bot, BrokerApiKeys } from 'global/types';

import type { CreationDocument, BrokersApiPayload } from 'shared/types';

import { BotPosition } from 'modules/bot/types';


// Position
export type Position = {
  id: string;
  botId: string;
  botActivationIndex: number;
  isLong: boolean;
  totalFee: number;
  result: number;
  closedAt: string;
}

export type PositionsGetFilters = {
  botId?: string;
  botActivationIndex?: number;
}

export type PositionsCreatePayload = {
  bot: Bot;
  openPosition: OpenPosition;
}

export type PositionsDeleteFilters = {
  botId?: string;
}


// Open position
export type OpenPosition = BotPosition & {
  botId: string;
}

export type NewOpenPosition = Omit<OpenPosition, 'id'>;

export type OpenPositionGetPayload = {
  botId: string;
}

export type OpenPositionUpdatePayload = {
  id: string;
  updates: {
    stopLossPrice: number;
  };
}

export type OpenPositionDeletePayload = {
  position: OpenPosition;
  bot: Bot;
}

export type OpenPositionCheckClosePayload = {
  bot: Bot;
  brokerApiKeys: BrokerApiKeys;
  position: OpenPosition;
}


// Database Api
export type OpenPositionsDatabaseDocument = OpenPosition;

export type PositionsDatabaseDocument = Position;

export interface OpenPositionsDatabaseCollection {
  getOpenPosition(botId: string): Promise<OpenPositionsDatabaseDocument | null>;
  createOpenPosition(position: CreationDocument<OpenPositionsDatabaseDocument>): Promise<OpenPositionsDatabaseDocument>;
  updateOpenPosition(id: string, updates: OpenPositionUpdatePayload['updates']): Promise<void>;
  deleteOpenPosition(id: string): Promise<void>
}

export interface PositionsDatabaseCollection {
  getPositions(filters: PositionsGetFilters): Promise<PositionsDatabaseDocument[]>;
  createPosition(position: CreationDocument<PositionsDatabaseDocument>): Promise<PositionsDatabaseDocument>;
  deletePositions(filters: PositionsDeleteFilters): Promise<void>;
}


// Brokers Api
export type BrokersPositionsApiPayload = BrokersApiPayload & {
  position: OpenPosition;
}

export interface BrokersPositionsApi {
  /* number => closed positions count */
  checkPositionClose(payload: BrokersPositionsApiPayload): Promise<number | null>;
}
