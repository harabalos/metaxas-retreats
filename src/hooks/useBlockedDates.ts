import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { parseISO, isSameDay } from "date-fns";

export const useBlockedDates = (accommodationId: string) => {
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Fetch from Supabase
        const { data, error } = await supabase
          .from("bookings")
          .select("start_date, end_date")
          .eq("accommodation_id", accommodationId);

        if (error) {
          console.error("Supabase Error:", error);
          // If the table doesn't exist yet, we just ignore it so the calendar still works
          return; 
        }

        if (data && mounted) {
          const dates: Date[] = [];
          data.forEach((booking) => {
            let current = parseISO(booking.start_date);
            const end = parseISO(booking.end_date);

            while (current <= end) {
              dates.push(new Date(current));
              current.setDate(current.getDate() + 1);
            }
          });
          setBlockedDates(dates);
        }
      } catch (err) {
        console.error("Unexpected error fetching dates:", err);
      } finally {
        // CRITICAL: Always turn off loading, even if it failed
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