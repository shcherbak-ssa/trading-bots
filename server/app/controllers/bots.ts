import type { Bots } from 'shared/types';


// @TODO: convert methods to static
class BotsController {
  async create(payload: Bots.CreatePayload): Promise<Bots.CreateResult> {
    throw new Error('not implemented');
  }

  async read(payload: Bots.ReadPayload): Promise<Bots.ReadResult> {
    throw new Error('not implemented');
  }

  async update(payload: Bots.UpdatePayload): Promise<void> {
    throw new Error('not implemented');
  }

  async delete(payload: Bots.DeletePayload): Promise<void> {
    throw new Error('not implemented');
  }
}

export const botsController: BotsController = new BotsController();
