import { ActionType } from 'shared/constants';


export type ActionFunction<Payload, Result> = (userId: string, payload: Payload) => Promise<Result>;

export type ActionList = { [p in ActionType]: ActionFunction; }

export type Action<Payload> = {
  type: ActionType;
  userId: string;
  payload: Payload;
}
