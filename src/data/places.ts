/**
 * How far things are from Metaxas Retreats (38.640048, 20.698988).
 *
 * Driving times come from Google Maps with its usual traffic, September 2026,
 * rounded to 5 minutes. The beach distance is the owner's: 50 m on foot. Names
 * are in the locale files under place.<id>.
 */

export type Place = {
  id: string;
  /** Road distance in km (walking distance for `walk`). */
  km: number;
  minutes: number;
  walk?: boolean;
};

export const PLACES = {
  beach: { id: 'beach', km: 0.05, minutes: 1, walk: true },
  poros: { id: 'poros', km: 3, minutes: 5 },
  nidri: { id: 'nidri', km: 14, minutes: 25 },
  sivota: { id: 'sivota', km: 14, minutes: 25 },
  vasiliki: { id: 'vasiliki', km: 18, minutes: 25 },
  ammousa: { id: 'ammousa', km: 18, minutes: 30 },
  agiofili: { id: 'agiofili', km: 21, minutes: 35 },
  lefkadaTown: { id: 'lefkadaTown', km: 30, minutes: 45 },
  portoKatsiki: { id: 'portoKatsiki', km: 33, minutes: 55 },
  egremni: { id: 'egremni', km: 34, minutes: 55 },
  agiosNikitas: { id: 'agiosNikitas', km: 41, minutes: 60 },
  kathisma: { id: 'kathisma', km: 44, minutes: 65 },
  airport: { id: 'airport', km: 53, minutes: 70 },
} satisfies Record<string, Place>;

export type PlaceId = keyof typeof PLACES;

/** The short list shown on the accommodation pages and in llms.txt. */
export const NEARBY: PlaceId[] = ['beach', 'poros', 'nidri', 'sivota', 'vasiliki', 'lefkadaTown', 'portoKatsiki', 'airport'];

type T = (key: string, options?: Record<string, unknown>) => string;

/** "25 min" / "1 h 10 min", in the current language. */
export function formatMinutes(minutes: number, t: T): string {
  if (minutes < 60) return t('distance.minutes', { count: minutes });
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest
    ? t('distance.hoursMinutes', { hours, minutes: rest })
    : t('distance.hours', { count: hours });
}

/** "50 m on foot" / "25 min by car". */
export function formatTrip(place: Place, t: T): string {
  return place.walk
    ? t('distance.onFoot', { meters: Math.round(place.km * 1000) })
    : t('distance.byCar', { time: formatMinutes(place.minutes, t) });
}
