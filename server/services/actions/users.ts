import type { User, NewUser } from 'global/types';

import type { CheckUserPayload, GetUserFilters, UpdateUserPayload, UsersDatabaseCollection } from 'shared/types';
import { ActionType } from 'shared/constants';
import { ApiError } from 'shared/exceptions';

import { AppUsers } from 'api/database/app-users';


export const usersActions = {
  async [ActionType.USERS_GET](userId: string, filters: GetUserFilters): Promise<User[]> {
    const appUsersCollection: UsersDatabaseCollection = await AppUsers.connect();

    return await appUsersCollection.getUsers(filters);
  },

  async [ActionType.USERS_CREATE](userId: string, newUser: NewUser): Promise<User> {
    const appUsersCollection: UsersDatabaseCollection = await AppUsers.connect();

    const isUsernameUnique: boolean = await appUsersCollection.isUsernameUnique(newUser.username);

    if (isUsernameUnique) {
      return await appUsersCollection.createUser(newUser);
    }

    throw new ApiError({
      message: `User with username "${newUser.username}" already exist.`,
      messageHeading: 'Database (Create User)',
      payload: newUser,
    });
  },

  async [ActionType.USERS_UPDATE](userId: string, updates: UpdateUserPayload): Promise<void> {
    const appUsersCollection: UsersDatabaseCollection = await AppUsers.connect();

    if (updates.username) {
      const isUsernameUnique: boolean = await appUsersCollection.isUsernameUnique(updates.username);

      if (!isUsernameUnique) {
        throw new ApiError({
          message: `User with username "${updates.username}" already exist.`,
          messageHeading: 'Database (Update User)',
          payload: updates,
        });
      }
    }

    await appUsersCollection.updateUser(userId, updates);
  },

  async [ActionType.USERS_CHECK](userId: string, payload: CheckUserPayload): Promise<boolean> {
    const appUsersCollection: UsersDatabaseCollection = await AppUsers.connect();

    return await appUsersCollection.isValidUser(payload);
  },
};
