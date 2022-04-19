import { AccountStatus, AccountType } from '../constants';


// Custom Models
export type ParsedAccount = {
  id: string;
  name: string;
  currency: string;
  availableAmount: number;
  totalAmount: number;
}


// Data Models
export type AccountItem = {
  accountId: string;
  accountName: string;
  accountType: AccountType;
  balance: AccountBalance;
  currency: string;
  preferred: boolean;
  status: AccountStatus;
}

export type AccountBalance = {
  available: number;
  balance: number;
  deposit: number;
  profitLoss: number;
}


// Response Models
export type AccountResponse = {
  accounts: AccountItem[];
}
