import type { TelegramIncomeMessage } from 'shared/types';
import { ActionType } from 'shared/constants';
import { AppError } from 'shared/exceptions';


export const telegramActions = {
  async [ActionType.TELEGRAM_PROCESS_INCOME_MESSAGE](userId: string, payload: TelegramIncomeMessage): Promise<void> {
    if (payload.token !== process.env.TELEGRAM_BOT_TOKEN) {
      throw new AppError({
        message: `Received invalid Telegram token (${payload.token})`,
        messageLabel: 'Telegram webhook',
        payload,
      });
    }

    console.log(payload);
  },
};
