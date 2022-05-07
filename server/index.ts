import env from 'shared/utils/dotenv';

import { GetUserType } from 'global/constants';

import type { Notification, UsersDatabaseCollection, UsersDatabaseDocument } from 'shared/types';
import { ActionType, LogScope, NotificationType } from 'shared/constants';
import { initialUser } from 'shared/config';
import { logger } from 'shared/logger';

import { startAppJobs } from 'services/jobs/app-jobs';
import { runAction } from 'services/actions';

import { setupTelegramWebhook } from 'api/telegram/setup';
import { setupDatabase } from 'api/database/setup';
import { AppUsers } from 'api/database/app-users';

import { runServer } from './server';


// RestApi('vEXLx3m2sAxKuGyF', 'E0uSoc&Ppm6+X4J&380IFmB5~DVxRTA7');


setupServer()
  .then(setUncaughtException)
  .catch(console.log);


async function setupServer() {
  console.log('\n#################### Setup server [BEGIN] ####################');

  console.log('\n mode:', process.env.NODE_ENV);
  console.log('\n environment:\n')

  for (const [key, value] of Object.entries(env.env)) {
    console.log(` ${key} = ${value}`);
  }

  console.log('\n');

  setupDatabase();
  logger.logInfo(LogScope.APP, 'setup database');

  if (process.env.NODE_ENV === 'development') {
    await setupDevUser();
    logger.logInfo(LogScope.APP, `setup dev user (${process.env.ADMIN_USER_ID})`);
  }

  const activateBotsCount: number = await setupActiveBots();
  logger.logInfo(LogScope.APP, `setup active bots (${activateBotsCount})`);

  await setupTelegramWebhook();
  logger.logInfo(LogScope.APP, `setup Telegram webhook`);

  startAppJobs();
  logger.logInfo(LogScope.APP, `start application jobs`);

  await runServer()
  logger.logInfo(LogScope.APP, `run server`);

  console.log('\n#################### Setup server [END] ####################\n');
}

async function setupActiveBots(): Promise<number> {
  return await runAction({
    type: ActionType.BOT_MANAGER_SETUP_ACTIVE_BOTS,
    userId: '',
    payload: {},
  });
}

async function setupDevUser(): Promise<void> {
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
    process.env.ADMIN_USER_ID = foundAdminUser.id;

    return;
  }

  const createdAdminUser: UsersDatabaseDocument = await appUsersCollection.createUser({
    ...initialUser,
    telegramChatId: adminUserTelegramChatId,
    isAdmin: true,
  });

  process.env.ADMIN_USER_ID = createdAdminUser.id;
}

function setUncaughtException(): void {
  process.on('uncaughtException', async (e) => {
    console.log(e);

    await runAction<Notification, void>({
      type: ActionType.NOTIFICATIONS_NOTIFY_ADMIN,
      userId: '',
      payload: {
        type: NotificationType.ERROR,
        forAdmin: true,
        error: e,
      },
    });
  });
}
