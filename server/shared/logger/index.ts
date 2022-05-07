import type { Logger as BaseLogger, LogPayload } from 'shared/types';
import type { LogScope } from 'shared/constants';
import { getTodayDateString } from 'shared/utils';


class Logger implements BaseLogger {

  logInfo<T>(scope: LogScope, info: string | LogPayload<T>): void {
    Logger.log('info', scope, info);
  }

  logError<T>(scope: LogScope, error: string | LogPayload<T>): void {
    Logger.log('error', scope, error);
  }


  private static log<T>(level: 'info' | 'error', scope: LogScope, data: string | LogPayload<T>): void {
    const timestamp: string = getTodayDateString();

    if (typeof data === 'string') {
      console.log(`${timestamp} [${scope}] ${level}: ${data}`);
    } else {
      const { message, messageHeading, idLabel, id, payload } = data;

      console.log(`${timestamp} [${scope}] ${level}: ${messageHeading} - ${message}`);

      if (idLabel) {
        console.log(` - ${idLabel}: ${id}`);
      }

      if (payload) {
        let payloadString = JSON.stringify(payload)

        if (payloadString.length > 250) {
          payloadString = payloadString.slice(0, 250) + '...';
        }

        console.log(` - payload: ${payloadString}`);
      }
    }

    console.log('\n');
  }
}


export const logger: BaseLogger = new Logger();
