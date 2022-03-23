import { ErrorName } from 'shared/constants';


export class BotError extends Error {
  name = ErrorName.BOT_ERROR;
}

export class BrokerError extends Error {
  name = ErrorName.BROKER_ERROR;
}

export class BrokerApiError extends Error {
  name = ErrorName.BROKER_API_ERROR;
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
