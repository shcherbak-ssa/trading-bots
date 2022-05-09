import { BotPositionCloseMode } from 'global/constants';

import type { OpenPosition } from 'shared/types';
import { LogScope } from 'shared/constants';
import { logger } from 'shared/logger';
import { AppError } from 'shared/exceptions';

import { BotJobs } from 'services/jobs/bot-jobs';

import type { BotJobs as Jobs, BotSettings } from './types';
import { Bot } from './bot';


const botJobs: Jobs = new BotJobs();


export class BotManager {
  private static bots: Map<string, Bot> = new Map([]);


  static getBot(botToken: string): Bot {
    const bot: Bot | undefined = BotManager.bots.get(botToken);

    if (!bot) {
      throw new AppError({
        message: `Bot with token "${botToken}" does not exist`,
        messageHeading: 'Bot Manager',
        idLabel: 'token',
        id: botToken,
      });
    }

    return bot;
  }

  static async activateBot(setting: BotSettings, openPosition: OpenPosition | null): Promise<void> {
    const createdBot: Bot = await Bot.create(setting);

    if (openPosition !== null) {
      createdBot.setCurrentPosition(openPosition);
    }

    botJobs.stopPositionCloseJob(setting.token);
    botJobs.stopUpdateAccountJob(setting.token);

    botJobs.startUpdateAccountJob(createdBot);

    if (setting.positionCloseEnable) {
      setting.positionCloseMode === BotPositionCloseMode.DAY_END
        ? await botJobs.startPositionCloseAtDayEndJob(createdBot)
        : await botJobs.startPositionCloseAtWeekEndJob(createdBot);
    }

    BotManager.bots.set(setting.token, createdBot);

    logger.logInfo(LogScope.BOT, `Bot Manager - activate bot (${BotManager.bots.size}).`);
  }

  static async deactivateBot(botToken: string): Promise<void> {
    const bot: Bot = BotManager.getBot(botToken);

    await bot.closeOpenPosition();

    botJobs.stopPositionCloseJob(botToken);
    botJobs.stopUpdateAccountJob(botToken);

    BotManager.bots.delete(botToken);

    logger.logInfo(LogScope.BOT, `Bot Manager - deactivate bot (${BotManager.bots.size}).`);
  }
}
