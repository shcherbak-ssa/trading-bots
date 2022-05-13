import env from 'shared/utils/dotenv';

import type { Server } from 'http';

import { GetUserType } from 'global/constants';

import type { Notification, UsersDatabaseCollection, UsersDatabaseDocument } from 'shared/types';
import { ActionType, LogScope, NotificationType } from 'shared/constants';
import { initialUser } from 'shared/config';
import { logger } from 'shared/logger';

import { startAppJobs } from 'services/jobs/app-jobs';
import { runAction } from 'services/actions';

import { setupTelegramWebhook } from 'api/telegram/setup';
import { setupDatabase } from 'api/database/setup';
import { AppUsers } from 'api/database';

import { runServer } from './server';


// 'vEXLx3m2sAxKuGyF', 'E0uSoc&Ppm6+X4J&380IFmB5~DVxRTA7'


setupServer()
  .then(setUncaughtException)
  .catch(console.log);


async function setupServer(): Promise<Server> {
  console.log('\n#################### Setup server [BEGIN] ####################');

  console.log(`\n mode: ${process.env.NODE_ENV}\n`);

  for (const [key, value] of Object.entries(env.env)) {
    console.log(` ${key} = ${value}`);
  }

  console.log('\n');

  setupDatabase();
  logger.logInfo(LogScope.APP, 'setup database');

  await setupAdminUser();
  logger.logInfo(LogScope.APP, `setup admin user`);

  const activateBotsCount: number = await setupActiveBots();
  logger.logInfo(LogScope.APP, `setup active bots (${activateBotsCount})`);

  await setupTelegramWebhook();
  logger.logInfo(LogScope.APP, `setup Telegram webhook`);

  startAppJobs();
  logger.logInfo(LogScope.APP, `start application jobs`);

  const server: Server = await runServer()
  logger.logInfo(LogScope.APP, `run server`);

  console.log('\n#################### Setup server [END] ####################\n');

  return server;
}

async function setupActiveBots(): Promise<number> {
  return await runAction({
    type: ActionType.BOT_MANAGER_SETUP_ACTIVE_BOTS,
    userId: '',
    payload: {},
  });
}

async function setupAdminUser(): Promise<void> {
  if (!process.env.ADMIN_TELEGRAM_CHAT_ID) {
    throw new Error('No admin Telegram chat id');
  }

  const adminUserTelegramChatId: number = Number(process.env.ADMIN_TELEGRAM_CHAT_ID);

  const appUsersCollection: UsersDatabaseCollection = await AppUsers.connect();

  const [ foundAdminUser ]: UsersDatabaseDocument[] = await appUsersCollection.getUsers({
    type: GetUserType.ONE,
    telegramChatId: adminUserTelegramChatId,
    isAdmin: true,
  });

  if (foundAdminUser) {
    return;
  }

  await appUsersCollection.createUser({
    ...initialUser,
    telegramChatId: adminUserTelegramChatId,
    isAdmin: true,
  });
}

function setUncaughtException(server: Server): void {
  process.on('uncaughtException', async (e) => {
    console.log(e);

    try {
      await runAction<Notification, void>({
        type: ActionType.NOTIFICATIONS_NOTIFY_ADMIN,
        userId: '',
        payload: {
          type: NotificationType.ERROR,
          forAdmin: true,
          error: e,
        },
      });
    } catch (e) {
      console.log(e);

      server.close();
      process.exit(1);
    }
  });
}
