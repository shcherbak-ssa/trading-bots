import type { Signal } from 'shared/types';
import { ActionType, SignalDirection, SignalType } from 'shared/constants';

import type { BotSignal } from 'modules/bot/types';
import { Bot, BotManager } from 'modules/bot';


export const signalsActions = {
  async [ActionType.SIGNALS_PROCESS](userId: string, signal: Signal): Promise<void> {
    const { botToken, type, stopLossPrice, direction } = signal;

    const bot: Bot = BotManager.getBot(botToken);
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
