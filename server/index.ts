console.log('\n#################### Setup server [BEGIN] ####################');

import env from 'shared/utils/dotenv';

import type { UsersDatabaseCollection, UsersDatabaseDocument } from 'shared/types';
import { ActionType } from 'shared/constants';

import { runAction } from 'services/actions';

import { setupDatabase } from 'api/database';
import { AppUsers } from 'api/database/app-users';

import { runServer } from './server';


// import { RestApi } from 'api/brokers/currency_com/lib/rest-api';
// const restApi = new RestApi('vEXLx3m2sAxKuGyF', 'E0uSoc&Ppm6+X4J&380IFmB5~DVxRTA7');


setupServer().catch(console.error);


async function setupServer() {
  console.log('\n mode:', process.env.NODE_ENV);
  console.log(env.env);

  console.log('\n - info: [server] setup environment');

  setupDatabase();
  console.log(' - info: [server] setup database');

  if (process.env.NODE_ENV === 'development') {
    await setupDevUser();
    console.info(` - info: [server] setup dev user (${process.env.DEV_USER_ID})`);
  }

  const activateBotsCount: number = await setupActiveBots();
  console.log(` - info: [server] setup active bots (${activateBotsCount})`);

  await runServer()
  console.info('\n - info: [server] run server');

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
  if (!process.env.DEV_USER_EMAIL) {
    throw new Error('No dev user email');
  }

  const devUserEmail: string = process.env.DEV_USER_EMAIL;

  const appUsersCollection: UsersDatabaseCollection = await AppUsers.connect();
  const foundDevUser: UsersDatabaseDocument | null = await appUsersCollection.findUserByEmail(devUserEmail);

  if (foundDevUser) {
    process.env.DEV_USER_ID = foundDevUser.id;
    return;
  }

  const createdDevUser: UsersDatabaseDocument = await appUsersCollection.createUser({ email: devUserEmail });
  process.env.DEV_USER_ID = createdDevUser.id;
}
