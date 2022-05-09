import type { User } from 'global/types';

import { TelegramActionType, TelegramCommand } from 'shared/constants';

import { IncomeMessage } from 'api/telegram/types';


export type TelegramCommandConfig = {
  command: TelegramCommand;
  onlyAdmin: boolean;
  description: string;
  params: TelegramCommandParamConfig[];
}

export type TelegramCommandParamConfig = {
  value: string;
  description: string;
  action: TelegramAction;
}

export type TelegramIncomeMessage = {
  telegramToken: string;
  update_id: number;
  message: IncomeMessage;
}

export type TelegramMessage = {
  type: 'message',
  message: string;
}


// Actions
export type TelegramAction =
  | ConnectUserAction
  | CreateUserAction
  | TodayReportAction
  | WeekReportAction
  | MonthReportAction;

type ConnectUserAction = {
  type: 'action',
  action: TelegramActionType.CONNECT_USER_TELEGRAM;
  userId: string;
  message: string;
}

type CreateUserAction = {
  type: 'action',
  action: TelegramActionType.CREATE_USER,
}

type TodayReportAction = {
  type: 'action',
  action: TelegramActionType.REPORT_TODAY,
}

type WeekReportAction = {
  type: 'action',
  action: TelegramActionType.REPORT_WEEK,
}

type MonthReportAction = {
  type: 'action',
  action: TelegramActionType.REPORT_MONTH,
}


// Service
export interface TelegramService {
  parseUnknownUserCommand(message: string): TelegramMessage | TelegramAction;
  parseUserCommand(user: User, message: string): TelegramMessage | TelegramAction;
  getNotificationMessage(notification: Notification): TelegramMessage;
  sendMessage(chatId: number, message: TelegramMessage): Promise<void>;
}
