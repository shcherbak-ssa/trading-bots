import { CreationDocument } from 'shared/types/database';


// Api Database
export type UsersDatabaseDocument = {
  id: string;
  email: string;
}


export interface UsersDatabaseCollection {
  findUserByEmail(email: string): Promise<UsersDatabaseDocument | null>;
  createUser(user: CreationDocument<UsersDatabaseDocument>): Promise<UsersDatabaseDocument>;
}
