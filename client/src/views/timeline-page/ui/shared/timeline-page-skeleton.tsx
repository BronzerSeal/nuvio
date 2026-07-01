import { Skeleton } from "@/shared/ui/skeleton";

export default function TimelinePageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Slider */}
      <Skeleton className="h-10 w-full rounded-xl" />

      {/* Legend + Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* Timeline */}
      <div className="border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex border-b">
          <Skeleton className="h-12 w-56 rounded-none" />

          <div className="flex flex-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-12 flex-1 rounded-none border-l" />
            ))}
          </div>
        </div>

        {/* Rows */}
        {Array.from({ length: 6 }).map((_, row) => (
          <div key={row} className="flex border-b last:border-b-0">
            <div className="w-56 p-4 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-14" />
            </div>

            <div className="relative flex-1 h-20 border-l">
              <Skeleton className="absolute left-12 top-3 h-14 w-40 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
