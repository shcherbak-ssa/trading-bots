import type { Signal } from 'shared/types';
import { ActionType, SignalDirection, SignalType } from 'shared/constants';

import type { BotSignal } from 'modules/bot/types';
import { Bot, BotManager } from 'modules/bot';


export const signalsActions = {
  async [ActionType.SIGNALS_PROCESS](
    userId: string,
    { botToken, type, stopLossPrice, direction }: Signal
  ): Promise<void> {
    try {
      const bot: Bot = BotManager.getBot(botToken);
      const signal: BotSignal = { isLong: direction === SignalDirection.LONG, stopLossPrice };

      switch (type) {
        case SignalType.OPEN:
          return await bot.openPosition(signal);
        case SignalType.UPDATE:
          return await bot.updateOpenPosition(signal);
        case SignalType.CLOSE:
          return await bot.closeOpenPosition();
      }
    } catch (e: any) {
      // @TODO: process error
      console.error(` - error: [signal] ${e.message}`);
    }
  },
};
