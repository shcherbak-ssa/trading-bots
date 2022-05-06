import cron from 'node-cron';

import type { Bot, UpdateBotPayload } from 'global/types';
import { BotRestartMode, BotUpdateType } from 'global/constants';

import type { BotsGetFilters, UsersDatabaseDocument } from 'shared/types';
import { ActionType, DATE_STRING_27_DAYS, JOB_TIMEZONE, JobExpression } from 'shared/constants';
import { jobLogger } from 'shared/logger';
import { convertDateStringToNumber, getMilliseconds } from 'shared/utils';

import { runAction } from 'services/actions';

import { BotEvents } from 'modules/bot';


export function startAppJobs(): void {
  startCheckBotsRestartJob();
  startCleanRestartBotCounts();
}


function startCheckBotsRestartJob(): void {
  cron.schedule(JobExpression.CHECK_BOTS_RESTART, async () => {
    jobLogger.logInfo(`START check bots restart`);

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

    jobLogger.logInfo(`END check bots restart`);
  }, { timezone: JOB_TIMEZONE });
}

function startCleanRestartBotCounts(): void {
  cron.schedule(JobExpression.CLEAN_RESTART_BOT_COUNTS, () => {
    jobLogger.logInfo(`START clean restart bot counts`);

    BotEvents.restartCounts.clear();

    jobLogger.logInfo(`END clean restart bot counts`);
  }, { timezone: JOB_TIMEZONE });
}
