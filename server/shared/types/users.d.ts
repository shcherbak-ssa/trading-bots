import { GetUserType } from 'global/constants';

import type { CreationDocument } from 'shared/types';


export type NewUser = CreationDocument<UsersDatabaseDocument>;

export type GetUserFilters = {
  type: GetUserType;
  id?: string;
  telegramChatId?: number;
  isAdmin?: boolean;
  username?: string;
}

export type UpdateUserPayload = {
  telegramChatId?: number;
  username?: string;
  password?: string;
}

export type CheckUserPayload = {
  username: string;
  password: string;
}


// Database Api
export type UsersDatabaseDocument = {
  id: string;
  telegramChatId: number;
  isAdmin: boolean;
  username: string;
  password: string;
}

export interface UsersDatabaseCollection {
  getUsers(filters: GetUserFilters): Promise<UsersDatabaseDocument[]>;
  createUser(user: CreationDocument<UsersDatabaseDocument>): Promise<UsersDatabaseDocument>;
  updateUser(userId: string, updates: UpdateUserPayload): Promise<void>;
  isUsernameUnique(username: string): Promise<boolean>;
  isValidUser(payload: CheckUserPayload): Promise<boolean>;
}
