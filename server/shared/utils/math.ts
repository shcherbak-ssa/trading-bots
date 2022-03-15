const FRACTION_DIGITS_ROUND: number = 2;

export function roundToHundredths(num: number): number {
  return Number(num.toFixed(FRACTION_DIGITS_ROUND));
}
