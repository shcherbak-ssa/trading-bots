export type User = {
  id: string;
  telegramChatId: number;
  isAdmin: boolean;
  username: string;
}

export type ClientUser = Omit<User, 'id' | 'telegramChatId'>;

export type UserAccess = {
  token: string;
}
