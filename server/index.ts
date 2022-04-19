import env from 'shared/utils/dotenv';

import type { UsersDatabaseCollection, UsersDatabaseDocument } from 'shared/types';

import { setupDatabase } from 'api/database';
import { AppUsers } from 'api/database/app-users';

import { runServer } from './server';


// import { RestApi } from 'api/brokers/currency_com/lib/rest-api';
// const restApi = new RestApi('vEXLx3m2sAxKuGyF', 'E0uSoc&Ppm6+X4J&380IFmB5~DVxRTA7');


setupServer().catch(console.error);


async function setupServer() {
  console.log('\n#################### Setup server [BEGIN] ####################');

  console.log('\nmode:', process.env.NODE_ENV);
  console.log('environment:', env.env);

  setupDatabase();
  console.log('\n - setup database');

  if (process.env.NODE_ENV === 'development') {
    await setupDevUser();
    console.info(` - setup dev user with id '${process.env.DEV_USER_ID}'`);
  }

  await runServer()
  console.info(' - run server');

  console.log('\n#################### Setup server [END] ####################\n');
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
