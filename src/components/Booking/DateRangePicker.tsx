import * as React from "react";
import { format, addDays, isWithinInterval, isBefore, startOfToday } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBlockedDates } from "@/hooks/useBlockedDates";

interface DateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDateChange: (start: Date | undefined, end: Date | undefined) => void;
  disabled?: boolean;
  accommodationId: string;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateChange,
  disabled = false,
  accommodationId,
  className,
}: DateRangePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  
  // Fetch real blocked dates from Supabase
  const { isDateBlocked, loading } = useBlockedDates(accommodationId);

  // Helper: Check if a range hits a blocked date
  const isRangeBlocked = (start: Date, end: Date) => {
    let current = new Date(start);
    while (current <= end) {
      if (isDateBlocked(current)) return true;
      current.setDate(current.getDate() + 1);
    }
    return false;
  };

  const onSelect = (range: DateRange | undefined) => {
    if (!range) {
      onDateChange(undefined, undefined);
      return;
    }

    if (range.from && !range.to) {
      // User selected the first date
      if (isDateBlocked(range.from)) {
         // Don't allow starting on a blocked date
         return; 
      }
      onDateChange(range.from, undefined);
    } else if (range.from && range.to) {
      // User selected the second date (completing the range)
      
      // 1. Check if the range overlaps with any blocked dates
      if (isRangeBlocked(range.from, range.to)) {
        // Reset to just the start date if they try to book over a blocked date
        onDateChange(range.from, undefined);
        return;
      }

      onDateChange(range.from, range.to);
      setIsCalendarOpen(false);
    }
  };

  // Helper to disable tiles in the calendar
  const isDateDisabled = (date: Date) => {
    // 1. Disable past dates
    if (isBefore(date, startOfToday())) return true;
    // 2. Disable dates blocked in Supabase
    if (isDateBlocked(date)) return true;
    
    return false;
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal border-forest bg-white",
              !startDate && "text-muted-foreground",
              // CRITICAL FIX: We do NOT disable the button if 'loading' is true.
              // This ensures the user can always open the calendar.
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-forest" />
            {startDate ? (
              endDate ? (
                <>
                  {format(startDate, "MMM d, yyyy")} -{" "}
                  {format(endDate, "MMM d, yyyy")}
                </>
              ) : (
                format(startDate, "MMM d, yyyy")
              )
            ) : (
              <span>{loading ? "Loading availability..." : "Check-in - Check-out"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={startDate}
            selected={{ from: startDate, to: endDate }}
            onSelect={onSelect}
            numberOfMonths={2}
            disabled={isDateDisabled}
            modifiers={{
              blocked: (date) => isDateBlocked(date),
            }}
            modifiersStyles={{
              blocked: { 
                textDecoration: "line-through", 
                color: "#ef4444", // Red color for booked dates
                opacity: 0.5 
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateRangePicker;