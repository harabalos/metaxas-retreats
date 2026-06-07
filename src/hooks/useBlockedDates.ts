import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { parseISO, isSameDay, addDays, format } from "date-fns";

interface AvailabilityRow {
  accommodation_id: string;
  start_date: string;
  end_date: string;
}

export const useBlockedDates = (accommodationId: string) => {
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchBookings = async () => {
      try {
        setLoading(true);

        // The "glamping-tent" listing is two identical physical tents.
        // A date is only unavailable when BOTH tents are booked, so we fetch
        // both calendars and block the intersection (free if either is free).
        const ids =
          accommodationId === "glamping-tent"
            ? ["glamping-tent-1", "glamping-tent-2"]
            : [accommodationId];

        const { data, error } = await supabase
          .from("booking_availability")
          .select("accommodation_id, start_date, end_date")
          .in("accommodation_id", ids);

        if (error) {
          console.error("Supabase Error:", error);
          return;
        }

        if (data && mounted) {
          // For each calendar day, track which tents are booked on it.
          const bookedBy = new Map<string, Set<string>>();

          (data as AvailabilityRow[]).forEach((booking) => {
            let current = parseISO(booking.start_date);
            const end = parseISO(booking.end_date);
            // End date is checkout day → remains bookable
            while (current < end) {
              const key = format(current, "yyyy-MM-dd");
              if (!bookedBy.has(key)) bookedBy.set(key, new Set());
              bookedBy.get(key)!.add(booking.accommodation_id);
              current = addDays(current, 1);
            }
          });

          // A date is blocked only when every required unit is booked.
          // single unit  → blocked when that one is booked (size >= 1)
          // merged tents → blocked only when BOTH are booked (size >= 2)
          const dates: Date[] = [];
          bookedBy.forEach((units, key) => {
            if (units.size >= ids.length) dates.push(parseISO(key));
          });

          setBlockedDates(dates);
        }
      } catch (err) {
        console.error("Unexpected error fetching dates:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (accommodationId) {
      fetchBookings();
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [accommodationId]);

  const isDateBlocked = (date: Date) => {
    return blockedDates.some((blockedDate) => isSameDay(date, blockedDate));
  };

  return { blockedDates, isDateBlocked, loading };
};
