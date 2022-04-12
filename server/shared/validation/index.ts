import type { Schema } from 'joi';
import Joi from 'joi';

import type { ServerRequestPayload } from 'shared/types';
import { Validation } from 'shared/constants';

import { brokersValidation } from './brokers';


const validations: { [p in Validation]: Schema } = {
  [Validation.EMPTY]: Joi.object(),

  [Validation.ID]: Joi.object({
    id: Joi.string(),
  }),

  ...brokersValidation,

  'bots/create': Joi.object(),
  'bots/read': Joi.object(),
  'bots/update': Joi.object(),
  'bots/delete': Joi.object()
};


export function validate(validation: Validation, payload: ServerRequestPayload): void {
  const schema: Schema = validations[validation];

  const validationResult = schema.validate(payload);

  // @TODO: error processing
  if (validationResult.error) {
    console.error(`error: [validation] - ${JSON.stringify(validationResult.error)}`);
  }
}
