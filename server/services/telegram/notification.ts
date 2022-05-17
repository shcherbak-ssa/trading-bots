import type { Notification } from 'shared/types';
import { ErrorName, NotificationType } from 'shared/constants';
import { getAmountWithCurrency, isCustomError } from 'shared/utils';


const contactAdminMessage: string = `\n\nContact admin for more details.`;


export function getNotificationMessage(notification: Notification): string {
  let telegramMessage: string = '';

  switch (notification.type) {
    case NotificationType.ATTENTION: {
      const { message } = notification;

      telegramMessage += '<b># Attention #</b>\n\n';
      telegramMessage += message;
      telegramMessage += contactAdminMessage;

      break;
    }
    case NotificationType.INFO: {
      const { message, forAdmin } = notification;

      telegramMessage += `<b># Info${forAdmin ? ' [admin]' : ''} #</b>\n\n`;
      telegramMessage += message;

      if (!forAdmin) {
        telegramMessage += contactAdminMessage;
      }

      break;
    }
    case NotificationType.SIGNAL_PING: {
      const { bot, signal } = notification;

      telegramMessage += '<b># Signal Ping #</b>\n\n';
      telegramMessage += `Ping success.\n\n`;

      telegramMessage += `<b>Bot</b>\n`;
      telegramMessage += `Name:  <code>${bot.name}</code>\n`;
      telegramMessage += `Market:  <code>${bot.brokerMarketName}</code>\n\n`;

      telegramMessage += `<b>Signal</b>\n`;
      telegramMessage += `Bot Token:  <code>${signal.botToken}</code>\n`;
      telegramMessage += `Market:  <code>${signal.market}</code>`;

      break;
    }
    case NotificationType.POSITION_OPEN: {
      const { bot, position } = notification;
      const { brokerAccountCurrency: currency } = bot;

      telegramMessage += '<b># Position open #</b>\n\n';
      telegramMessage += `Position opened successfully.\n\n`;

      telegramMessage += `<b>Bot</b>\n`;
      telegramMessage += `Name:  <code>${bot.name}</code>\n`;
      telegramMessage += `Market:  <code>${bot.brokerMarketName}</code>\n\n`;

      telegramMessage += `<b>Position</b>\n`;
      telegramMessage += `Direction:  <code>${position.isLong ? 'LONG' : 'SHORT'}</code>\n`;
      telegramMessage += `Quantity:  <code>${position.quantity}</code>\n`;
      telegramMessage += `Risk:  <code>${getAmountWithCurrency(currency, position.riskSize)}</code>\n`;
      telegramMessage += `Stop Loss:  <code>${position.stopLossPrice}</code>\n`;

      if (position.takeProfitPrice) {
        telegramMessage += `Take Profit:  <code>${position.takeProfitPrice}</code>`;
      }

      break;
    }
    case NotificationType.POSITION_UPDATE: {
      const { bot, position } = notification;
      const { brokerAccountCurrency: currency } = bot;

      telegramMessage += '<b># Position update #</b>\n\n';
      telegramMessage += `Position <i>Stop Loss</i> updated successfully.\n\n`;

      telegramMessage += `<b>Bot</b>\n`;
      telegramMessage += `Name:  <code>${bot.name}</code>\n`;
      telegramMessage += `Market:  <code>${bot.brokerMarketName}</code>\n\n`;

      telegramMessage += `<b>Position</b>\n`;
      telegramMessage += `Direction:  <code>${position.isLong ? 'LONG' : 'SHORT'}</code>\n`;
      telegramMessage += `Quantity:  <code>${position.quantity}</code>\n`;
      telegramMessage += `Stop Loss:  <code>${position.stopLossPrice}</code>`;

      break;
    }
    case NotificationType.POSITION_CLOSE: {
      const { bot, position } = notification;

      const totalFee: number = position.feeClose + position.feeOpen;
      const { brokerAccountCurrency: currency } = bot;

      telegramMessage += '<b># Position close #</b>\n\n';
      telegramMessage += `Position closed with <i>${(position.result + totalFee) < 0 ? 'Loss' : 'Profit'}</i>.\n\n`;

      telegramMessage += `<b>Bot</b>\n`;
      telegramMessage += `Name:  <code>${bot.name}</code>\n`;
      telegramMessage += `Market:  <code>${bot.brokerMarketName}</code>\n\n`;

      telegramMessage += `<b>Position</b>\n`;
      telegramMessage += `Direction:  <code>${position.isLong ? 'LONG' : 'SHORT'}</code>\n`;
      telegramMessage += `Quantity:  <code>${position.quantity}</code>\n`;

      if (totalFee) {
        telegramMessage += `Fee:  <code>${getAmountWithCurrency(currency, totalFee)}</code>\n`;
      }

      telegramMessage += `Result:  <code>${getAmountWithCurrency(currency, position.result)}</code>${totalFee ? '  (without commission)' : ''}`;

      break;
    }
    case NotificationType.BOT_DEACTIVATION: {
      const { bots, reason, message } = notification;

      const deactivatedMessage: string = bots.length === 1
        ? `Bot  <code>${bots[0].name}</code>  deactivated`
        : `Bots  <code>${bots.map(({ name }) => name).join(', ')}</code>  deactivated`;

      telegramMessage += '<b># Bot deactivation #</b>\n\n';
      telegramMessage += `${deactivatedMessage}. Reason: <i>${reason}</i>.`;
      telegramMessage += message ? `\n${message}` : '';

      telegramMessage += contactAdminMessage;

      break;
    }
    case NotificationType.ERROR: {
      const { error, forAdmin } = notification;
      const isCustom: boolean = isCustomError(error.name);

      let additionalInformation: string = '';
      let userDescription: string = '';

      if (isCustom) {
        if (error.name === ErrorName.SIGNAL_ERROR) {
          const { bot, signal } = error.logPayload.payload;

          if (bot) {
            additionalInformation += `\n\n<b>Bot</b>\n`;
            additionalInformation += `Name:  <code>${bot.name}</code>\n`;
            additionalInformation += `Market:  <code>${bot.brokerMarketName}</code>`;
          }

          additionalInformation += `\n\n<b>Signal</b>\n`;
          additionalInformation += `Type:  <code>${signal.type}</code>\n`
          additionalInformation += `Direction:  <code>${signal.direction}</code>\n`;
          additionalInformation += `Stop Loss:  <code>${signal.stopLossPrice}</code>\n`;
          additionalInformation += `Market:  <code>${signal.market}</code>`;
        }

        userDescription += `${error.logPayload.messageHeading}:\n<pre>${error.logPayload.message}</pre>`;
      }

      telegramMessage += `<b># Error${forAdmin ? ' [admin]' : ''} #</b>\n\n`;

      if (forAdmin) {
        telegramMessage += `${isCustom ? error.logPayload.messageHeading : error.name}:\n`;
        telegramMessage += `<pre>${isCustom ? error.logPayload.message : error.message}</pre>`;
      } else {
        telegramMessage += userDescription || 'Internal Server Error.';
      }

      telegramMessage += additionalInformation;

      if (!forAdmin) {
        telegramMessage += contactAdminMessage;
      }

      if (!forAdmin || error.name !== ErrorName.SIGNAL_ERROR) {
        telegramMessage += `\n\n<i>Note: The admin will also be notified.</i>`;
      }

      break;
    }
  }

  return telegramMessage;
}
