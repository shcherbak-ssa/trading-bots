import type { PositionType } from 'shared/constants';
import type { BotPosition } from './types';


export class Position implements BotPosition {
  type: PositionType;
  riskSize: number;
  positionSize: number;
  stopLossPrice: number;
  stopLossSize: number
  takeProfitPrice: number | null = null;
  takeProfitSize: number | null = null;
}