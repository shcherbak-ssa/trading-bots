import { Bot } from 'global/types';

import { NotificationType } from 'shared/constants';

import { BotPosition } from 'modules/bot/types';


export type Notification =
  | PositionOpenNotification
  | PositionUpdateNotification
  | PositionCloseNotification
  | BotDeactivationNotification
  | ErrorNotification;

type PositionOpenNotification = {
  type: NotificationType.POSITION_OPEN;
  position: BotPosition;
  bot: Bot;
}

type PositionUpdateNotification = {
  type: NotificationType.POSITION_UPDATE,
  position: BotPosition;
  bot: Bot;
}

type PositionCloseNotification = {
  type: NotificationType.POSITION_CLOSE;
  position: BotPosition;
  bot: Bot;
}

type BotDeactivationNotification = {
  type: NotificationType.BOT_DEACTIVATION,
  bot: Bot;
  reason: string;
  message: string;
}

type ErrorNotification = {
  type: NotificationType.ERROR,
  forAdmin: boolean;
  error: any;
}
