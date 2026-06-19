"use client";

import { FC, useId, useState } from "react";
import { format, addDays, addMonths, addYears } from "date-fns";

import { cn } from "@shared/lib/utils";
import { Button } from "@shared/ui/button";
import { Calendar } from "@/shared/ui/calendar/calendar";
import { Card, CardContent } from "@shared/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover/popover";
import { CalendarIcon } from "lucide-react";

interface Props {
  onChange: (date: Date) => void;
  value?: Date;
}

export function DueCalendar({ value, onChange }: Props) {
  const id = useId();
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);
  const nextMonth = addMonths(today, 1);
  const nextYear = addYears(today, 1);
  const [month, setMonth] = useState(today);
  const date = value ?? new Date();

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            className="group/pick-date w-60 justify-between"
            id={id}
            variant={"outline"}
          >
            <span className={cn("truncate", date && "text-muted-foreground")}>
              {date ? format(date, "LLL dd, y") : "Pick a date"}
            </span>
            <CalendarIcon
              aria-hidden="true"
              className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
            />
          </Button>
        }
      />
      <PopoverContent align="start" className="w-auto p-0">
        <Card className="p-0">
          <CardContent className="p-0">
            <div className="flex max-sm:flex-col">
              <div className="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32">
                <div className="h-full sm:border-e">
                  <div className="flex flex-col px-2">
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        onChange(today);
                        setMonth(today);
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      Today
                    </Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        onChange(tomorrow);
                        setMonth(tomorrow);
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      Tomorrow
                    </Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        onChange(nextWeek);
                        setMonth(nextWeek);
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      Next week
                    </Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        onChange(nextMonth);
                        setMonth(nextMonth);
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      Next month
                    </Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => {
                        onChange(nextYear);
                        setMonth(nextYear);
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      Next year
                    </Button>
                  </div>
                </div>
              </div>
              <Calendar
                disabled={[{ before: today }]}
                mode="single"
                month={month}
                onMonthChange={setMonth}
                onSelect={(newDate) => {
                  if (newDate) {
                    onChange(newDate);
                  }
                }}
                selected={date}
              />
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
