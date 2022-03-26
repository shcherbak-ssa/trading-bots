import type { Bot } from 'shared/types';


class BotsController {
  async create(payload: Bot.CreatePayload): Promise<Bot.CreateResult> {
    throw new Error('not implemented');
  }

  async read(payload: Bot.ReadPayload): Promise<Bot.ReadResult> {
    throw new Error('not implemented');
  }

  async update(payload: Bot.UpdatePayload): Promise<void> {
    throw new Error('not implemented');
  }

  async delete(payload: Bot.DeletePayload): Promise<void> {
    throw new Error('not implemented');
  }
}

export const botsController: BotsController = new BotsController();
