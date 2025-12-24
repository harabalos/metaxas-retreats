import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client"; // Ensure you have this client set up
import { parseISO, isWithinInterval, isSameDay } from "date-fns";

export const useBlockedDates = (accommodationId: string) => {
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      // Fetch from Supabase
      const { data, error } = await supabase
        .from("bookings")
        .select("start_date, end_date")
        .eq("accommodation_id", accommodationId);

      if (error) {
        console.error("Error fetching dates:", error);
        return;
      }

      // Convert ranges to individual dates for the calendar
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
      setLoading(false);
    };

    if (accommodationId) {
      fetchBookings();
    }
  }, [accommodationId]);

  // Helper to check if a specific date is blocked
  const isDateBlocked = (date: Date) => {
    return blockedDates.some((blockedDate) => isSameDay(date, blockedDate));
  };

  return { blockedDates, isDateBlocked, loading };
};