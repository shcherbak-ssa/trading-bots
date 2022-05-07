import type { Bot } from 'global/types';

import { SignalDirection, SignalType } from 'shared/constants';


export type Signal = {
  botToken: string;
  type: SignalType;
  direction: SignalDirection;
  stopLossPrice: number;
}

export type SignalLogPayload = {
  bot: Bot,
  signal: Signal;
}
