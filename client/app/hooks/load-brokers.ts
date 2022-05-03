import type { LoadBrokersPayload } from 'global/types';

import { ActionType } from 'shared/constants';

import { runAction } from 'services/actions';


export function useLoadBrokers(withBots: boolean) {
  return async () => {
    await runAction<LoadBrokersPayload>({
      type: ActionType.BROKERS_LOAD,
      payload: { withBots },
    });
  };
}
