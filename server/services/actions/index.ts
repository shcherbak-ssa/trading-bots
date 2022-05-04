import type { Action, ActionFunction, ActionsObject } from 'shared/types';

import { analyticsActions } from './analytics';
import { botManagerActions } from './bot-manager';
import { botsActions } from './bots';
import { brokersActions } from './brokers';
import { openPositionsActions } from './open-positions';
import { positionsActions } from './positions';
import { signalsActions } from './signals';
import { usersActions } from './users';


const actions: ActionsObject = {
  ...analyticsActions,
  ...botManagerActions,
  ...botsActions,
  ...brokersActions,
  ...openPositionsActions,
  ...positionsActions,
  ...signalsActions,
  ...usersActions,
};


export async function runAction<Payload, Result>({ type, userId, payload }: Action<Payload>): Promise<Result> {
  const action: ActionFunction<Payload, Result> = actions[type];

  if (!action) {
    throw new Error(`Action [${type}] not found`);
  }

  return await action(userId, payload) ;
}
