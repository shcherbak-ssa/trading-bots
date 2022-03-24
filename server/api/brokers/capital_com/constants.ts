export const REAL_ACCOUNT_API_URL: string = 'https://api-capital.backend-capital.com';
export const DEMO_ACCOUNT_API_URL: string = 'https://demo-api-capital.backend-capital.com';


export const ACCOUNT_UPDATE_INTERVAL: number = 60000;


export enum Endpoint {
  ACCOUNTS = '/api/v1/accounts',
}


// Account
export enum AccountType {
  CFD = 'CFD',
  PHYSICAL = 'PHYSICAL',
  SPREADBET = 'SPREADBET',
}

export enum AccountStatus {
  DISABLED = 'DISABLED',
  ENABLED = 'ENABLED',
  SUSPENDED_FROM_DEALING = 'SUSPENDED_FROM_DEALING',
}
