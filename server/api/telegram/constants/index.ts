export const API_URL: string = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;


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
