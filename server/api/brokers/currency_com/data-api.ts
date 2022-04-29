import type { BrokerAccount, BrokerMarket } from 'global/types';
import type { BrokerAccountType } from 'global/constants';

import type { BrokerApiLeverageResponse } from 'shared/types';

import type { ExchangeSymbolInfo, ParsedBalance, MarketLeverageResponse } from './lib/types';
import { ExchangeMarketType } from './lib/constants';
import { RestApi } from './lib/rest-api';
import { AccountApi } from './lib/account';
import { MarketApi } from './lib/market';


export class DataApi {
  static async getAccounts(
    accountType: BrokerAccountType,
    { apiKey, secretKey }: { [p: string]: string },
  ): Promise<BrokerAccount[]> {
    const api: RestApi = new RestApi(apiKey, secretKey);
    api.setAccountType(accountType);

    const accountApi: AccountApi = new AccountApi(api);
    const accounts: ParsedBalance[] = await accountApi.loadAccounts({});

    return accounts.map(({ id, currency, totalAmount }) => {
      return {
        type: accountType,
        accountId: id,
        amount: totalAmount,
        currency: currency,
        name: `${currency}.cx`,
      };
    });
  }

  static async getMarkets(
    accountType: BrokerAccountType,
    accountCurrency: string,
    { apiKey, secretKey }: { [p: string]: string },
  ): Promise<BrokerMarket[]> {
    const api: RestApi = new RestApi(apiKey, secretKey);
    api.setAccountType(accountType);

    const marketApi: MarketApi = new MarketApi(api);
    const markets: ExchangeSymbolInfo[] = await marketApi.loadMarkets();

    return markets
      .filter(({ quoteAsset }) => {
        return quoteAsset === accountCurrency;
      })
      .filter(({ marketType }) => {
        return marketType === ExchangeMarketType.LEVERAGE;
      })
      .filter((value, index, self) => {
        return index === self.findIndex((t) => t.name === value.name);
      })
      .map(({ name, symbol, quoteAsset }) => {
        return {
          name,
          symbol,
          currency: quoteAsset,
        };
      });
  }

  static async getMarketLeverages(
    accountType: BrokerAccountType,
    marketSymbol: string,
    { apiKey, secretKey }: { [p: string]: string },
  ): Promise<BrokerApiLeverageResponse> {
    const api: RestApi = new RestApi(apiKey, secretKey);
    api.setAccountType(accountType);

    const marketApi: MarketApi = new MarketApi(api);
    const { value, values }: MarketLeverageResponse = await marketApi.loadMarketLeverage(marketSymbol);

    return {
      current: value,
      available: values,
    };
  }
}
