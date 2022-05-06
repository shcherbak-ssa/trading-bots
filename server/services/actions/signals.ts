import type { Signal } from 'shared/types';
import { ActionType, ErrorName, SignalDirection, SignalType } from 'shared/constants';
import { botLogger } from 'shared/logger';

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
      if (e.name === ErrorName.SIGNAL_ERROR) {
        botLogger.logError({
          message: `signal - ${e.message}`,
          idLabel: `botToken ${botToken}`,
          payload: { type, stopLossPrice, direction },
        });

        // @TODO: notify user
      } else {
        // @TODO: notify user

        throw e;
      }
    }
  },
};
