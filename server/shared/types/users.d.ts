import { CreationDocument } from 'shared/types';


// Database Api
export type UsersDatabaseDocument = {
  id: string;
  email: string;
}


export interface UsersDatabaseCollection {
  getUsers(): Promise<UsersDatabaseDocument[]>;
  findUserByEmail(email: string): Promise<UsersDatabaseDocument | null>;
  createUser(user: CreationDocument<UsersDatabaseDocument>): Promise<UsersDatabaseDocument>;
}
