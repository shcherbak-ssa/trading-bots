import type { BotClientInfo, NewBot, LoadBotsPayload, UpdateBotPayload } from 'global/types';
import { BotUpdateType, BrokerName } from 'global/constants';


export type BotActionState = NewBot;

export type BotUpdatePayload = UpdateBotPayload & {
  botName: string;
}

export type BotDeletePayload = {
  id: string;
  botName: string;
}

export type BotCreateConfig = {
  brokerName: BrokerName;
  allowDemoAccount: boolean;
  allowLeverageSettings: boolean;
}

export interface BotsStore {
  setBots(bots: BotClientInfo[]): void;
  addBot(bot: BotClientInfo): void;
  updateBot(bot: BotClientInfo): void;
  deleteBot(id: string): void;
}

export interface BotsApi {
  getBot(id: string): Promise<BotClientInfo>;
  loadBots(payload: LoadBotsPayload): Promise<BotClientInfo[]>;
  createBot(newBot: NewBot): Promise<BotClientInfo>;
  updateBot(id: string, type: BotUpdateType, updates: BotUpdatePayload['updates']): Promise<void>;
  deleteBot(id: string): Promise<void>;
}
