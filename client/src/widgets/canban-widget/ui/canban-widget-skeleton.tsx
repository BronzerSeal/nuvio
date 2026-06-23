import { Skeleton } from "@/shared/ui/skeleton";
const CanbanWidgetSkeleton = () => {
  return (
    <div className="grid auto-rows-fr grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, colIndex) => (
        <div key={colIndex} className="space-y-4">
          <Skeleton className="h-6 w-3/5" />
          {Array.from({ length: 4 }).map((_, rowIndex) => (
            <Skeleton key={rowIndex} className="h-20 rounded-md" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default CanbanWidgetSkeleton;
