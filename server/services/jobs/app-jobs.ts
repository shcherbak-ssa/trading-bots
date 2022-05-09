import cron from 'node-cron';

import type { Bot, UpdateBotPayload, User } from 'global/types';
import { BotRestartMode, BotUpdateType, GetUserType } from 'global/constants';

import type { BotsGetFilters, GetUserFilters } from 'shared/types';
import { ActionType, DATE_STRING_27_DAYS, JOB_TIMEZONE, JobExpression, LogScope } from 'shared/constants';
import { logger } from 'shared/logger';
import { convertDateStringToNumber, getMilliseconds } from 'shared/utils';

import { runAction } from 'services/actions';


export function startAppJobs(): void {
  startCheckBotsRestartJob();
}


function startCheckBotsRestartJob(): void {
  cron.schedule(JobExpression.CHECK_BOTS_RESTART, async () => {
    logger.logInfo(LogScope.JOB, `Run task - Check bots restart`);

    const users = await runAction<GetUserFilters, User[]>({
      type: ActionType.USERS_GET,
      userId: '',
      payload: { type: GetUserType.ALL },
    });

    for (const { id: userId } of users) {
      const activeBots = await runAction<BotsGetFilters, Bot[]>({
        type: ActionType.BOTS_GET,
        userId,
        payload: { active: true, withBrokerAccount: false },
      });

      for (const { id, restartEnable, restartMode, activateAt } of activeBots) {
        if (!restartEnable) continue;

        const needToRestart: boolean = (
          restartMode === BotRestartMode.WEEK ||
          (
            restartMode === BotRestartMode.MONTH &&
            Date.now() - convertDateStringToNumber(activateAt) > getMilliseconds(DATE_STRING_27_DAYS)
          )
        );

        if (needToRestart) {
          await runAction<UpdateBotPayload, void>({
            type: ActionType.BOTS_UPDATE,
            userId,
            payload: {
              id,
              type: BotUpdateType.RESTART,
              updates: {},
            },
          });
        }
      }
    }

    logger.logInfo(LogScope.JOB, `End task - Check bots restart`);
  }, { timezone: JOB_TIMEZONE });

  logger.logInfo(LogScope.JOB, `Start task - Check bots restart`);
}
