import type { BotClientInfo, LoadBotsPayload, NewBot } from 'global/types';
import { BotUpdateType, ServerEndpoint } from 'global/constants';

import type { BotsApi, BotUpdatePayload } from 'shared/types';

import { Api } from './lib/api';


export class Bots implements BotsApi {
  async getBot(id: string): Promise<BotClientInfo> {
    return await Api.get({
      endpoint: ServerEndpoint.API_BOTS_WITH_ID,
      params: { id },
      body: {},
    });
  }

  async loadBots(payload: LoadBotsPayload): Promise<BotClientInfo[]> {
    return await Api.get({
      endpoint: ServerEndpoint.API_BOTS,
      params: {},
      body: payload,
    });
  }

  async createBot(newBot: NewBot): Promise<BotClientInfo> {
    return await Api.post({
      endpoint: ServerEndpoint.API_BOTS,
      params: {},
      body: newBot,
    });
  }

  async updateBot(id: string, type: BotUpdateType, updates: BotUpdatePayload['updates']): Promise<void> {
    await Api.put({
      endpoint: ServerEndpoint.API_BOTS_WITH_ID,
      params: { id },
      body: { type, updates },
    });
  }

  async deleteBot(id: string): Promise<void> {
    await Api.delete({
      endpoint: ServerEndpoint.API_BOTS_WITH_ID,
      params: { id },
      body: {},
    });
  }
}
