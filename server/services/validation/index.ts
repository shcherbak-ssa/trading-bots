import type { Schema } from 'joi';
import Joi from 'joi';

import type { ServerRequestPayload } from 'shared/types';
import { Validation } from 'shared/constants';
import { ValidationError } from 'shared/exceptions';

import { brokersValidation } from './brokers';
import { botsValidation } from './bots';
import { signalsValidation } from './signals';


const validations: { [p in Validation]: Schema } = {
  [Validation.NONE]: Joi.object({}),
  [Validation.EMPTY]: Joi.object({}),

  [Validation.ONLY_ID]: Joi.object({
    id: Joi.string().required(),
  }),

  ...brokersValidation,
  ...botsValidation,
  ...signalsValidation,
};


export function validate(validation: Validation, payload: ServerRequestPayload): void {
  const schema: Schema = validations[validation];

  const validationResult = schema.validate(payload);

  if (validationResult.error) {
    throw new ValidationError({
      message: validationResult.error.details.map(({ message }) => message).join(' '),
      messageHeading: 'Validation',
      idLabel: 'validation',
      id: validation,
      payload: validationResult.error,
    });
  }
}
