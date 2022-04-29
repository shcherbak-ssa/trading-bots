import type { Schema } from 'joi';
import Joi from 'joi';

import type { ServerRequestPayload } from 'shared/types';
import { Validation } from 'shared/constants';
import { ValidationError } from 'shared/exceptions';

import { brokersValidation } from './brokers';
import { botsValidation } from './bots';


const validations: { [p in Validation]: Schema } = {
  [Validation.EMPTY]: Joi.object({}),

  [Validation.ONLY_ID]: Joi.object({
    id: Joi.string().required(),
  }),

  ...brokersValidation,
  ...botsValidation,
};


export function validate(validation: Validation, payload: ServerRequestPayload): void {
  const schema: Schema = validations[validation];

  const validationResult = schema.validate(payload);

  if (validationResult.error) {
    console.error(`error: [validation] - ${JSON.stringify(validationResult.error)}`);

    throw new ValidationError(
      ...validationResult.error.details.map(({ message }) => {
        return { message };
      })
    );
  }
}
