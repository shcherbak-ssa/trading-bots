import type { ErrorItem, ErrorPayload } from 'global/types';
import { BrokerName, StatusCode } from 'global/constants';

import { ErrorName } from 'shared/constants';


export class AppError extends Error {
  payload: ErrorPayload;
  status: StatusCode;

  constructor(status: StatusCode, ...errors: ErrorItem[]) {
    super(errors.map(({ message }) => message).join('\n'));

    this.payload = { errors };
    this.status = status;
  }
}

export class ValidationError extends AppError {
  name = ErrorName.VALIDATION_ERROR;

  constructor(...errors: ErrorItem[]) {
    super(StatusCode.UNPROCESSABLE_ENTITY, ...errors);

    this.payload = {
      heading: 'Validation error',
      errors,
    };
  }
}

export class BrokerApiError extends AppError {
  name = ErrorName.BROKER_API_ERROR;

  constructor(message: string, brokerName: BrokerName) {
    super(StatusCode.INTERNAL_SERVER_ERROR, { message });

    this.payload = {
      heading: `Broker API error (${brokerName})`,
      errors: [{ message }],
    };
  }
}

export class SignalError extends Error {
  name = ErrorName.SIGNAL_ERROR;

  // @TODO: add payload type
  constructor(message: string, payload: {}) {
    super(message);
  }
}

export class PositionError extends AppError {
  name = ErrorName.POSITION_ERROR;

  constructor(...errors: ErrorItem[]) {
    super(StatusCode.INTERNAL_SERVER_ERROR, ...errors);

    this.payload = {
      heading: 'Position error',
      errors,
    }
  }
}
