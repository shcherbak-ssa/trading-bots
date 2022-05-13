import type { ClientUser } from 'global/types';


export interface UsersApi {
  getUser(): Promise<ClientUser>;
}
