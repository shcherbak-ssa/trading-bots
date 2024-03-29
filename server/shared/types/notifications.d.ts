import { Bot } from 'global/types';

import type { Signal } from 'shared/types';
import { NotificationType } from 'shared/constants';

import { BotPosition } from 'modules/bot/types';


export type Notification =
  | AttentionNotification
  | InfoNotification
  | ErrorNotification
  | SignalPingNotification
  | PositionOpenNotification
  | PositionUpdateNotification
  | PositionCloseNotification
  | BotDeactivationNotification;


type AttentionNotification = {
  type: NotificationType.ATTENTION;
  message: string;
}

type InfoNotification = {
  type: NotificationType.INFO;
  forAdmin: boolean;
  message: string;
}

type ErrorNotification = {
  type: NotificationType.ERROR;
  forAdmin: boolean;
  error: any;
}

type SignalPingNotification = {
  type: NotificationType.SIGNAL_PING;
  bot: Bot;
  signal: Signal;
}

type PositionOpenNotification = {
  type: NotificationType.POSITION_OPEN;
  position: BotPosition;
  bot: Bot;
}

type PositionUpdateNotification = {
  type: NotificationType.POSITION_UPDATE;
  position: BotPosition;
  bot: Bot;
}

type PositionCloseNotification = {
  type: NotificationType.POSITION_CLOSE;
  position: BotPosition;
  bot: Bot;
}

type BotDeactivationNotification = {
  type: NotificationType.BOT_DEACTIVATION;
  bots: Bot[];
  reason: string;
  message: string;
}
