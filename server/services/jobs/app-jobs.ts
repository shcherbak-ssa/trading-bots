import cron from 'node-cron';

import { ActionType, JOB_TIMEZONE, JobExpression } from 'shared/constants';

import { runAction } from 'services/actions';


function startCheckBotsRestartJob(): void {
  cron.schedule(JobExpression.CHECK_BOTS_RESTART, async () => {
    console.info('info: [job] Check Bots Restart - start');

    await runAction({
      type: ActionType.BOTS_CHECK_RESTART,
      userId: '',
      payload: {},
    });

    console.info('info: [job] Check Bots Restart - end');
  }, { timezone: JOB_TIMEZONE });
}


export function startAppJobs(): void {
  startCheckBotsRestartJob();
}
