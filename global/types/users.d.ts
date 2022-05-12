export type User = {
  id: string;
  telegramChatId: number;
  isAdmin: boolean;
  username: string;
  password: string;
}

export type NewUser = Omit<User, 'id'>;
