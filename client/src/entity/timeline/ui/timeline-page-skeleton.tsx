import { Skeleton } from "@/shared/ui/skeleton";

const TIME_COLUMNS = ["05:00", "10:00", "15:00", "20:00"];

const ROWS = [
  {
    labelWidth: "w-20",
    subLabelWidth: "w-12",
    slots: [{ left: "8%", width: "22%" }],
  },
  {
    labelWidth: "w-24",
    subLabelWidth: "w-16",
    slots: [{ left: "38%", width: "18%" }],
  },
  {
    labelWidth: "w-16",
    subLabelWidth: "w-10",
    slots: [
      { left: "16%", width: "16%" },
      { left: "62%", width: "24%" },
    ],
  },
  {
    labelWidth: "w-28",
    subLabelWidth: "w-14",
    slots: [{ left: "50%", width: "20%" }],
  },
];

export function TimelinePageSkeleton() {
  return (
    <div className="flex w-full flex-col items-start gap-y-4">
      <div className="mt-4 flex w-full flex-wrap gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-full" />
      </div>

      <div className="flex w-full flex-wrap justify-between gap-2 md:gap-0">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      <div className="relative w-full overflow-auto border bg-background">
        <div className="min-w-[800px]">
          <div className="sticky top-0 z-10 flex h-12 border-b bg-background">
            <div className="sticky left-0 z-[5] flex w-40 items-center border-r bg-background px-4">
              <Skeleton className="h-4 w-12" />
            </div>

            <div className="grid flex-1 grid-cols-4">
              {TIME_COLUMNS.map((time) => (
                <div
                  key={time}
                  className="flex items-center border-r px-2 last:border-r-0"
                >
                  <Skeleton className="h-3 w-10" />
                </div>
              ))}
            </div>
          </div>

          {ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex h-12 border-b last:border-b-0">
              <div className="sticky left-0 z-[5] flex w-40 items-center border-r bg-background px-4">
                <div className="space-y-1.5">
                  <Skeleton className={`h-3.5 ${row.labelWidth}`} />
                  <Skeleton className={`h-2.5 ${row.subLabelWidth}`} />
                </div>
              </div>

              <div className="relative grid flex-1 grid-cols-4">
                {TIME_COLUMNS.map((time) => (
                  <div key={time} className="border-r last:border-r-0" />
                ))}

                {row.slots.map((slot) => (
                  <Skeleton
                    key={`${slot.left}-${slot.width}`}
                    className="absolute inset-y-1 rounded shadow-md"
                    style={{
                      left: slot.left,
                      width: slot.width,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
