import type { ErrorItem, ErrorPayload } from 'global/types';
import { BrokerName, StatusCode } from 'global/constants';

import { ErrorName } from 'shared/constants';


export class ProcessError extends Error {
  name = ErrorName.PROCESS_ERROR;
  status: StatusCode;

  constructor(message: string, status: StatusCode = StatusCode.INTERNAL_SERVER_ERROR) {
    super(message);
    this.status = status;
  }
}


export class AppError extends Error {
  payload: ErrorPayload;
  status: StatusCode;

  constructor(status: StatusCode, ...errors: ErrorItem[]) {
    super();

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
