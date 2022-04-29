import type { BrokerAccount, BrokerMarket } from 'global/types';
import { BrokerName, Currency, StatusCode } from 'global/constants';

import type { BrokersDataApi, BrokersApiPayload, BrokerApiLeverageResponse } from 'shared/types';
import { AppError } from 'shared/exceptions';

import { CurrencyComDataApi } from './currency_com';


export class BrokersData implements BrokersDataApi {
  async getAccounts({ brokerName, accountType, apiKeys }: BrokersApiPayload): Promise<BrokerAccount[]> {
    switch (brokerName) {
      case BrokerName.CURRENCY_COM:
        return await CurrencyComDataApi.getAccounts(accountType, apiKeys);
    }

    throw new AppError(StatusCode.NOT_IMPLEMENTED, {
      message: `Broker [${brokerName}] data API not implemented yet`,
    });
  }

  async getMarkets(
    { brokerName, accountType, apiKeys, accountCurrency = Currency.USD }: BrokersApiPayload
  ): Promise<BrokerMarket[]> {
    switch (brokerName) {
      case BrokerName.CURRENCY_COM:
        return await CurrencyComDataApi.getMarkets(accountType, accountCurrency, apiKeys);
    }

    throw new AppError(StatusCode.NOT_IMPLEMENTED, {
      message: `Broker [${brokerName}] data API not implemented yet`,
    });
  }

  async getMarketLeverages(
    { brokerName, accountType, apiKeys, marketSymbol = '' }: BrokersApiPayload
  ): Promise<BrokerApiLeverageResponse> {
    switch (brokerName) {
      case BrokerName.CURRENCY_COM:
        return await CurrencyComDataApi.getMarketLeverages(accountType, marketSymbol, apiKeys);
    }

    throw new AppError(StatusCode.NOT_IMPLEMENTED, {
      message: `Broker [${brokerName}] data API not implemented yet`,
    });
  }
}
