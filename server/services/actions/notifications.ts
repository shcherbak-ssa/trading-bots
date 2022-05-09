import type { User } from 'global/types';
import { GetUserType } from 'global/constants';

import type { GetUserFilters, Notification, TelegramMessage } from 'shared/types';
import { ActionType, ErrorName, NotificationType } from 'shared/constants';
import { AppError } from 'shared/exceptions';

import { runAction } from 'services/actions';
import { telegramService } from 'services/telegram';


export const notificationsActions = {
  async [ActionType.NOTIFICATIONS_NOTIFY_USER](userId: string, notification: Notification): Promise<void> {
    const [ currentUser ] = await runAction<GetUserFilters, User[]>({
      type: ActionType.USERS_GET,
      userId: '',
      payload: { type: GetUserType.ONE, id: userId },
    });

    if (currentUser) {
      // @TODO: check notification settings

      const telegramMessage: TelegramMessage = telegramService.getNotificationMessage(notification);

      await telegramService.sendMessage(currentUser.telegramChatId, telegramMessage);
    } else {
      await runAction<Notification, void>({
        type: ActionType.NOTIFICATIONS_NOTIFY_ADMIN,
        userId: '',
        payload: {
          type: NotificationType.ERROR,
          forAdmin: true,
          error: new AppError({
            message: `User (${userId}) not found.`,
            messageHeading: 'Notification (notify user)'
          }),
        },
      });
    }
  },

  async [ActionType.NOTIFICATIONS_NOTIFY_ADMIN](userId: string, notification: Notification): Promise<void> {
    if (notification.type === NotificationType.ERROR) {
      if (notification.error.name === ErrorName.SIGNAL_ERROR) {
        return;
      }
    }

    const telegramMessage: TelegramMessage = telegramService.getNotificationMessage(notification);

    await telegramService.sendMessage(Number(process.env.ADMIN_TELEGRAM_CHAT_ID), telegramMessage);
  },
};
