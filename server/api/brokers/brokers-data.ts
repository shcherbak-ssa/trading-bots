import type { BrokerAccount, BrokerMarket } from 'global/types';
import { BrokerName, Currency, StatusCode } from 'global/constants';

import type { BrokersDataApi, BrokersDataApiPayload, BrokerApiLeverageResponse } from 'shared/types';
import { AppError } from 'shared/exceptions';
import { getBrokerLabel } from 'shared/utils';

import { CurrencyComDataApi } from './currency_com';


export class BrokersData implements BrokersDataApi {
  async getAccounts({ brokerName, accountType, apiKeys }: BrokersDataApiPayload): Promise<BrokerAccount[]> {
    switch (brokerName) {
      case BrokerName.CURRENCY_COM:
        return await CurrencyComDataApi.getAccounts(accountType, apiKeys);
    }

    throw new AppError({
      message: `${getBrokerLabel(brokerName)} data API not implemented yet`,
      messageHeading: `Broker`,
    }, StatusCode.NOT_IMPLEMENTED);
  }

  async getMarkets(
    { brokerName, accountType, apiKeys, accountCurrency = Currency.USD }: BrokersDataApiPayload
  ): Promise<BrokerMarket[]> {
    switch (brokerName) {
      case BrokerName.CURRENCY_COM:
        return await CurrencyComDataApi.getMarkets(accountType, accountCurrency, apiKeys);
    }

    throw new AppError({
      message: `${getBrokerLabel(brokerName)} data API not implemented yet`,
      messageHeading: `Broker`,
    }, StatusCode.NOT_IMPLEMENTED);
  }

  async getMarketLeverages(
    { brokerName, accountType, apiKeys, marketSymbol = '' }: BrokersDataApiPayload
  ): Promise<BrokerApiLeverageResponse> {
    switch (brokerName) {
      case BrokerName.CURRENCY_COM:
        return await CurrencyComDataApi.getMarketLeverages(accountType, marketSymbol, apiKeys);
    }

    throw new AppError({
      message: `${getBrokerLabel(brokerName)} data API not implemented yet`,
      messageHeading: `Broker`,
    }, StatusCode.NOT_IMPLEMENTED);
  }
}
