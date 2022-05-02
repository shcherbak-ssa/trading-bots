import type { Bot } from 'global/types';

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

export type NewPosition = Omit<Position, 'id'>;

export type PositionDeleteFilters = {
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
  success: boolean;
  position: OpenPosition;
  bot: Bot;
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
  createPosition(position: CreationDocument<PositionsDatabaseDocument>): Promise<PositionsDatabaseDocument>;
  deletePositions(filters: PositionDeleteFilters): Promise<void>;
}


// Brokers Api
export type BrokersPositionsApiPayload = BrokersApiPayload & {
  position: OpenPosition;
}

export interface BrokersPositionsApi {
  checkPositionClose(payload: BrokersPositionsApiPayload): Promise<number | null>; // number => closed positions count
}
