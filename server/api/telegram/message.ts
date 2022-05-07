import type { TelegramMessage } from 'shared/types';

import type { Message } from './types';
import { Endpoint } from './constants';

import { Api } from './lib/api';


export async function sendMessage(chatId: number, { message }: TelegramMessage): Promise<void> {
  await Api.sendRequest<Message, Message>(Endpoint.SEND_MESSAGE, {
    chat_id: chatId,
    text: message,
    parse_mode: 'HTML',
  });
}
