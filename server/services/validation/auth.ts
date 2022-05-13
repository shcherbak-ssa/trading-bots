import Joi from 'joi';

import { PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH } from 'global/constants';

import { Validation } from 'shared/constants';


export const authValidation = {
  [Validation.AUTH_LOGIN]: Joi.object({
    username: Joi.string()
      .min(USERNAME_MIN_LENGTH)
      .required(),
    password: Joi.string()
      .min(PASSWORD_MIN_LENGTH)
      .required(),
  }),
};
