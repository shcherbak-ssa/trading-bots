import type { Bot, LoadBotsPayload, UpdateBotPayload } from 'global/types';

import type { CreationDocument } from './database';


// Bot Manager
export type DeactivateBotPayload = {
  botToken: string;
}

// Api Database
export type BotsDatabaseDocument = Bot;

export type BotsGetFilters = LoadBotsPayload & {
  active?: boolean;
}

export type BotsDeleteFilters = {
  id?: string;
  brokerId?: string;
}

export interface BotsDatabaseCollection {
  getBot(id: string): Promise<BotsDatabaseDocument>;
  getBots(filters: BotsGetFilters): Promise<BotsDatabaseDocument[]>;
  createBot(newBot: CreationDocument<BotsDatabaseDocument>): Promise<BotsDatabaseDocument>;
  updateBot(id: string, updates: UpdateBotPayload['updates']): Promise<void>;
  deleteBots(filters: BotsDeleteFilters): Promise<void>;
}
