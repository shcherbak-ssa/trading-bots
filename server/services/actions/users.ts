import type { UsersDatabaseCollection, UsersDatabaseDocument } from 'shared/types';
import { ActionType } from 'shared/constants';

import { AppUsers } from 'api/database/app-users';


export const usersActions = {
  async [ActionType.USERS_GET](): Promise<UsersDatabaseDocument[]> {
    const appUsersCollection: UsersDatabaseCollection = await AppUsers.connect();

    return await appUsersCollection.getUsers();
  },
};
