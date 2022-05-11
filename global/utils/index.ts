import ms from 'ms';


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
