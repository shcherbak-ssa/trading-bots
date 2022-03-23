export const ZERO_COMMISSION: number = 0;
export const TAKE_COMMISSION_TIMES: number = 2;


export enum AliveBotErrorPlace {
  ACCOUNT_AMOUNT_UPDATE = 'ACCOUNT_AMOUNT_UPDATE',
  MARKET_WS_CLOSE = 'MARKET_WS_CLOSE',
  MARKET_WS_ERROR = 'MARKET_WS_ERROR',
  POSITION_CLOSE = 'POSITION_CLOSE'
}

export enum BotEvent {
  CREATE = 'bot/create',
  PROCESS_SIGNAL = 'bot/process-signal',
  UPDATE_POSITION = 'bot/update-position',
  CLOSE_POSITION = 'bot/close-position',
}
