import { cn } from "@/shared/lib/utils";
import {
  TimelineSlot,
  TimelineSlotContent,
  TimelineSlotLabel,
} from "@/shared/ui/timeline/timeline";
import {
  getSlotBgColorClass,
  getSlotTextColorClass,
} from "../../model/helpers";
import { Clock, Users } from "lucide-react";
import { TimelineTask } from "@/shared/types/bd-types";

const Slot = ({ slot }: { slot: TimelineTask }) => {
  return (
    <TimelineSlot
      slot={slot}
      className={cn(
        "gap-0 flex flex-col items-start justify-center px-2 bg-background dark:bg-zinc-900",
      )}
    >
      <div
        className={cn(
          getSlotBgColorClass(slot.type),
          "w-1 h-full absolute top-0 left-0",
        )}
      />
      <div className="p-1 h-full flex flex-col justify-between">
        <TimelineSlotLabel className={cn(getSlotTextColorClass(slot.type))}>
          {slot.title}
        </TimelineSlotLabel>
        <TimelineSlotContent className="text-foreground flex gap-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {slot.startTime}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {slot.attendees}
          </span>
        </TimelineSlotContent>
      </div>
    </TimelineSlot>
  );
};

export default Slot;
