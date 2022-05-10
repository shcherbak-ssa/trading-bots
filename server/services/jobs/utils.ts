import { LogScope } from 'shared/constants';
import { logger } from 'shared/logger';


export class Utils {
  static logStartTask(jobName: string): void {
    logger.logInfo(LogScope.JOB, `Start task - ${jobName}`);
  }

  static logRunTask(jobName: string): void {
    logger.logInfo(LogScope.JOB, `Run task - ${jobName}`);
  }

  static logEndTask(jobName: string): void {
    logger.logInfo(LogScope.JOB, `End task - ${jobName}`);
  }

  static logStopTask(jobName: string): void {
    logger.logInfo(LogScope.JOB, `Stop task - ${jobName}`);
  }
}
