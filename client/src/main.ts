import type { ClientUser } from 'global/types';

import type { UsersApi } from 'shared/types';
import { LOCAL_STORAGE_TOKEN_KEY } from 'shared/constants';

import { Users } from 'api/server/users';


setupApp().catch(console.error);


async function setupApp(): Promise<void> {
  let currentUser: ClientUser;

  try {
    const isTokenExist: boolean = !!localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

    if (!isTokenExist) {
      throw new Error('Token not found');
    }

    const users: UsersApi = new Users();
    currentUser = await users.getUser();
  } catch (e: any) {
    console.error(e);

    history.pushState({}, '', location.origin + '/');

    const { setup } = await import('./app/login');

    return setup();
  }

  const { setup } = await import('./app');

  setup(currentUser);
}
