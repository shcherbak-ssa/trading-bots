import type { UserAccess } from 'global/types';
import { RequestMethod, ServerEndpoint } from 'global/constants';

import type { CheckUserPayload, ServerRoute } from 'shared/types';
import { ActionType, Validation } from 'shared/constants';

import { runAction } from 'services/actions';


export const authRoutes: ServerRoute[] = [
  {
    endpoint: ServerEndpoint.AUTH_LOGIN,
    method: RequestMethod.POST,
    validation: Validation.AUTH_LOGIN,
    async handler(userId: string, payload: CheckUserPayload): Promise<UserAccess> {
      return runAction({
        type: ActionType.USERS_LOGIN,
        userId,
        payload,
      });
    },
  },
];
