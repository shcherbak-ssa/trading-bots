import type { Bot, LoadBotsPayload, UpdateBotPayload } from 'global/types';

import type { CreationDocument } from 'shared/types';


// Bot Manager
export type RestartBotPayload = {
  bot: Bot;
  closePosition: boolean;
}

export type DeactivateBotPayload = {
  botToken: string;
}

// Database Api
export type BotsDatabaseDocument = Bot;

export type BotsGetFilters = LoadBotsPayload & {
  id?: string;
  active?: boolean;
  withBrokerAccount?: boolean;
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
