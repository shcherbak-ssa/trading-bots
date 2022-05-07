import type { Bot } from 'global/types';
import { StatusCode } from 'global/constants';

import type { LogPayload, Signal, SignalLogPayload } from 'shared/types';
import { ErrorName, LogScope } from 'shared/constants';


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
  scope = LogScope.API;

  constructor(logPayload: LogPayload<Payload>) {
    super(logPayload);

    this.errorHeading = `Api error (${logPayload.messageHeading})`;
  }
}

export class SignalError extends AppError<SignalLogPayload> {
  name = ErrorName.SIGNAL_ERROR;
  scope = LogScope.BOT;

  constructor(message: string, bot: Bot, signal: Signal) {
    super({
      message,
      messageHeading: 'Bot Signal',
      idLabel: 'token',
      id: bot.token,
      payload: { bot, signal },
    },
      StatusCode.BAD_REQUEST
    );
  }
}
