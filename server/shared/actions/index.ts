import type { Action, ActionFunction, ActionsObject } from 'shared/types';

import { botManagerActions } from './bot-manager';
import { botsActions } from './bots';
import { brokersActions } from './brokers';


const actions: ActionsObject = {
  ...botManagerActions,
  ...botsActions,
  ...brokersActions,
};


export async function runAction<Payload, Result>({ type, userId, payload }: Action<Payload>): Promise<Result> {
  const action: ActionFunction<Payload, Result> = actions[type];

  if (!action) {
    throw new Error(`Action [${type}] not found`);
  }

  return await action(userId, payload) ;
}
