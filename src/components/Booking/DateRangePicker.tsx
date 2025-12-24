import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
// REMOVED: import { isDateBooked } from '@/utils/calendarUtils';
// ADDED: Import the hook you created
import { useBlockedDates } from '@/hooks/useBlockedDates';

interface DateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDateChange: (start: Date | undefined, end: Date | undefined) => void;
  disabled?: boolean;
  accommodationId: string;
}

export function DateRangePicker({ 
  startDate, 
  endDate, 
  onDateChange, 
  disabled = false,
  accommodationId,
}: DateRangePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // ADDED: Use the hook to get real blocked dates
  const { isDateBlocked, loading } = useBlockedDates(accommodationId);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // UPDATED: Use the hook's function
      if (isDateBlocked(date)) {
        return;
      }
      
      if (!startDate || endDate) {
        onDateChange(date, undefined);
      } else if (date > startDate) {
        // Check if any dates in the range are booked
        const daysBetween = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
        let hasBookedDateInRange = false;
        
        for (let i = 1; i < daysBetween; i++) {
          const checkDate = new Date(startDate);
          checkDate.setDate(startDate.getDate() + i);
          // UPDATED: Use the hook's function
          if (isDateBlocked(checkDate)) {
            hasBookedDateInRange = true;
            break;
          }
        }
        
        if (hasBookedDateInRange) {
          return;
        }
        
        onDateChange(startDate, date);
        setIsCalendarOpen(false); 
      } else {
        onDateChange(date, undefined);
      }
    }
  };
  
  const isDateDisabled = (date: Date) => {
    const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
    // UPDATED: Use the hook's function
    return isPastDate || isDateBlocked(date);
  };

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          id="date-range"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal border-forest bg-white",
            !startDate && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          // UPDATED: Disable if loading
          disabled={disabled || loading}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-forest" />
          {startDate && endDate ? (
            `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`
          ) : startDate ? (
            `${format(startDate, "MMM d, yyyy")} - Select end date`
          ) : (
            "Select dates"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={endDate || startDate}
          onSelect={handleSelect}
          initialFocus
          // UPDATED: Pass loading state
          disabled={loading || isDateDisabled}
          accommodationId={accommodationId}
          className={cn("p-3 pointer-events-auto")}
          modifiers={{
            // UPDATED: Use hook
            booked: (date) => isDateBlocked(date),
            selected: (date) => {
              if (!startDate) return false;
              const dateObj = new Date(date);
              return dateObj.getTime() === startDate.getTime();
            }
          }}
          modifiersStyles={{
            booked: { 
              color: "rgba(255, 0, 0, 0.5)",
              textDecoration: "line-through" 
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export default DateRangePicker;