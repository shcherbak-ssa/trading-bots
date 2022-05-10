import cron from 'node-cron';

import type { Bot, Broker, LoadBrokersPayload, UpdateBotPayload, User } from 'global/types';

import {
  BotDeactivateReason,
  BotRestartMode,
  BotUpdateType,
  BROKER_API_KEYS_EXPIRES_DEACTIVATE_DAYS,
  BROKER_API_KEYS_EXPIRES_START_NOTIFY_DAYS
} from 'global/constants';

import { convertDateStringToNumber, getReadableDateString, getMilliseconds } from 'global/utils';

import type { Notification } from 'shared/types';
import { ActionType, DATE_STRING_27_DAYS, JOB_TIMEZONE, JobExpression, NotificationType } from 'shared/constants';
import { Helpers } from 'shared/helpers';
import { getBrokerLabel } from 'shared/utils';

import { runAction } from 'services/actions';

import { Utils } from './utils';


export function startAppJobs(): void {
  startCheckBotsRestartJob();
  startCheckBrokerApiKeysExpiresJob();
}


function startCheckBotsRestartJob(): void {
  cron.schedule(JobExpression.CHECK_BOTS_RESTART, async () => {
    Utils.logRunTask('Check bots restart');

    const users: User[] = await Helpers.getAllUsers();

    for (const { id: userId } of users) {
      const activeBots: Bot[] = await Helpers.getActiveBots(userId);

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

    Utils.logEndTask('Check bots restart');
  }, { timezone: JOB_TIMEZONE });

  Utils.logStartTask('Check bots restart');
}

function startCheckBrokerApiKeysExpiresJob(): void {
  cron.schedule(JobExpression.CHECK_BROKER_API_KEYS_EXPIRES, async () => {
    Utils.logRunTask('Check broker API keys expires');

    const users: User[] = await Helpers.getAllUsers();

    for (const { id: userId } of users) {
      const brokers = await runAction<LoadBrokersPayload, Broker[]>({
        type: ActionType.BROKERS_GET,
        userId,
        payload: { withBots: false },
      });

      for (const { name, expiresAt } of brokers) {
        let millisecondsBeforeExpires: number = convertDateStringToNumber(expiresAt) - Date.now();

        if (millisecondsBeforeExpires < 0) {
          millisecondsBeforeExpires = 0;
        }

        const needToDeactivate: boolean = (
          millisecondsBeforeExpires <= getMilliseconds(BROKER_API_KEYS_EXPIRES_DEACTIVATE_DAYS)
        );

        if (needToDeactivate) {
          const activeBots: Bot[] = await Helpers.getActiveBots(userId);

          for (const activeBot of activeBots) {
            await runAction<UpdateBotPayload, void>({
              type: ActionType.BOTS_UPDATE,
              userId,
              payload: {
                id: activeBot.id,
                type: BotUpdateType.DEACTIVATE,
                updates: { deactivateReason: BotDeactivateReason.BROKER_API_KEYS_EXPIRED },
              },
            });
          }

          await runAction<Notification, void>({
            type: ActionType.NOTIFICATIONS_NOTIFY_USER,
            userId,
            payload: {
              type: NotificationType.BOT_DEACTIVATION,
              bots: activeBots,
              reason: `${getBrokerLabel(name)} API keys expired.`,
              message: 'You will not be able to activate bots until you update the api keys. Please, update your API keys.',
            },
          });

          continue;
        }

        const needToNotify: boolean = (
          millisecondsBeforeExpires <= getMilliseconds(BROKER_API_KEYS_EXPIRES_START_NOTIFY_DAYS)
        );

        if (needToNotify) {
          const deactivatedInTime: string = getReadableDateString(
            millisecondsBeforeExpires - getMilliseconds(BROKER_API_KEYS_EXPIRES_DEACTIVATE_DAYS)
          );

          await runAction<Notification, void>({
            type: ActionType.NOTIFICATIONS_NOTIFY_USER,
            userId,
            payload: {
              type: NotificationType.ATTENTION,
              message: (
                `${getBrokerLabel(name)} API keys expire in <b>${getReadableDateString(millisecondsBeforeExpires)}</b>.` +
                ` Please, update your API keys otherwise bots will be deactivated in <b>${deactivatedInTime}</b>.`
              ),
            },
          });
        }
      }
    }

    Utils.logEndTask('Check broker API keys expires');
  }, { timezone: JOB_TIMEZONE });

  Utils.logStartTask('Check broker API keys expires');
}
