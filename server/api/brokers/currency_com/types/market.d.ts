// Custom Models
export type Market = {
  marketSymbol: string;
  currency: string;
  minPositionSize: number;
  tickSize: number;
  leverage: number;
  price: number;
  spread: number;
}

export type MarketPrice = {
  price: number;
  spread: number;
}


// WebSocket Subscribes
export type MarketPriceSubscribePayload = {
  symbols: string[];
}

export type MarketPriceSubscribeResponsePayload = {
  symbolName: string;
  bid: number;
  bidQty: number;
  ofr: number;
  ofrQty: number;
  timestamp: number;
}


// Request Models
export type MarketLeverageRequest = {
  recvWindow?: number;
  symbol: string;
  timestamp: number;
}

export type MarketPriceRequest = {
  symbol: string;
}


// Response Models
export type MarketLeverageResponse = {
  value: number;
  values: number[];
}

export type MarketPriceResponse = {
  askPrice: string;
  bidPrice: string;
  closeTime: number;
  highPrice: string;
  lastPrice: string;
  lastQty: string;
  lowPrice: string;
  openPrice: string;
  openTime: number;
  prevClosePrice: string;
  priceChange: string;
  priceChangePercent: string;
  quoteVolume: string;
  symbol: string;
  volume: string;
  weightedAvgPrice: string;
}
