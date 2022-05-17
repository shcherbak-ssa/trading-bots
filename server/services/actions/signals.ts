import type { Signal, Notification } from 'shared/types';
import { ActionType, NotificationType, SignalDirection, SignalType, Validation } from 'shared/constants';
import { signalMarketValidators } from 'shared/config';
import { SignalError } from 'shared/exceptions';

import { runAction } from 'services/actions';
import { validate } from 'services/validation';

import type { BotSignal } from 'modules/bot/types';
import { Bot, BotManager } from 'modules/bot';


export const signalsActions = {
  async [ActionType.SIGNALS_PROCESS](userId: string, signal: Signal): Promise<void> {
    const { botToken, type, stopLossPrice, direction } = signal;

    try {
      validate(Validation.SIGNALS, signal);
    } catch (e: any) {
      throw new SignalError(`Invalid signal (${e.message}).`, null, signal);
    }

    if (!BotManager.hasBot(botToken)) {
      throw new SignalError(`Not found bot with token "${botToken}".`, null, signal);
    }

    const bot: Bot = BotManager.getBot(botToken);

    if (type === SignalType.PING) {
      signalMarketValidators[bot.settings.brokerName].validate(signal, bot);

      return await runAction<Notification, void>({
        type: ActionType.NOTIFICATIONS_NOTIFY_USER,
        userId,
        payload: {
          type: NotificationType.SIGNAL_PING,
          bot: bot.settings,
          signal,
        },
      });
    }

    const botSignal: BotSignal = { isLong: direction === SignalDirection.LONG, stopLossPrice };

    switch (type) {
      case SignalType.OPEN:
        return await bot.openPosition(botSignal, signal);
      case SignalType.UPDATE:
        return await bot.updateOpenPosition(botSignal, signal);
      case SignalType.CLOSE:
        return await bot.closeOpenPosition();
    }
  },
};
