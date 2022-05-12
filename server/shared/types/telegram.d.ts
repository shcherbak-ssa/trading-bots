import type { User } from 'global/types';

import { Notification } from 'shared/types';
import { TelegramActionType, TelegramCommand } from 'shared/constants';

import { IncomeMessage } from 'api/telegram/types';


export type TelegramCommandConfig = {
  heading: string;
  onlyAdmin: boolean;
  commands: TelegramCommandItemConfig[];
}

export type TelegramCommandItemConfig = {
  command: TelegramCommand;
  description: string;
  parameterRequired?: boolean;
  parameter?: string;
}

export type TelegramIncomeMessage = {
  telegramToken: string;
  update_id: number;
  message: IncomeMessage;
  my_chat_member?: IncomeMessage;
}


// Actions
export type TelegramAction =
  | ConnectUserAction
  | CreateUserAction
  | GetUserLoginAction
  | SetUserLoginAction;

export type ConnectUserAction = {
  type: 'action',
  action: TelegramActionType.CONNECT_USER_TELEGRAM;
  username: string;
  password: string;
  getMessage: () => string;
}

export type CreateUserAction = {
  type: 'action',
  action: TelegramActionType.CREATE_USER,
  username: string;
  getMessage: (username: string, password: string) => string;
}

export type GetUserLoginAction = {
  type: 'action',
  action: TelegramActionType.GET_USER_LOGIN,
  field: 'username' | 'password';
  getMessage: (value: string) => string;
}

export type SetUserLoginAction = {
  type: 'action',
  action: TelegramActionType.SET_USER_LOGIN,
  field: 'username' | 'password';
  newValue: string;
  getMessage: () => string;
  getValidationMessage: (field: string, minLength: number) => string;
}


// Service
export interface TelegramService {
  getUnknownUserMessage(): string;
  parseUnknownUserCommand(message: string): string | TelegramAction;
  parseUserCommand(user: User, message: string): string | TelegramAction;
  getNotificationMessage(notification: Notification): string;
  sendMessage(chatId: number, message: string): Promise<void>;
}
