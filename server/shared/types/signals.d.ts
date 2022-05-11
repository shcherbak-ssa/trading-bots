import type { Bot } from 'global/types';

import { SignalDirection, SignalType } from 'shared/constants';


export type Signal = {
  botToken: string;
  type: SignalType;
  direction: SignalDirection;
  stopLossPrice: number;
  market: string;
}

export type SignalLogPayload = {
  bot: Bot | null;
  signal: Signal;
}
