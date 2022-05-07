export type User = {
  id: string;
  telegramChatId: number;
  isAdmin: boolean;
}

export type NewUser = Omit<User, 'id'>;
