import {
  PositionCloseRejectReason, PositionCloseState,
  PositionCloseType,
  OrderSide,
  OrderStatus,
  OrderTimeInForce,
  OrderType, PositionState
} from '../constants';


// Custom Models
export type Position = {
  accountId: string;
  quantity: number;
  symbol: string;
  side: OrderSide;
}

export type OpenPosition = {
  id: string;
  feeOpen: number;
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

export type PositionListResponse = {
  positions: ActivePosition[];
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
