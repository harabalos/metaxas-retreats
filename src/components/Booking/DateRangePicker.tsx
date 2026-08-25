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
import { useLanguage } from "@/context/LanguageContext";

// Shown when the live calendar can't be reached — better to admit we don't know
// than to imply every date is free.
const UNAVAILABLE_NOTE: Record<string, string> = {
  en: "We couldn't check live availability — we'll confirm your dates by email.",
  el: "Δεν ήταν δυνατός ο έλεγχος διαθεσιμότητας — θα επιβεβαιώσουμε τις ημερομηνίες με email.",
  it: "Impossibile verificare la disponibilità — confermeremo le date via email.",
  de: "Verfügbarkeit nicht abrufbar — wir bestätigen Ihre Daten per E-Mail.",
  ro: "Nu am putut verifica disponibilitatea — confirmăm datele prin email.",
};

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
  const { language } = useLanguage();

  // Live availability, read from the Airbnb feeds via /api/availability
  const { isDateBlocked, loading, unavailable } = useBlockedDates(accommodationId);

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
    // 2. Disable nights that are already booked
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
          {unavailable && (
            <p className="px-3 pt-3 pb-1 text-xs text-amber-700 max-w-xs leading-snug">
              {UNAVAILABLE_NOTE[language] || UNAVAILABLE_NOTE.en}
            </p>
          )}
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