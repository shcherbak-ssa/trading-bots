import { StatusCode } from 'global/constants';

import { ErrorName, LogScope } from 'shared/constants';
import type { LogPayload } from 'shared/types';


export class AppError<Payload> extends Error {
  name = ErrorName.APP_ERROR;
  scope: LogScope = LogScope.APP;
  errorHeading: string = 'Application error';

  status: StatusCode;
  logPayload: LogPayload<Payload>

  constructor(logPayload: LogPayload<Payload>, status: StatusCode = StatusCode.INTERNAL_SERVER_ERROR) {
    super(logPayload.message);

    this.status = status;
    this.logPayload = logPayload;
  }
}

export class ValidationError<Payload> extends AppError<Payload> {
  name = ErrorName.VALIDATION_ERROR;
  errorHeading = 'Validation error';

  constructor(logPayload: LogPayload<Payload>) {
    super(logPayload, StatusCode.UNPROCESSABLE_ENTITY);
  }
}

export class ApiError<Payload> extends AppError<Payload> {
  name = ErrorName.API_ERROR;
  scope: LogScope = LogScope.API;

  constructor(logPayload: LogPayload<Payload>) {
    super(logPayload);

    this.errorHeading = `Api error (${logPayload.messageLabel})`;
  }
}

export class SignalError extends Error {
  name = ErrorName.SIGNAL_ERROR;
  scope: LogScope = LogScope.BOT;

  // @TODO: add payload type
  constructor(message: string, payload: {}) {
    super(message);
  }
}
