import { PositionCloseRejectReason, PositionCloseState, PositionCloseType } from '../constants';
import { PositionSource, PositionState, PositionStatus } from '../constants';
import { OrderSide, OrderStatus, OrderTimeInForce, OrderType } from '../constants';


// Custom Models
export type Position = {
  accountId: string;
  quantity: number;
  symbol: string;
  side: OrderSide;
}

export type ActiveParsedPosition = {
  id: string;
  fee: number;
}

export type ClosedParsedPosition = {
  fee: number;
  result: number;
}


// Data Models
export type ActivePosition = {
  id: string;
  orderId: string;
  accountId: string;
  closePrice: number;
  closeQuantity: number;
  closeTimestamp: number;
  cost: number
  createdTimestamp: number;
  currency: string;
  dividend: number;
  fee: number;
  guaranteedStopLoss: boolean;
  instrumentId: number;
  margin: number;
  openPrice: number;
  openQuantity: number;
  openTimestamp: number;
  rpl: number;
  rplConverted: number;
  state: PositionState;
  stopLoss: number;
  swap: number;
  swapConverted: number;
  symbol: string;
  takeProfit: number;
  type: 'HEDGE' | 'NET';
  upl: number;
  uplConverted: number;
}

export type ClosedPosition = {
  accountId: number;
  accountCurrency: string;
  createdTimestamp: number;
  currency: string;
  execTimestamp: number;
  executionType: OrderTimeInForce;
  fee: number;
  feeDetails: {
    [key: string]: number;
  };
  fxRate: number;
  gSL: boolean;
  instrumentId: number;
  positionId: string;
  price: number;
  quantity: number;
  rejectReason: PositionCloseRejectReason;
  rpl: number
  rplConverted: number;
  source: PositionSource;
  status: PositionStatus;
  stopLoss: number;
  swap: number;
  swapConverted: number;
  symbol: string;
  takeProfit: number;
}


// Request Models
export type CreateOrderRequest = {
  accountId: string;
  quantity: number;
  symbol: string;
  side: OrderSide;
  type: OrderType; // MARKET
  timestamp: number;
  expireTimestamp?: number;
  guaranteedStopLoss?: boolean;
  leverage?: number;
  newOrderRespType?: string;
  price?: number;
  recvWindow?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export type PositionListRequest = {
  symbol?: string;
  timestamp: number;
}

export type ClosePositionRequest = {
  positionId: string;
  timestamp: number;
  recvWindow?: number;
}


// Response Models
export type CreateOrderResponse = {
  executedQty: string;
  expireTimestamp: number;
  guaranteedStopLoss: boolean;
  margin: number;
  orderId: string;
  origQty: string;
  price: string;
  rejectMessage: string;
  side: OrderSide;
  status: OrderStatus;
  stopLoss: number;
  symbol: string;
  takeProfit: number;
  timeInForce: OrderTimeInForce;
  transactTime: number;
  type: OrderType;
}

export type ActivePositionsResponse = {
  positions: ActivePosition[];
}

export type ClosedPositionsResponse = {
  history: ClosedPosition[];
}

export type ClosePositionResponse = {
  request: {
    accountId: string;
    createdTimestamp: number;
    id: number;
    instrumentId: number;
    orderId: string;
    positionId: string;
    rejectReason: PositionCloseRejectReason;
    rqBody: string;
    rqType: PositionCloseType;
    state: PositionCloseState;
  }[];
}
