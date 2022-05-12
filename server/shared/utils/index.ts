import crypto from 'crypto';
import querystring from 'querystring';

import { FRACTION_DIGITS_TO_HUNDREDTHS, BrokerName } from 'global/constants';
import { brokerConfigs } from 'global/config';
import { roundNumber } from 'global/utils';

import { ErrorName, HASH_SALT_SEPARATOR } from 'shared/constants';


// Currency
export function getAmountWithCurrency(currency: string, amount: number): string {
  return `${roundNumber(amount, FRACTION_DIGITS_TO_HUNDREDTHS)} ${currency}`;
}


// Math
export function getFractionDigits(num: string | number): number {
  return num.toString().split(/[.,]/)[1]?.length || 0;
}


// Crypto
export function generateHmacSignature(secretKey: string, message: string): string {
  return crypto.createHmac('sha256', secretKey)
    .update(message)
    .digest("hex");
}

export function generateHash(value: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt: string = crypto.randomBytes(8).toString("hex");

    crypto.scrypt(value, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);

      resolve(salt + HASH_SALT_SEPARATOR + derivedKey.toString('hex'));
    });
  })
}

export async function verifyHash(value: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [ salt, key ]: string[] = hash.split(HASH_SALT_SEPARATOR);

    crypto.scrypt(value, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);

      resolve(key === derivedKey.toString('hex'))
    });
  })
}

export function generateRandomPassword(): string {
  return Math.random().toString(36).slice(-8);
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
