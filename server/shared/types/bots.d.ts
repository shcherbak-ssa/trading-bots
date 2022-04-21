import type { Bot, LoadBotsPayload, UpdateBotPayload } from 'global/types';

import type { CreationDocument } from './database';


// Api Database
export type BotsDatabaseDocument = Bot;

export type BotsGetFilters = LoadBotsPayload;

export type BotsDeleteFilters = {
  id?: string;
  brokerId?: string;
}

export interface BotsDatabaseCollection {
  getBots(filters: BotsGetFilters): Promise<BotsDatabaseDocument[]>;
  createBot(newBot: CreationDocument<BotsDatabaseDocument>): Promise<BotsDatabaseDocument>;
  updateBot(id: string, updates: UpdateBotPayload['updates']): Promise<BotsDatabaseDocument>;
  deleteBots(filters: BotsDeleteFilters): Promise<void>;
}
