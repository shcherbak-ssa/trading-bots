import ms from 'ms';

import { ONE_HUNDRED } from 'global/constants';


// Math
export function calculateProportion(from: number, percent: number): number {
  return from * percent / ONE_HUNDRED;
}

export function roundNumber(num: number, fractionDigits: number): number {
  return Number(num.toFixed(fractionDigits));
}


// Date
export function getTodayDateString(): string {
  return new Date(Date.now()).toISOString();
}

export function convertDateStringToNumber(date: string): number {
  return Number(new Date(date));
}

export function getMilliseconds(date: string): number {
  return ms(date);
}

export function getReadableDateString(milliseconds: number): string {
  return ms(milliseconds, { long: true });
}
