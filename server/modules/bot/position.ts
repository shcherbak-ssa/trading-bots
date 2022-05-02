import type { BotPosition } from './types';


export class Position implements BotPosition {
  id: string = '';
  brokerPositionIds: string[] = [];
  isLong: boolean;
  riskSize: number;
  marketSymbol: string;
  quantity: number;
  stopLossPrice: number;
  stopLossSize: number
  takeProfitPrice: number = 0;
  takeProfitSize: number = 0;
  feeOpen: number = 0;
  feeClose: number = 0;
  result: number = 0;
}
