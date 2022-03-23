import type { ErrorProps } from 'shared/types';
import { ErrorName } from 'shared/constants';


export class BotError extends Error {
  props: ErrorProps

  constructor(message: string, props: ErrorProps) {
    super(message);
    this.name = ErrorName.BOT_ERROR;
    this.props = props;
  }
}
