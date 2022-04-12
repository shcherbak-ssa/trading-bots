import type { ErrorPayload, ErrorItem } from 'global/types';
import { StatusCode } from 'global/constants';

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
