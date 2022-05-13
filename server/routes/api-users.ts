import type { ClientUser } from 'global/types';
import { RequestMethod, ServerEndpoint } from 'global/constants';

import type { ServerRoute } from 'shared/types';
import { ActionType, Validation } from 'shared/constants';

import { runAction } from 'services/actions';


export const apiUsersRoutes: ServerRoute[] = [
  {
    endpoint: ServerEndpoint.API_USERS,
    method: RequestMethod.GET,
    validation: Validation.NONE,
    async handler(userId: string): Promise<ClientUser> {
      return await runAction({
        type: ActionType.USERS_GET_CLIENT,
        userId,
        payload: {},
      });
    },
  },
];
