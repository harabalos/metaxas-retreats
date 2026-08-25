import { useState, useEffect } from "react";

/** Local calendar day as `YYYY-MM-DD` — the picker hands us local midnights, so
 *  formatting from local parts (not toISOString) keeps the day from shifting. */
const dayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/**
 * Unavailable nights for an accommodation, read live from /api/availability
 * (which reads the Airbnb iCal feeds server-side and is CDN-cached).
 *
 * `unavailable` means we could not reach the calendar at all — the UI should say
 * so rather than imply everything is free.
 */
export const useBlockedDates = (accommodationId: string) => {
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (!accommodationId) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let mounted = true;

    const fetchAvailability = async () => {
      setLoading(true);
      setUnavailable(false);
      try {
        const response = await fetch(
          `/api/availability?id=${encodeURIComponent(accommodationId)}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error(`Availability request failed: ${response.status}`);

        const data: { blockedDates?: string[] } = await response.json();
        if (mounted) setBlockedDates(new Set(data.blockedDates ?? []));
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        console.error("Could not load availability:", err);
        if (mounted) {
          setBlockedDates(new Set());
          setUnavailable(true);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAvailability();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [accommodationId]);

  const isDateBlocked = (date: Date) => blockedDates.has(dayKey(date));

  return { blockedDates, isDateBlocked, loading, unavailable };
};
