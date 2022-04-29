import crypto from 'crypto';
import querystring from 'querystring';

import type { Bot } from 'global/types';


// Math
export function getFractionDigits(num: string | number): number {
  return num.toString().split(/[.,]/)[1]?.length || 0;
}

export function roundNumber(num: number, fractionDigits: number): number {
  return Number(num.toFixed(fractionDigits));
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

export function getTotalActivateTime({ activeTotalTime, activateAt }: Bot): number {
  return activeTotalTime + ( Date.now() - Number(new Date(activateAt)) );
}
