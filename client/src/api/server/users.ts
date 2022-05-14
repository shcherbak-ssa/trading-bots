import type { ClientUser } from 'global/types';
import { ServerEndpoint } from 'global/constants';

import type { UsersApi } from 'shared/types';

import { Api } from './lib/api';


export class Users implements UsersApi {
  async getUser(): Promise<ClientUser> {
    return await Api.get({
      endpoint: ServerEndpoint.API_USERS,
      params: {},
      body: {},
    });
  }
}
