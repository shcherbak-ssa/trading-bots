import { StatusCode } from 'global/constants';

import type { Action, ActionFunction, ActionList } from 'shared/types';
import { LogScope } from 'shared/constants';
import { logger } from 'shared/logger';
import { AppError } from 'shared/exceptions';

import { analyticsActions } from './analytics';
import { botManagerActions } from './bot-manager';
import { botsActions } from './bots';
import { brokersActions } from './brokers';
import { openPositionsActions } from './open-positions';
import { positionsActions } from './positions';
import { signalsActions } from './signals';
import { telegramActions } from './telegram';
import { usersActions } from './users';


const actions: ActionList = {
  ...analyticsActions,
  ...botManagerActions,
  ...botsActions,
  ...brokersActions,
  ...openPositionsActions,
  ...positionsActions,
  ...signalsActions,
  ...telegramActions,
  ...usersActions,
};


export async function runAction<Payload, Result>({ type, userId, payload }: Action<Payload>): Promise<Result> {
  const action: ActionFunction<Payload, Result> = actions[type];

  if (!action) {
    throw new AppError({
      message: `Action [${type}] not found`,
      messageLabel: 'Application',
    });
  }

  logger.logInfo(LogScope.APP, {
    message: `start (${type})`,
    messageLabel: 'Action',
    idLabel: 'user',
    id: userId,
    payload,
  });

  const result: Result = await action(userId, payload) ;

  logger.logInfo(LogScope.APP, {
    message: `end (${type})`,
    messageLabel: 'Action',
    idLabel: 'user',
    id: userId,
    payload: result,
  });

  return result;
}
