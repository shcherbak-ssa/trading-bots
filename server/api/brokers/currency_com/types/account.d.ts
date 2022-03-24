// Custom Models
export type AccountRequestSettings = {
  accountId?: string;
  showZeroBalance?: boolean;
}

export type ParsedBalance = {
  id: string;
  currency: string;
  availableAmount: number;
  totalAmount: number;
}


// Request Models
export type AccountRequest = {
  recvWindow?: number;
  showZeroBalance?: boolean;
  timestamp: number;
}


// Response Models
export type AccountResponse = {
  affiliateId: string;
  balances: AccountBalance[];
  buyerCommission: number;
  canDeposit: boolean;
  canTrade: boolean;
  canWithdraw: boolean;
  makerCommission: number;
  sellerCommission: number;
  takerCommission: number;
  updateTime: number;
  userId: number;
}

export type AccountBalance = {
  accountId: string;
  asset: string;
  collateralCurrency: boolean;
  default: boolean;
  free: number;
  locked: number;
}
