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


  private static log<T>(level: 'info' | 'error', scope: LogScope, info: string | LogPayload<T>): void {
    const timestamp: string = getTodayDateString();

    if (typeof info === 'string') {
      console.log(`${timestamp} [${scope}] ${level}: ${info}`);
    } else {
      const { message, messageLabel, idLabel, id, payload } = info;

      console.log(`${timestamp} [${scope}] ${level}: ${messageLabel} - ${message}`);

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
