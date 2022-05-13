import { getTodayDateString } from 'global/utils';

import type { Logger as BaseLogger, LogPayload } from 'shared/types';
import type { LogScope } from 'shared/constants';


class Logger implements BaseLogger {

  logInfo<T>(scope: LogScope, info: string | LogPayload<T>): void {
    Logger.log('\x1b[1m\x1b[34minfo:\x1b[0m', scope, info);
  }

  logWarning<T>(scope: LogScope, warning: string | LogPayload<T>): void {
    Logger.log('\x1b[1m\x1b[33mwarning:\x1b[0m', scope, warning);
  }

  logError<T>(scope: LogScope, error: string | LogPayload<T>): void {
    Logger.log('\x1b[1m\x1b[31merror:\x1b[0m', scope, error);
  }


  private static log<T>(level: string, scope: LogScope, data: string | LogPayload<T>): void {
    const timestamp: string = getTodayDateString();

    if (typeof data === 'string') {
      console.log(`${timestamp} \x1b[33m[${scope}]\x1b[0m ${level} ${data}`);
    } else {
      const { message, messageHeading, idLabel, id, payload, savePayload } = data;

      console.log(`${timestamp} \x1b[33m[${scope}]\x1b[0m ${level} ${messageHeading} - ${message}`);

      if (idLabel) {
        console.log(` - ${idLabel}: ${id || 'undefined'}`);
      }

      if (payload) {
        let payloadString = JSON.stringify(payload);

        if (!savePayload && payloadString.length > 500) {
          payloadString = payloadString.slice(0, 500) + '...';
        }

        console.log(` - payload: ${payloadString}`);
      }
    }

    console.log('\n');
  }
}


export const logger: BaseLogger = new Logger();
