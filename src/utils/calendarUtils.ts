// ⚠️  DEPRECATED — this file is no longer imported anywhere.
// Blocked dates are now stored in the Supabase `bookings` table
// and read via src/hooks/useBlockedDates.ts.
// The 2025 dates below are stale and kept only for historical reference.

import { parseISO, isSameDay, isWithinInterval } from 'date-fns';

export interface BlockedDateRange {
  start: string;
  end: string;
}

// Manual blocked dates for each accommodation
const blockedDates: Record<string, BlockedDateRange[]> = {
  "wooden-house": [
    // May 2025
    { start: "2025-05-10", end: "2025-05-12" },
    { start: "2025-05-17", end: "2025-05-18" },
    { start: "2025-05-26", end: "2025-05-30" },

    // June 2025
    { start: "2025-06-05", end: "2025-06-21" },
    { start: "2025-06-27", end: "2025-07-02" },

    // July 2025
    { start: "2025-07-14", end: "2025-07-23" },
    { start: "2025-07-25", end: "2025-07-27" },
    { start: "2025-07-30", end: "2025-08-05" },

    // August 2025
    { start: "2025-08-06", end: "2025-08-08" },
    { start: "2025-08-12", end: "2025-08-17" },
    { start: "2025-08-18", end: "2025-08-23" },
    { start: "2025-08-24", end: "2025-08-28" },

    // September 2025
    { start: "2025-08-30", end: "2025-09-05" },
    { start: "2025-09-06", end: "2025-09-12" }
  ],

  "glamping-tent-1": [
    { start: "2025-05-23", end: "2025-05-29" },
    { start: "2025-06-08", end: "2025-06-08" },
    { start: "2025-06-26", end: "2025-07-02" },
    { start: "2025-07-17", end: "2025-07-19" },
    { start: "2025-07-28", end: "2025-08-01" },
    { start: "2025-08-02", end: "2025-08-08" },
    { start: "2025-08-09", end: "2025-08-09" },
    { start: "2025-08-12", end: "2025-08-19" },
    { start: "2025-08-25", end: "2025-08-27" }
  ],

  "glamping-tent-2": [
    { start: "2025-06-26", end: "2025-07-02" },
    { start: "2025-07-17", end: "2025-07-19" },
    { start: "2025-08-04", end: "2025-08-10" },
    { start: "2025-08-17", end: "2025-08-18" }
  ]
};

// Check if date is blocked for a specific accommodation
export function isDateBooked(date: Date, accommodationId: string): boolean {
  const accommodationBlockedDates = blockedDates[accommodationId] || [];

  return accommodationBlockedDates.some(dateRange => {
    const startDate = parseISO(dateRange.start);
    const endDate = parseISO(dateRange.end);

    return isWithinInterval(date, { start: startDate, end: endDate }) ||
           isSameDay(date, startDate) || 
           isSameDay(date, endDate);
  });
}

// Get all blocked dates for an accommodation
export function getBlockedDates(accommodationId: string): BlockedDateRange[] {
  return blockedDates[accommodationId] || [];
}

// Add a new blocked date range (for future manual management)
export function addBlockedDate(accommodationId: string, dateRange: BlockedDateRange): void {
  if (!blockedDates[accommodationId]) {
    blockedDates[accommodationId] = [];
  }
  blockedDates[accommodationId].push(dateRange);
}

// Remove a blocked date range (for future manual management)
export function removeBlockedDate(accommodationId: string, index: number): void {
  if (blockedDates[accommodationId]) {
    blockedDates[accommodationId].splice(index, 1);
  }
}
