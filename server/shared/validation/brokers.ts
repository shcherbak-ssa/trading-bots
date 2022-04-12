import Joi from 'joi';

import { BrokerName } from 'global/constants';
import { Validation } from 'shared/constants';


export const brokersValidation = {
  [Validation.BROKERS_CONNECT]: Joi.object({
    name: Joi.string().valid(
      BrokerName.CAPITAL_COM,
      BrokerName.CURRENCY_COM,
    ),
    expiresDate: Joi.string(), // @TODO: maybe change format
    apiKeys: Joi.object().pattern(Joi.string(), Joi.string()),
  }),
};
