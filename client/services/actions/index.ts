import type { Action, ActionFunction, ActionsObject } from 'shared/types';

import { Notifications } from 'services/notifications';

import { botsActions } from './bots';
import { brokersActions } from './brokers';


const actions: ActionsObject = {
  ...botsActions,
  ...brokersActions,
};


export async function runAction<Payload>({ type, payload, callback, errorCallback }: Action<Payload>): Promise<void> {
  try {
    const action: ActionFunction<Payload> = actions[type];

    if (!action) {
      throw new Error(`Action [${type}] not found`);
    }

    await action(payload);

    if (callback) {
      callback();
    }
  } catch (e: any) {
    if ('heading' in e) {
      Notifications.showErrorNotification(e.heading, e.message);
    } else {
      console.error(e);

      Notifications.showErrorNotification('Application error', e.message);
    }

    if (errorCallback) {
      errorCallback();
    }
  }
}
