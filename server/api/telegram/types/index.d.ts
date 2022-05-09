import type { ChatType } from '../constants';
import exp from 'constants';


// Requests
export type ResponseResult<Result> = SuccessResult<Result> | ErrorResult;

export type SuccessResult<Result> = {
  ok: true;
  result: Result;
}

export type ErrorResult = {
  ok: false;
  description: string;
  error_code: number;
}


// Webhook
export type SetWebhook = {
  url: string;
}


// Message
export type Message = {
  chat_id: number;
  text: string;
  parse_mode: 'Markdown' | 'HTML';
}

export type IncomeMessage = {
  message_id: number;
  from: User;
  chat: Chat;
  date: number;
  text: string;
}


// Chat
export type Chat = {
  id: number;
  type: ChatType;
  title?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}


// User
export type User = {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
}
