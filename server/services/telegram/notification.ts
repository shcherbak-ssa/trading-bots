import type { Notification, TelegramMessage } from 'shared/types';
import { ErrorName, NotificationType } from 'shared/constants';
import { getAmountWithCurrency, isCustomError } from 'shared/utils';


export function getNotificationMessage(notification: Notification): TelegramMessage {
  const telegramMessage: TelegramMessage = { type: 'message', message: '' };

  switch (notification.type) {
    case NotificationType.POSITION_OPEN: {
      const { bot, position } = notification;
      const { brokerAccountCurrency: currency } = bot;

      telegramMessage.message = (
        '<b># Position open #</b>\n\n' +

        `Position opened successfully.\n\n` +

        `<b>Bot</b>\n` +
        `Name:  <code>${bot.name}</code>\n` +
        `Market:  <code>${bot.brokerMarketName}</code>\n\n` +

        `<b>Position</b>\n` +
        `Direction:  <code>${position.isLong ? 'LONG' : 'SHORT'}</code>\n` +
        `Quantity:  <code>${position.quantity}</code>\n` +
        `Risk:  <code>${getAmountWithCurrency(currency, position.riskSize)}</code>\n` +
        `Stop Loss:  <code>${position.stopLossPrice}</code>\n` +
        (position.takeProfitPrice ? `Take Profit:  <code>${position.takeProfitPrice}</code>` : '')
      );

      break;
    }
    case NotificationType.POSITION_UPDATE: {
      const { bot, position } = notification;
      const { brokerAccountCurrency: currency } = bot;

      telegramMessage.message = (
        '<b># Position update #</b>\n\n' +

        `Position <i>Stop Loss</i> updated successfully.\n\n` +

        `<b>Bot</b>\n` +
        `Name:  <code>${bot.name}</code>\n` +
        `Market:  <code>${bot.brokerMarketName}</code>\n\n` +

        `<b>Position</b>\n` +
        `Direction:  <code>${position.isLong ? 'LONG' : 'SHORT'}</code>\n` +
        `Quantity:  <code>${position.quantity}</code>\n` +
        `Stop Loss:  <code>${position.stopLossPrice}</code>`
      );

      break;
    }
    case NotificationType.POSITION_CLOSE: {
      const { bot, position } = notification;

      const totalCommission: number = position.feeClose + position.feeOpen;
      const { brokerAccountCurrency: currency } = bot;

      telegramMessage.message = (
        '<b># Position close #</b>\n\n' +

        `Position closed successfully.\n\n` +

        `<b>Bot</b>\n` +
        `Name:  <code>${bot.name}</code>\n` +
        `Market:  <code>${bot.brokerMarketName}</code>\n\n` +

        `<b>Position</b>\n` +
        `Direction:  <code>${position.isLong ? 'LONG' : 'SHORT'}</code>\n` +
        `Quantity:  <code>${position.quantity}</code>\n` +
        (totalCommission ? `Commission:  <code>${getAmountWithCurrency(currency, totalCommission)}</code>\n` : '') +
        `Result:  <code>${getAmountWithCurrency(currency, position.result)}</code>${totalCommission ? '  (without commission)' : ''}`
      );

      break;
    }
    case NotificationType.BOT_DEACTIVATION: {
      const { bot, reason, message } = notification;

      telegramMessage.message = (
        '<b># Bot deactivation #</b>\n\n' +

        `Bot  <code>${bot.name}</code>  deactivated. Reason: <i>${reason}</i>` +
        (message ? `\n${message}` : '') +

        `\n\nContact admin for more details.`
      );

      break;
    }
    case NotificationType.ERROR: {
      const { error, forAdmin } = notification;
      const isCustom: boolean = isCustomError(error.name);

      let additionalInformation: string = '';
      let userDescription: string = '';

      if (isCustom) {
        switch (error.name) {
          case ErrorName.SIGNAL_ERROR: {
            const { bot, signal } = error.logPayload.payload;

            additionalInformation += `\n\n<b>Bot</b>\n`;
            additionalInformation += `Name:  <code>${bot.name}</code>\n`;
            additionalInformation += `Market:  <code>${bot.brokerMarketName}</code>\n\n`;

            additionalInformation += `<b>Signal</b>\n`;
            additionalInformation += `Type:  <code>${signal.type}</code>\n`
            additionalInformation += `Direction:  <code>${signal.direction}</code>\n`;
            additionalInformation += `Stop-loss:  <code>${signal.stopLossPrice}</code>`;

            break;
          }
        }

        userDescription += `${error.logPayload.messageHeading}:\n<pre>${error.logPayload.message}</pre>`;
      }

      telegramMessage.message = (
        `<b># Error${forAdmin ? ' [admin]' : ''} #</b>\n\n` +

        (
          forAdmin
            ? (
              `${isCustom ? error.logPayload.messageHeading : error.name}:\n` +
              `<pre>${isCustom ? error.logPayload.message : error.message}</pre>`
            )
            : (userDescription || 'Internal Server Error.')
        ) +

        additionalInformation +

        (forAdmin ? '' : `\n\nContact admin for more details.`) +

        (
          forAdmin || error.name === ErrorName.SIGNAL_ERROR
            ? ''
            : `\n\n<i>Note: The admin will also be notified.</i>`
        )
      );

      break;
    }
  }

  return telegramMessage;
}
