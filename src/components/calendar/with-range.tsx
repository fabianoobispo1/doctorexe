'use client'

import { addDays, format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { DateRange } from 'react-day-picker'
import { ptBR } from 'date-fns/locale'

import { cn } from '@/lib/utils'

import { FormItem } from '../ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
/* import { Label } from '../ui/label' */
import { Calendar } from './calendar'

interface DatePickerWithRangeProps {
  date: {
    from: Date | undefined
    to: Date | undefined
  }
  setDate: (date: { from: Date; to: Date } | undefined) => void
}

export function DatePickerWithRange({
  date: initialDate,
  setDate: setInitialDate,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  })

  React.useEffect(() => {
    if (initialDate.from && initialDate.to) {
      setDate({ from: initialDate.from, to: initialDate.to })
    }
  }, [initialDate])

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate)
    if (newDate && newDate.from && newDate.to) {
      setInitialDate({ from: newDate.from, to: newDate.to })
    }
  }

  return (
    <FormItem className="flex flex-col">
      {/* <Label id="datepicker-range-v9">Datepicker With Range</Label> */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
            aria-labelledby="datepicker-range-v9"
          >
            <CalendarIcon className="mr-2 size-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y', { locale: ptBR })} -{' '}
                  {format(date.to, 'LLL dd, y', { locale: ptBR })}
                </>
              ) : (
                format(date.from, 'LLL dd, y', { locale: ptBR })
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            locale={ptBR}
            mode="range"
            endMonth={new Date(2099, 11)}
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </FormItem>
  )
}
