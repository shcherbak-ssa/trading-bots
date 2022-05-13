import type { ClientUser, User, UserAccess } from 'global/types';
import { GetUserType, StatusCode } from 'global/constants';

import type {
  CheckUserPayload,
  GetUserFilters,
  NewUser,
  UpdateUserPayload,
  UsersDatabaseCollection,
  UsersDatabaseDocument,
  ServerAuthPayload
} from 'shared/types';

import { ACCESS_TOKEN_EXPIRES, ActionType } from 'shared/constants';
import { ApiError, AppError } from 'shared/exceptions';
import { generateToken } from 'shared/utils';

import { AppUsers } from 'api/database/app-users';


export const usersActions = {
  async [ActionType.USERS_LOGIN](userId: string, payload: CheckUserPayload): Promise<UserAccess> {
    const appUsersCollection: UsersDatabaseCollection = await AppUsers.connect();
    const isValidUser: boolean = await appUsersCollection.isValidUser(payload);

    if (isValidUser) {
      const [ foundUser ]: UsersDatabaseDocument[] = await appUsersCollection.getUsers({
        type: GetUserType.ONE,
        username: payload.username,
      });

      const authPayload: ServerAuthPayload = { userId: foundUser.id };
      const token: string = generateToken(authPayload, ACCESS_TOKEN_EXPIRES);

      return { token };
    }

    throw new AppError({
      message: 'Invalid username or password',
      messageHeading: 'Login',
      payload,
    }, StatusCode.BAD_REQUEST);
  },

  async [ActionType.USERS_GET_CLIENT](userId: string): Promise<ClientUser> {
    const appUsersCollection: UsersDatabaseCollection = await AppUsers.connect();

    const [ foundUser ]: UsersDatabaseDocument[] = await appUsersCollection.getUsers({
      type: GetUserType.ONE,
      id: userId,
    });

    if (foundUser) {
      const { id, telegramChatId, password, ...user } = foundUser;

      return user;
    }

    throw new ApiError({
      message: 'User not found',
      messageHeading: 'Database (Get User)',
      idLabel: 'user',
      id: userId,
    });
  },

  async [ActionType.USERS_GET](userId: string, filters: GetUserFilters): Promise<User[]> {
    const appUsersCollection: UsersDatabaseCollection = await AppUsers.connect();

    const users: UsersDatabaseDocument[] = await appUsersCollection.getUsers(filters);

    return users.map(({ password, ...user }) => user);
  },

  async [ActionType.USERS_CREATE](userId: string, newUser: NewUser): Promise<User> {
    const appUsersCollection: UsersDatabaseCollection = await AppUsers.connect();

    const isUsernameUnique: boolean = await appUsersCollection.isUsernameUnique(newUser.username);

    if (isUsernameUnique) {
      const { password, ...createdUser } = await appUsersCollection.createUser(newUser);

      return createdUser;
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
