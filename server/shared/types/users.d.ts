import type { User } from 'global/types';
import { GetUserType } from 'global/constants';

import type { CreationDocument } from 'shared/types';


export type GetUserFilters = {
  type: GetUserType;
  id?: string;
  telegramChatId?: number;
  isAdmin?: boolean;
}

export type UpdateUserPayload = {
  telegramChatId?: number;
}


// Database Api
export type UsersDatabaseDocument = User;

export interface UsersDatabaseCollection {
  getUsers(filters: GetUserFilters): Promise<UsersDatabaseDocument[]>;
  createUser(user: CreationDocument<UsersDatabaseDocument>): Promise<UsersDatabaseDocument>;
  updateUser(userId: string, updates: UpdateUserPayload): Promise<void>;
}
