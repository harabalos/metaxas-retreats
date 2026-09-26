import { format, isValid, parse } from 'date-fns';

/**
 * Stay dates in the booking URL, as plain calendar days (?start=2026-10-05).
 *
 * They used to be toISOString() timestamps, which are UTC: 5 October picked in
 * Greece became "2026-10-04T21:00:00.000Z", so a shared link or anything
 * reading the URL as text saw the wrong day.
 */
export const toDateParam = (date: Date) => format(date, 'yyyy-MM-dd');

/** Reads a date from the URL; older links with full timestamps still work. */
export function fromDateParam(param: string | null): Date | undefined {
  if (!param) return undefined;
  const day = parse(param, 'yyyy-MM-dd', new Date());
  if (isValid(day) && /^\d{4}-\d{2}-\d{2}$/.test(param)) return day;
  const legacy = new Date(param);
  return isValid(legacy) ? legacy : undefined;
}
