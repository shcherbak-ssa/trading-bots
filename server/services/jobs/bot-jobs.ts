import cron from 'node-cron';

import { JOB_TIMEZONE } from 'shared/constants';
import { jobLogger } from 'shared/logger';

import type { BotCloseTime, BotJobs as Jobs } from 'modules/bot/types';
import type { Bot } from 'modules/bot';


export class BotJobs implements Jobs {
  private tasks: Map<string, cron.ScheduledTask> = new Map([]);


  async startPositionCloseAtDayEndJob(bot: Bot, day: number = BotJobs.getCurrentDay()): Promise<void> {
    const closeTime: BotCloseTime = await bot.broker.market.getCloseTime(day);
    const jobExpression: string = BotJobs.getJobExpression(closeTime);

    const task: cron.ScheduledTask = cron.schedule(jobExpression, async () => {
      jobLogger.logInfo(`START close position at day end`);

      await bot.closeOpenPosition();

      await this.startPositionCloseAtDayEndJob(bot, closeTime.nextDay);

      jobLogger.logInfo(`END close position at day end`);
    }, { timezone: JOB_TIMEZONE });

    this.stopPositionCloseJob(bot.settings.token);
    this.tasks.set(bot.settings.token, task);
  }

  async startPositionCloseAtWeekEndJob(bot: Bot): Promise<void> {
    const closeTime: BotCloseTime = await bot.broker.market.getCloseTime('last');
    const jobExpression: string = BotJobs.getJobExpression(closeTime);

    const task: cron.ScheduledTask = cron.schedule(jobExpression, async () => {
      jobLogger.logInfo(`START close position at week end`);

      await bot.closeOpenPosition();

      await this.startPositionCloseAtWeekEndJob(bot);

      jobLogger.logInfo(`END close position at week end`);
    }, { timezone: JOB_TIMEZONE });

    this.stopPositionCloseJob(bot.settings.token);
    this.tasks.set(bot.settings.token, task);
  }

  stopPositionCloseJob(botToken: string): void {
    this.tasks.get(botToken)?.stop();

    if (this.tasks.has(botToken)) {
      this.tasks.delete(botToken);
    }
  }


  private static getJobExpression({ day, hour, minutes }: BotCloseTime): string {
    return `${minutes} ${hour} * * ${day}`;
  }

  private static getCurrentDay(): number {
    return new Date().getUTCDay();
  }
}
