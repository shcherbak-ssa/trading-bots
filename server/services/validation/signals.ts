import Joi from 'joi';

import { SignalDirection, SignalType, Validation } from 'shared/constants';


export const signalsValidation = {
  [Validation.SIGNALS]: Joi.object({
    botToken: Joi.string().required(),
    stopLossPrice: Joi.number().required(),
    market: Joi.string().required(),
    type: Joi.string()
      .valid(
        SignalType.PING,
        SignalType.OPEN,
        SignalType.UPDATE,
        SignalType.CLOSE,
      )
      .required(),
    direction: Joi.string()
      .valid(
        SignalDirection.LONG,
        SignalDirection.SHORT,
      )
      .required(),
  }),
};
