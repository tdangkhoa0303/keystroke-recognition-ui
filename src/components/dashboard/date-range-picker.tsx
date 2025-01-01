import { CalendarIcon } from '@radix-ui/react-icons';
import { format, set } from 'date-fns';
import { DateRange, SelectRangeEventHandler } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface CalendarDateRangePickerProps {
  value?: DateRange;
  className?: string;
  onChange: (selectedDateRange: DateRange | undefined) => void;
}

export function CalendarDateRangePicker({
  onChange,
  className,
  value: dateRangeValue,
}: CalendarDateRangePickerProps) {
  const [internalValue, setInternalValue] = useState<DateRange | undefined>(
    dateRangeValue
  );

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover
        onOpenChange={(open) => {
          if (!open) {
            onChange(internalValue);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[260px] justify-start text-left font-normal',
              !internalValue && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {internalValue?.from ? (
              internalValue.to ? (
                <>
                  {format(internalValue.from, 'LLL dd, y')} -{' '}
                  {format(internalValue.to, 'LLL dd, y')}
                </>
              ) : (
                format(internalValue.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={internalValue?.from}
            selected={internalValue}
            onSelect={setInternalValue}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
