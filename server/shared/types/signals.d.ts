import { SignalDirection, SignalType } from 'shared/constants';


export type Signal = {
  botToken: string;
  type: SignalType;
  direction: SignalDirection;
  stopLossPrice: number;
}
