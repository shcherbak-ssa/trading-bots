import Joi from 'joi';

import { BrokerName, BrokerDataType, BrokerAccountType } from 'global/constants';

import { Validation } from 'shared/constants';


export const brokersValidation = {
  [Validation.BROKERS_LOAD]: Joi.object({
    withBots: Joi.boolean().required(),
  }),

  [Validation.BROKERS_GET_DATA]: Joi.object({
    id: Joi.string().required(),
    dataType: Joi.string()
      .valid(
        BrokerDataType.ACCOUNT,
        BrokerDataType.MARKET,
        BrokerDataType.MARKET_LEVERAGE,
      )
      .required(),
    allowDemoAccount: Joi.boolean(),
    accountType: Joi.string()
      .valid(
        BrokerAccountType.REAL,
        BrokerAccountType.DEMO,
      ),
    accountCurrency: Joi.string(),
    marketSymbol: Joi.string(),
  }),

  [Validation.BROKERS_CONNECT]: Joi.object({
    name: Joi.string()
      .valid(
        BrokerName.CAPITAL_COM,
        BrokerName.CURRENCY_COM,
      )
      .required(),
    expiresAt: Joi.string().required(),
    apiKeys: Joi.object()
      .pattern(Joi.string(), Joi.string())
      .required(),
  }),

  [Validation.BROKERS_UPDATE]: Joi.object({
    id: Joi.string().required(),
    name: Joi.string()
      .valid(
        BrokerName.CAPITAL_COM,
        BrokerName.CURRENCY_COM,
      )
      .required(),
    updates: Joi.object({
      expiresAt: Joi.string().required(),
      apiKeys: Joi.object()
        .pattern(Joi.string(), Joi.string())
        .required(),
    }),
  }),
};
