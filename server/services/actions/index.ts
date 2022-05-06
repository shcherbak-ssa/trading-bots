import { StatusCode } from 'global/constants';

import type { Action, ActionFunction, ActionList } from 'shared/types';
import { AppError } from 'shared/exceptions';
import { appLogger } from 'shared/logger';

import { analyticsActions } from './analytics';
import { botManagerActions } from './bot-manager';
import { botsActions } from './bots';
import { brokersActions } from './brokers';
import { openPositionsActions } from './open-positions';
import { positionsActions } from './positions';
import { signalsActions } from './signals';
import { usersActions } from './users';


const actions: ActionList = {
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
    throw new AppError(StatusCode.INTERNAL_SERVER_ERROR, {
      message: `Action [${type}] not found`,
    });
  }

  appLogger.logInfo({
    message: `START action (${type})`,
    idLabel: `user ${userId}`,
    payload,
  });

  const result: Result = await action(userId, payload) ;

  appLogger.logInfo({
    message: `END action (${type})`,
    idLabel: `user ${userId}`,
    payload: result,
  });

  return result;
}
