import { ServerEndpoint } from 'global/constants';

import { ApiError } from 'shared/exceptions';

import type { SetWebhook } from './types';
import { Endpoint } from './constants';
import { Api } from './lib/api';


export async function setupTelegramWebhook(): Promise<void> {
  const deleted = await Api.sendRequest<SetWebhook, boolean>(Endpoint.SET_WEBHOOK, { url: '' });

  if (!deleted) {
    throw new ApiError({
      message: `Something went wrong with deleting webhook`,
      messageLabel: 'Telegram',
    });
  }

  const botToken: string = process.env.TELEGRAM_BOT_TOKEN || '';
  const webhookEndpoint: string = ServerEndpoint.WEBHOOK_TELEGRAM.replace(':token', botToken);

  const created = await Api.sendRequest<SetWebhook, boolean>(Endpoint.SET_WEBHOOK, {
    url: process.env.SERVER_URL + webhookEndpoint,
  });
  
  if (!created) {
    throw new ApiError({
      message: `Something went wrong with creating webhook`,
      messageLabel: 'Telegram',
    });
  }
}
