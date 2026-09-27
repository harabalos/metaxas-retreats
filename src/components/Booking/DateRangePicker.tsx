import * as React from "react";
import { format, addDays, differenceInCalendarDays, isBefore, startOfToday } from "date-fns";
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
import { dateLocale } from "@/lib/dateLocale";

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
  /** Shortest stay taken, in nights. */
  minNights?: number;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateChange,
  disabled = false,
  accommodationId,
  minNights = 1,
  className,
}: DateRangePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const { language, t } = useLanguage();
  const locale = dateLocale(language);

  // Live availability, read from the Airbnb feeds via /api/availability
  const { isDateBlocked, isStayBlocked, loading, unavailable } = useBlockedDates(accommodationId);

  // Picked the way booking sites do it: the first click is the check-in, the
  // second the checkout, and a click after a complete stay starts a new one.
  // (react-day-picker's own range logic stretches or shrinks the range instead,
  // and would turn a second click on the check-in into a zero-night stay.)
  const nightsFromCheckIn = (day: Date) =>
    startDate && !endDate ? differenceInCalendarDays(day, startDate) : 0;

  const onSelect = (_range: DateRange | undefined, day: Date) => {
    if (startDate && nightsFromCheckIn(day) >= minNights && !isStayBlocked(startDate, day)) {
      onDateChange(startDate, day);
      setIsCalendarOpen(false);
      return;
    }

    // A new check-in: the first click, a click on or before the check-in, a
    // click after a complete stay, or a checkout that would include a booked
    // night, which instead starts a new stay from the clicked day.
    if (!isStayBlocked(day, addDays(day, minNights))) onDateChange(day, undefined);
  };

  // Helper to disable tiles in the calendar
  const isDateDisabled = (date: Date) => {
    // 1. Nothing can be picked until we know what's booked
    if (loading) return true;
    // 2. Disable past dates
    if (isBefore(date, startOfToday())) return true;
    // 3. While picking the checkout, a day too soon after the check-in is off
    //    (rather than read as a new check-in), and a valid checkout is on even
    //    when that night is booked: a guest can leave the morning a booking starts.
    const nights = nightsFromCheckIn(date);
    if (nights > 0 && nights < minNights) return true;
    if (startDate && nights >= minNights && !isStayBlocked(startDate, date)) return false;
    // 4. Any other day can only start a stay, so its first nights must be free.
    return isStayBlocked(date, addDays(date, minNights));
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
                  {format(startDate, "d MMM yyyy", { locale })} –{" "}
                  {format(endDate, "d MMM yyyy", { locale })}
                </>
              ) : (
                format(startDate, "d MMM yyyy", { locale })
              )
            ) : (
              <span>{loading ? t('datePicker.loading') : t('datePicker.placeholder')}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {loading && (
            <p className="px-3 pt-3 pb-1 text-xs text-gray-500 max-w-xs leading-snug" role="status">
              {t('datePicker.loading')}
            </p>
          )}
          {minNights > 1 && !loading && (
            <p className="px-3 pt-3 pb-1 text-xs text-gray-500 max-w-xs leading-snug">
              {t('datePicker.minStay', { nights: t('common.nights', { count: minNights }) })}
            </p>
          )}
          {unavailable && (
            <p className="px-3 pt-3 pb-1 text-xs text-amber-700 max-w-xs leading-snug">
              {UNAVAILABLE_NOTE[language] || UNAVAILABLE_NOTE.en}
            </p>
          )}
          <Calendar
            initialFocus
            mode="range"
            locale={locale}
            defaultMonth={startDate}
            selected={{ from: startDate, to: endDate }}
            onSelect={onSelect}
            numberOfMonths={2}
            disabled={isDateDisabled}
            modifiers={{
              blocked: (date) => isDateBlocked(date) && isDateDisabled(date),
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