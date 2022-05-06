import type { Logger as BaseLogger, LogPayload } from 'shared/types';
import { LogScope } from 'shared/constants';
import { getTodayDateString } from 'shared/utils';


class Logger implements BaseLogger {
  private readonly scope: LogScope;

  constructor(scope: LogScope) {
    this.scope = scope;
  }


  logInfo<T>(info: string | LogPayload<T>): void {
    this.log('info', info);
  }

  logError<T>(error: string | LogPayload<T>): void {
    this.log('error', error);
  }


  private log<T>(level: 'info' | 'error', info: string | LogPayload<T>): void {
    const timestamp: string = getTodayDateString();

    if (typeof info === 'string') {
      console.log(`${timestamp} [${this.scope}] ${level}: ${info}`);
    } else {
      const { message, idLabel, payload } = info;

      console.log(`${timestamp} [${this.scope}] info: ${message}`);

      if (idLabel) {
        const [ label, id ] = idLabel.split(' ');

        console.log(` - ${label}: ${id}`);
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


export const appLogger: BaseLogger = new Logger(LogScope.APP);
export const apiLogger: BaseLogger = new Logger(LogScope.API);
export const botLogger: BaseLogger = new Logger(LogScope.BOT);
export const jobLogger: BaseLogger = new Logger(LogScope.JOB);
