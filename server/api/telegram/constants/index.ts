export const API_URL: string = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
export const BOT_URL: string = `http://t.me/${process.env.TELEGRAM_BOT_USERNAME}`;

export const COMMAND_INITIAL_STRING: string = '/';
export const COMMAND_SEPARATOR: RegExp = /\s+/g;


export enum Endpoint {
  SET_WEBHOOK = '/setWebhook',
  SEND_MESSAGE = '/sendMessage',
}

export enum ChatType {
  PRIVATE = 'private',
  GROUP = 'group',
  SUPERGROUP = 'supergroup',
  CHANNEL = 'channel',
}
