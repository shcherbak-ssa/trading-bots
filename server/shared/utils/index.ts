import crypto from 'crypto';
import querystring from 'querystring';

import { ErrorName, ONE_HUNDRED } from 'shared/constants';

const ms = require('ms');


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


// Query
export function stringifyPayload<Payload>(payload: Payload): string {
  // @ts-ignore
  return querystring.stringify(payload);
}


// Date
export function getTodayDateString(): string {
  return new Date(Date.now()).toISOString();
}

export function getMilliseconds(date: string): number {
  return ms(date);
}

export function convertDateStringToNumber(date: string): number {
  return Number(new Date(date));
}


// Helpers
export async function sleep(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function isCustomError(name: string): boolean {
  return [
    ErrorName.APP_ERROR as string,
    ErrorName.API_ERROR as string,
    ErrorName.VALIDATION_ERROR as string,
    ErrorName.SIGNAL_ERROR as string,
  ].includes(name);
}
