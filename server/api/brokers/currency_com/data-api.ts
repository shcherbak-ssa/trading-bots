import type { BrokerAccount, BrokerMarket, BrokerApiKeys } from 'global/types';
import type { BrokerAccountType } from 'global/constants';

import type { BrokerApiLeverageResponse } from 'shared/types';

import type { ExchangeSymbolInfo, ParsedBalance, MarketLeverageResponse } from './types';
import { ExchangeMarketAssetType, ExchangeMarketType } from './constants';

import { RestApi } from './lib/rest-api';
import { AccountApi } from './lib/account';
import { MarketApi } from './lib/market';


export class DataApi {
  static async getAccounts(
    accountType: BrokerAccountType,
    { apiKey, secretKey }: BrokerApiKeys,
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
    { apiKey, secretKey }: BrokerApiKeys,
  ): Promise<BrokerMarket[]> {
    const api: RestApi = new RestApi(apiKey, secretKey);
    api.setAccountType(accountType);

    const marketApi: MarketApi = new MarketApi(api);
    const markets: ExchangeSymbolInfo[] = await marketApi.loadMarkets();

    return markets
      .filter(({ assetType, quoteAsset, marketType }) => {
        return (
          quoteAsset === accountCurrency &&
          marketType === ExchangeMarketType.LEVERAGE &&
          assetType !== ExchangeMarketAssetType.BOND &&
          assetType !== ExchangeMarketAssetType.INTEREST_RATE &&
          assetType !== ExchangeMarketAssetType.REAL_ESTATE
        );
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
    { apiKey, secretKey }: BrokerApiKeys,
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
