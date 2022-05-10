import crypto from 'crypto';
import querystring from 'querystring';

import type { BrokerName } from 'global/constants';
import { brokerConfigs } from 'global/config';

import { ErrorName, FRACTION_DIGITS_TO_HUNDREDTHS, ONE_HUNDRED } from 'shared/constants';


// Currency
export function getAmountWithCurrency(currency: string, amount: number): string {
  return `${roundNumber(amount, FRACTION_DIGITS_TO_HUNDREDTHS)} ${currency}`;
}


// Math
export function getFractionDigits(num: string | number): number {
  return num.toString().split(/[.,]/)[1]?.length || 0;
}

export function roundNumber(num: number, fractionDigits: number): number {
  return Number(num.toFixed(fractionDigits));
}

export function calculateProportion(from: number, percent: number): number {
  return from * percent / ONE_HUNDRED;
}


// Crypto
export function generateHmacSignature(secretKey: string, message: string): string {
  return crypto.createHmac('sha256', secretKey)
    .update(message)
    .digest("hex");
}

export function generateBotToken(userId: string, botId: string): string {
  const splitUserId: string[] = userId.split('');
  const splitBotId: string[] = botId.split('');

  return splitUserId
    .reduce((token, char, index) => {
      token.push(char, splitBotId[index]);

      return token;
    }, [] as string[])
    .join('');
}

/**
 *  Return => [ userId, botId ]
 * */
export function parseBotToken(token: string): [string, string] {
  return token
    .split('')
    .reduce((result, char, index) => {
      result[index === 0 || index % 2 === 0 ? 0 : 1] += char;

      return result;
    }, ['', '']);
}


// Query
export function stringifyPayload<Payload>(payload: Payload): string {
  // @ts-ignore
  return querystring.stringify(payload);
}


// Date
export function getTodayDateString(): string {
  return new Date(Date.now()).toISOString();
}


// Helpers
export async function sleep(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function getBrokerLabel(brokerName: BrokerName): string {
  return brokerConfigs[brokerName].label;
}

export function isCustomError(name: string): boolean {
  return [
    ErrorName.APP_ERROR as string,
    ErrorName.API_ERROR as string,
    ErrorName.VALIDATION_ERROR as string,
    ErrorName.SIGNAL_ERROR as string,
  ].includes(name);
}
