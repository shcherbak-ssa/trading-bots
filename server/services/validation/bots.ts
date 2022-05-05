import Joi from 'joi';

import { BotPositionCloseMode, BotRestartMode, BotUpdateType, BrokerAccountType, BrokerName } from 'global/constants';
import { botDefaultSettings } from 'global/config';

import { Validation } from 'shared/constants';


export const botsValidation = {
  [Validation.BOTS_GET]: Joi.object({
    brokerId: Joi.string(),
  }),

  [Validation.BOTS_CREATE]: Joi.object({
    name: Joi.string().required(),
    active: Joi.boolean().required(),
    brokerId: Joi.string().required(),
    brokerName: Joi.string()
      .valid(
        BrokerName.CURRENCY_COM,
        BrokerName.CAPITAL_COM,
      )
      .required(),
    brokerAccountId: Joi.string().required(),
    brokerAccountType: Joi.string()
      .valid(
        BrokerAccountType.REAL,
        BrokerAccountType.DEMO,
      )
      .required(),
    brokerAccountCurrency: Joi.string().required(),
    brokerMarketSymbol: Joi.string().required(),
    brokerMarketName: Joi.string().required(),
    tradeRiskPercent: Joi.number()
      .min(botDefaultSettings.tradeRiskPercent.min)
      .max(botDefaultSettings.tradeRiskPercent.max)
      .required(),
    tradeMaxLossPercent: Joi.number()
      .min(botDefaultSettings.tradeMaxLossPercent.min)
      .max(botDefaultSettings.tradeMaxLossPercent.max)
      .required(),
    tradeCapitalPercent: Joi.number()
      .min(botDefaultSettings.tradeCapitalPercent.min)
      .max(botDefaultSettings.tradeCapitalPercent.max)
      .required(),
    tradeWithTakeProfit: Joi.boolean().required(),
    tradeTakeProfitPL: Joi.number()
      .min(botDefaultSettings.tradeTakeProfitPL.min)
      .max(botDefaultSettings.tradeTakeProfitPL.max)
      .required(),
    tradeWithCustomMarketLeverage: Joi.boolean().required(),
    tradeCustomMarketLeverage: Joi.number().required(),
    positionCloseEnable: Joi.boolean().required(),
    positionCloseMode: Joi.string()
      .valid(
        BotPositionCloseMode.NONE,
        BotPositionCloseMode.DAY_END,
        BotPositionCloseMode.WEEK_END,
      )
      .required(),
    restartEnable: Joi.boolean().required(),
    restartMode: Joi.string()
      .valid(
        BotRestartMode.NONE,
        BotRestartMode.WEEK,
        BotRestartMode.MONTH,
      )
      .required(),
  }),

  [Validation.BOTS_UPDATE]: Joi.object({
    id: Joi.string().required(),
    type: Joi.string()
      .valid(
        BotUpdateType.ACTIVATE,
        BotUpdateType.DEACTIVATE,
        BotUpdateType.RESTART,
        BotUpdateType.ARCHIVE,
        BotUpdateType.UPDATE,
      )
      .required(),
    updates: Joi.object({
      name: Joi.string(),
      tradeRiskPercent: Joi.number()
        .min(botDefaultSettings.tradeRiskPercent.min)
        .max(botDefaultSettings.tradeRiskPercent.max),
      tradeMaxLossPercent: Joi.number()
        .min(botDefaultSettings.tradeMaxLossPercent.min)
        .max(botDefaultSettings.tradeMaxLossPercent.max),
      tradeCapitalPercent: Joi.number()
        .min(botDefaultSettings.tradeCapitalPercent.min)
        .max(botDefaultSettings.tradeCapitalPercent.max),
      tradeWithTakeProfit: Joi.boolean(),
      tradeTakeProfitPL: Joi.number()
        .min(botDefaultSettings.tradeTakeProfitPL.min)
        .max(botDefaultSettings.tradeTakeProfitPL.max),
      tradeWithCustomMarketLeverage: Joi.boolean(),
      tradeCustomMarketLeverage: Joi.number(),
      positionCloseEnable: Joi.boolean(),
      positionCloseMode: Joi.string()
        .valid(
          BotPositionCloseMode.NONE,
          BotPositionCloseMode.DAY_END,
          BotPositionCloseMode.WEEK_END,
        ),
      restartEnable: Joi.boolean(),
      restartMode: Joi.string()
        .valid(
          BotRestartMode.NONE,
          BotRestartMode.WEEK,
          BotRestartMode.MONTH,
        ),
    }),
  }),
};
