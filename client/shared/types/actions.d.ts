import { ActionType } from 'shared/constants';


export type ActionFunction<Payload> = (payload: Payload) => Promise<void>;

export type ActionsObject = { [p in ActionType]: ActionFunction; }

export type Action<Payload> = {
  type: ActionType;
  payload: Payload;
  callback?: () => void;
}
