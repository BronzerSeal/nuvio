import { TimelineRow } from "@/shared/types/bd-types";
import { Users } from "lucide-react";

const Row = ({ row }: { row: TimelineRow }) => {
  return (
    <div className="flex flex-col gap-0.5 items-start pl-3">
      <p className="text-xs font-medium">{row.label}</p>
      <div className="flex items-center gap-1">
        <Users className="w-3 h-3 text-muted-foreground" />
        <p className="text-xs font-medium text-muted-foreground">
          {row.capacity}
        </p>
      </div>
    </div>
  );
};

export default Row;
