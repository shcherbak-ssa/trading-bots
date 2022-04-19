import type { Action, ActionFunction, ActionsObject } from 'shared/types';

import { brokersActions } from './brokers';


const actions: ActionsObject = {
  ...brokersActions,
};


export async function runAction<Payload>({ type, payload }: Action<Payload>): Promise<void> {
  const action: ActionFunction<Payload> = actions[type];

  if (!action) {
    throw new Error(`Action [${type}] not found`);
  }

  return await action(payload);
}
