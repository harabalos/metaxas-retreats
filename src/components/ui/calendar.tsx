import * as React from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayPickerProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { accommodations } from "@/data/accommodations";

export type CalendarProps = DayPickerProps & {
  accommodationId?: string;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  accommodationId,
  ...props
}: CalendarProps) {
  const pricing =
    accommodations.find((acc) => acc.id === accommodationId)?.dailyPricing || {};

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected: "bg-forest text-white hover:bg-forest-dark",
        day_today: "bg-forest-light/30 text-forest-dark font-semibold",
        day_outside:
          "text-muted-foreground opacity-50 aria-selected:opacity-30",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        DayContent: ({ date }) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const price = pricing[dateStr];
          return (
            <div className="flex flex-col items-center justify-center text-xs">
              <span>{format(date, "d")}</span>
              {price !== undefined && (
                <span className="text-[10px] text-gray-500">€{price}</span>
              )}
            </div>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
