import { BotPositionCloseMode, StatusCode } from 'global/constants';

import type { OpenPosition } from 'shared/types';
import { AppError } from 'shared/exceptions';

import { BotJobs } from 'services/jobs/bot-jobs';

import type { BotJobs as Jobs, BotSettings } from './types';
import { BotErrorPlace } from './constants';
import { Bot } from './bot';
import { BotEvents } from './bot-events';


const botJobs: Jobs = new BotJobs();


export class BotManager {
  private static bots: Map<string, Bot> = new Map([]);


  static getBot(botToken: string): Bot {
    const bot: Bot | undefined = BotManager.bots.get(botToken);

    if (!bot) {
      throw new AppError(StatusCode.INTERNAL_SERVER_ERROR, {
        message: `Bot with token '${botToken}' does not exist`,
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

    if (setting.positionCloseEnable) {
      setting.positionCloseMode === BotPositionCloseMode.DAY_END
        ? await botJobs.startPositionCloseAtDayEndJob(createdBot)
        : await botJobs.startPositionCloseAtWeekEndJob(createdBot);
    }

    BotManager.bots.set(setting.token, createdBot);

    console.info(` - info: [bot manager] activate bot. Active bots - ${BotManager.bots.size}`);
  }

  static async deactivateBot(botToken: string): Promise<void> {
    const bot: Bot = BotManager.getBot(botToken);

    await bot.closeOpenPosition();

    botJobs.stopPositionCloseJob(botToken);

    BotManager.bots.delete(botToken);

    console.info(` - info: [bot manager] deactivate bot. Active bots - ${BotManager.bots.size}`);
  }
}
