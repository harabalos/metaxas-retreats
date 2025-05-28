
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
import { isDateBooked } from '@/utils/calendarUtils';

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

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Check if the selected date is booked
      if (isDateBooked(date, accommodationId)) {
        // Don't allow selection of booked dates
        return;
      }
      
      if (!startDate || endDate) {
        // Either we have no start date or we have both dates (so we're resetting)
        onDateChange(date, undefined);
      } else if (date > startDate) {
        // We have a start date and the new date is after it, set as end date
        // Check if any dates in the range are booked
        const daysBetween = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
        let hasBookedDateInRange = false;
        
        for (let i = 1; i < daysBetween; i++) {
          const checkDate = new Date(startDate);
          checkDate.setDate(startDate.getDate() + i);
          if (isDateBooked(checkDate, accommodationId)) {
            hasBookedDateInRange = true;
            break;
          }
        }
        
        if (hasBookedDateInRange) {
          // Don't allow selection if there are booked dates in the range
          return;
        }
        
        onDateChange(startDate, date);
        setIsCalendarOpen(false); // Close calendar after selecting date range
      } else {
        // We have a start date but the new date is before it, so we reset and set new start
        onDateChange(date, undefined);
      }
    }
  };
  
  // Function to check if a date is disabled
  const isDateDisabled = (date: Date) => {
    // Disable dates in the past
    const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
    // Disable booked dates
    const isBooked = isDateBooked(date, accommodationId);
    
    return isPastDate || isBooked;
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
          disabled={disabled}
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
          disabled={isDateDisabled}
          className={cn("p-3 pointer-events-auto")}
          modifiers={{
            booked: (date) => isDateBooked(date, accommodationId),
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
