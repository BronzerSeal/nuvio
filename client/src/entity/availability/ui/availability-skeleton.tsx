import { Skeleton } from "@/shared/ui/skeleton";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const HOURS = Array.from({ length: 20 }, (_, index) => index + 4);

const SPANS = [
  { day: 1, top: "12%", height: "15%" },
  { day: 2, top: "36%", height: "18%" },
  { day: 4, top: "20%", height: "22%" },
  { day: 5, top: "56%", height: "14%" },
];

export function AvailabilitySkeleton() {
  return (
    <div className="flex h-[600px] w-full flex-col overflow-hidden rounded-md border bg-background select-none">
      <div className="flex w-full border-b bg-muted/40">
        <div className="w-16 flex-shrink-0 border-r p-2" />
        <div className="flex flex-1">
          {DAYS.map((day) => (
            <div
              key={day}
              className="flex-1 border-r px-2 py-3 last:border-r-0"
            >
              <Skeleton className="mx-auto h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        <div className="flex w-16 flex-shrink-0 flex-col border-r bg-muted/10">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="relative flex flex-1 items-center justify-start border-b border-dashed border-muted-foreground/20 pl-3"
            >
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>

        <div className="relative flex flex-1">
          <div className="pointer-events-none absolute inset-0 flex flex-col">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="relative w-full flex-1 border-b border-dashed border-foreground/10 dark:border-muted/60"
              />
            ))}
          </div>

          {DAYS.map((day, dayIndex) => (
            <div
              key={day}
              className="relative min-w-[100px] flex-1 border-r last:border-r-0"
            >
              {SPANS.filter((span) => span.day === dayIndex).map((span) => (
                <Skeleton
                  key={`${day}-${span.top}`}
                  className="absolute left-1 right-1 rounded border bg-muted shadow-sm"
                  style={{
                    top: span.top,
                    height: span.height,
                  }}
                >
                  <div className="flex h-full flex-col justify-between p-3">
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-10 bg-muted-foreground/15" />
                      <Skeleton className="h-2.5 w-7 bg-muted-foreground/15" />
                    </div>
                    <Skeleton className="h-3 w-10 bg-muted-foreground/15" />
                  </div>
                </Skeleton>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AvailabilitySkeleton;
