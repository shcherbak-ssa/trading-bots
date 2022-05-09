import cron from 'node-cron';

import { JOB_TIMEZONE, JobExpression, LogScope } from 'shared/constants';
import { logger } from 'shared/logger';

import type { BotCloseTime, BotJobs as Jobs } from 'modules/bot/types';
import type { Bot } from 'modules/bot';


export class BotJobs implements Jobs {
  private positionCloseTasks: Map<string, cron.ScheduledTask> = new Map([]);
  private accountUpdateTasks: Map<string, cron.ScheduledTask> = new Map([]);


  async startPositionCloseAtDayEndJob(bot: Bot, day: number = BotJobs.getCurrentDay()): Promise<void> {
    const closeTime: BotCloseTime = await bot.broker.market.getCloseTime(day);
    const jobExpression: string = BotJobs.getJobExpression(closeTime);

    const task: cron.ScheduledTask = cron.schedule(jobExpression, async () => {
      logger.logInfo(LogScope.JOB, `Run task - Close bot position at day end`);

      await bot.closeOpenPosition();

      await this.startPositionCloseAtDayEndJob(bot, closeTime.nextDay);

      logger.logInfo(LogScope.JOB, `End task - Close bot position at day end`);
    }, { timezone: JOB_TIMEZONE });

    this.stopPositionCloseJob(bot.settings.token);
    this.positionCloseTasks.set(bot.settings.token, task);

    logger.logInfo(LogScope.JOB, `Start task - Close bot position at day end`);
  }

  async startPositionCloseAtWeekEndJob(bot: Bot): Promise<void> {
    const closeTime: BotCloseTime = await bot.broker.market.getCloseTime('last');
    const jobExpression: string = BotJobs.getJobExpression(closeTime);

    const task: cron.ScheduledTask = cron.schedule(jobExpression, async () => {
      logger.logInfo(LogScope.JOB, `Run task - Close bot position at week end`);

      await bot.closeOpenPosition();

      await this.startPositionCloseAtWeekEndJob(bot);

      logger.logInfo(LogScope.JOB, `End task - Close bot position at week end`);
    }, { timezone: JOB_TIMEZONE });

    this.stopPositionCloseJob(bot.settings.token);
    this.positionCloseTasks.set(bot.settings.token, task);

    logger.logInfo(LogScope.JOB, `Start task - Close bot position at week end`);
  }

  stopPositionCloseJob(botToken: string): void {
    if (!this.positionCloseTasks.has(botToken)) return;

    this.positionCloseTasks.get(botToken)?.stop();
    this.positionCloseTasks.delete(botToken);

    logger.logInfo(LogScope.JOB, `Stop task - Close bot position`);
  }


  startUpdateAccountJob(bot: Bot): void {
    const task: cron.ScheduledTask = cron.schedule(JobExpression.UPDATE_BOT_BROKER_ACCOUNT, async () => {
      await bot.broker.account.updateAccount();
    }, { timezone: JOB_TIMEZONE });

    this.stopUpdateAccountJob(bot.settings.token);
    this.accountUpdateTasks.set(bot.settings.token, task);

    logger.logInfo(LogScope.JOB, `Start task - Update bot broker account`);
  }

  stopUpdateAccountJob(botToken: string): void {
    if (!this.accountUpdateTasks.has(botToken)) return;

    this.accountUpdateTasks.get(botToken)?.stop();
    this.accountUpdateTasks.delete(botToken);

    logger.logInfo(LogScope.JOB, `Stop task - Update bot broker account`);
  }


  private static getJobExpression({ day, hour, minutes }: BotCloseTime): string {
    return `${minutes} ${hour} * * ${day}`;
  }

  private static getCurrentDay(): number {
    return new Date().getUTCDay();
  }
}
