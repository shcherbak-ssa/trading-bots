import { ErrorName } from 'shared/constants';
import { StatusCode } from 'global/constants';


export class ProcessError extends Error {
  name = ErrorName.PROCESS_ERROR;
  status: StatusCode;

  constructor(message: string, status: StatusCode = StatusCode.INTERNAL_SERVER_ERROR) {
    super(message);
    this.status = status;
  }
}
