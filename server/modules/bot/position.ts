import type { BotPosition } from './types';


export class Position implements BotPosition {
  brokerPositionId: string;
  isLong: boolean;
  riskSize: number;
  marketSymbol: string;
  positionSize: number;
  stopLossPrice: number;
  stopLossSize: number
  takeProfitPrice: number | null = null;
  takeProfitSize: number | null = null;
  feeOpen: number | null = null;
  feeClose: number | null = null;
  result: number;
}
