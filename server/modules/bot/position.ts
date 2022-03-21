import type { BotPosition } from './types';


export class Position implements BotPosition {
  id: string;
  isLong: boolean;
  riskSize: number;
  positionSize: number;
  stopLossPrice: number;
  stopLossSize: number
  takeProfitPrice: number | null = null;
  takeProfitSize: number | null = null;
  feeOpen: number | null = null;
  feeClose: number | null = null;
}
