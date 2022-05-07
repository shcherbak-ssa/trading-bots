import cron from 'node-cron';

import type { Bot, UpdateBotPayload } from 'global/types';
import { BotRestartMode, BotUpdateType } from 'global/constants';

import type { BotsGetFilters, UsersDatabaseDocument } from 'shared/types';
import { ActionType, DATE_STRING_27_DAYS, JOB_TIMEZONE, JobExpression, LogScope } from 'shared/constants';
import { logger } from 'shared/logger';
import { convertDateStringToNumber, getMilliseconds } from 'shared/utils';

import { runAction } from 'services/actions';

import { BotEvents } from 'modules/bot';


export function startAppJobs(): void {
  startCheckBotsRestartJob();
  startCleanRestartBotCounts();
}


function startCheckBotsRestartJob(): void {
  cron.schedule(JobExpression.CHECK_BOTS_RESTART, async () => {
    logger.logInfo(LogScope.JOB, `START check bots restart`);

    const users: UsersDatabaseDocument[] = await runAction({
      type: ActionType.USERS_GET,
      userId: '',
      payload: {},
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

    logger.logInfo(LogScope.JOB, `END check bots restart`);
  }, { timezone: JOB_TIMEZONE });
}

function startCleanRestartBotCounts(): void {
  cron.schedule(JobExpression.CLEAN_RESTART_BOT_COUNTS, () => {
    logger.logInfo(LogScope.JOB, `START clean restart bot counts`);

    BotEvents.restartCounts.clear();

    logger.logInfo(LogScope.JOB, `END clean restart bot counts`);
  }, { timezone: JOB_TIMEZONE });
}
