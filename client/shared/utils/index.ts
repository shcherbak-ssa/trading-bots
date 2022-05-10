// @ts-ignore
import dateFormat from 'dateformat';
import getSymbolFromCurrency from 'currency-symbol-map'

import { convertDateStringToNumber, getMilliseconds } from 'global/utils';
import { BROKER_API_KEYS_EXPIRES_DEACTIVATE_DAYS, BROKER_API_KEYS_EXPIRES_START_NOTIFY_DAYS } from 'global/constants';


// Currency
export function getCurrencySymbol(currency: string): string {
  return getSymbolFromCurrency(currency) || '@';
}


// Date
export function formDate(date: Date, format: string = 'yyyy-mm-dd'): string {
  return dateFormat(date, format);
}

export function getMillisecondsBeforeExpires(expiresAt: string): number {
  const millisecondsBeforeExpires: number = convertDateStringToNumber(expiresAt) - Date.now();

  return millisecondsBeforeExpires < 0 ? 0 : millisecondsBeforeExpires;
}

export function isExpired(expiresAt: string): boolean {
  return getMillisecondsBeforeExpires(expiresAt) <= getMilliseconds(BROKER_API_KEYS_EXPIRES_DEACTIVATE_DAYS);
}

export function isExpireNear(expiresAt: string): boolean {
  return getMillisecondsBeforeExpires(expiresAt) <= getMilliseconds(BROKER_API_KEYS_EXPIRES_START_NOTIFY_DAYS);
}
