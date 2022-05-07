import type { User, NewUser } from 'global/types';

import type { GetUserFilters, UpdateUserPayload, UsersDatabaseCollection } from 'shared/types';
import { ActionType } from 'shared/constants';

import { AppUsers } from 'api/database/app-users';


export const usersActions = {
  async [ActionType.USERS_GET](userId: string, filters: GetUserFilters): Promise<User[]> {
    const appUsersCollection: UsersDatabaseCollection = await AppUsers.connect();

    return await appUsersCollection.getUsers(filters);
  },

  async [ActionType.USERS_CREATE](userId: string, newUser: NewUser): Promise<User> {
    const appUsersCollection: UsersDatabaseCollection = await AppUsers.connect();

    return await appUsersCollection.createUser(newUser);
  },

  async [ActionType.USERS_UPDATE](userId: string, updates: UpdateUserPayload): Promise<void> {
    const appUsersCollection: UsersDatabaseCollection = await AppUsers.connect();

    await appUsersCollection.updateUser(userId, updates);
  },
};
