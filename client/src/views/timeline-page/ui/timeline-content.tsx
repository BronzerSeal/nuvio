import {
  TimelineRow as TimelineRowType,
  TimelineTask,
} from "@/shared/types/bd-types";
import {
  Timeline,
  TimelineCurrentTime,
  TimelineGrid,
  TimelineHeader,
  TimelineRow,
} from "@/shared/ui/timeline/timeline";
import React from "react";
import Row from "./shared/row";
import Slot from "./shared/slot";

interface Props {
  slots: TimelineTask[];
  timelineRows: TimelineRowType[];
}

const TimelineContent = ({ slots, timelineRows }: Props) => {
  return (
    <Timeline slots={slots} rows={timelineRows ?? []}>
      <TimelineGrid>
        <TimelineHeader columnLabel="Roles" className="bg-background" />
        {timelineRows?.map((row) => (
          <TimelineRow
            key={row.id}
            row={row}
            slots={slots}
            className="text-xs bg-background"
            renderRowHeader={(row: TimelineRowType) => <Row row={row} />}
          >
            {(slot: TimelineTask) => <Slot slot={slot} />}
          </TimelineRow>
        ))}
        <TimelineCurrentTime />
      </TimelineGrid>
    </Timeline>
  );
};

export default TimelineContent;
