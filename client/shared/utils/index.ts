// @ts-ignore
import dateFormat from 'dateformat';
import getSymbolFromCurrency from 'currency-symbol-map'


// Currency
export function getCurrencySymbol(currency: string): string {
  return getSymbolFromCurrency(currency) || '@';
}


// Date
export function formDate(date: Date, format: string = 'yyyy-mm-dd'): string {
  return dateFormat(date, format);
}
