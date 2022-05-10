import type { Bot, User } from 'global/types';
import { GetUserType } from 'global/constants';

import type { BotsGetFilters, GetUserFilters } from 'shared/types';
import { ActionType } from 'shared/constants';

import { runAction } from 'services/actions';


export class Helpers {
  static async getAllUsers(): Promise<User[]> {
    return await runAction<GetUserFilters, User[]>({
      type: ActionType.USERS_GET,
      userId: '',
      payload: { type: GetUserType.ALL },
    });
  }

  static async getActiveBots(userId: string): Promise<Bot[]> {
    return await runAction<BotsGetFilters, Bot[]>({
      type: ActionType.BOTS_GET,
      userId,
      payload: { active: true, withBrokerAccount: false },
    });
  }
}
