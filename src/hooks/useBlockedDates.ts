import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { parseISO, isSameDay } from "date-fns";

interface Booking {
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
        // Fetch from booking_availability view (restricted to only date columns - no PII)
        const { data, error } = await supabase
          .from("booking_availability")
          .select("start_date, end_date")
          .eq("accommodation_id", accommodationId);

        if (error) {
          console.error("Supabase Error:", error);
          return; 
        }

        if (data && mounted) {
          const dates: Date[] = [];
          (data as Booking[]).forEach((booking) => {
            let current = parseISO(booking.start_date);
            const end = parseISO(booking.end_date);

            // Block all dates from start up to (but not including) end
            // End date is checkout day, so it should remain bookable
            while (current < end) {
              dates.push(new Date(current));
              current.setDate(current.getDate() + 1);
            }
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
