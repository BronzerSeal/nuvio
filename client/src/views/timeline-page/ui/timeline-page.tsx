"use client";

import { useState } from "react";
import {
  TimelineProvider,
  Timeline,
  TimelineGrid,
  TimelineRow,
  TimelineRowData,
  TimelineSlot,
  TimelineSlotData,
  TimelineSlotLabel,
  TimelineSlotContent,
  TimelineHeader,
  TimelineCurrentTime,
} from "@shared/ui/timeline/timeline";
import { Users, Clock } from "lucide-react";
import { cn } from "@shared/lib/utils";
import { getSlotBgColorClass, getSlotTextColorClass } from "../model/helpers";
import { dummyRows, initialSlots } from "../const/const";
import { timeToMinutes } from "../model/utils";
import ColorCodes from "./color-codes";
import { GlassSlider } from "@/shared/ui/slider";
import Content from "./content";
import { useParams } from "next/navigation";
import CreateRowBtn from "./create-row-btn";
import { useTimelineRows } from "@/entity/timeline";

export default function TimelinePage() {
  const [slots, setSlots] = useState<TimelineSlotData[]>(initialSlots);
  const [percentageInView, setPercentageInView] = useState(100);
  const { timelineId } = useParams() as { timelineId: string | undefined };
  const { data: timelineRows } = useTimelineRows(timelineId!, !!timelineId);

  const config = {
    startHour: 9,
    endHour: 18,
    snapIntervalMinutes: 15,
    columnWidth: 160,
  };

  const handlePositionChange = async (
    slotId: string,
    newTime: string,
    newRowId: string,
  ) => {
    // Update slots state
    setSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.id === slotId
          ? { ...slot, startTime: newTime, rowId: newRowId }
          : slot,
      ),
    );

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  };

  const validateDrop = (slotId: string, newTime: string, newRowId: string) => {
    // Example: Check for time conflicts
    const draggedSlot = slots.find((s) => s.id === slotId);
    if (!draggedSlot) return false;

    const conflicts = slots.filter((s) => {
      if (s.id === slotId) return false;
      if (s.rowId !== newRowId) return false;

      // Simple overlap check
      const sStart = timeToMinutes(s.startTime);
      const sEnd = sStart + s.duration;
      const dragStart = timeToMinutes(newTime);
      const dragEnd = dragStart + draggedSlot.duration;

      return dragStart < sEnd && dragEnd > sStart;
    });

    return conflicts.length === 0;
  };

  const handleSlotClick = (slotId: string) => {
    const slot = slots.find((s) => s.id === slotId);
    if (slot) {
      console.log("Clicked slot:", slot);
    }
  };

  return (
    <div>
      <Content>
        <div className="flex flex-wrap gap-2 mt-4 w-full">
          <p className="leading-none mb-0  min-w-20">Zoom level</p>
          <GlassSlider
            className="w-full"
            value={percentageInView}
            onValueChange={setPercentageInView}
            colorA={"#06D6A0"}
            colorB={"#5B8FF9"}
            delay={0.08 + 1 * 0.06}
          />
        </div>

        {/* ЦВЕТА  */}
        <div className="flex  justify-between w-full">
          <ColorCodes />
          <CreateRowBtn />
        </div>

        <TimelineProvider
          config={config}
          percentageInView={percentageInView}
          onSlotPositionChange={handlePositionChange}
          onValidateDrop={validateDrop}
          onSlotClick={handleSlotClick}
          className="w-full"
        >
          <Timeline slots={slots} rows={dummyRows}>
            <TimelineGrid>
              <TimelineHeader columnLabel="Roles" className="bg-background" />
              {/* {dummyRows?.map((row) => ( */}
              {timelineRows?.map((row) => (
                <TimelineRow
                  key={row.id}
                  row={row}
                  slots={slots}
                  className="text-xs bg-background"
                  renderRowHeader={(row: TimelineRowData) => {
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
                  }}
                >
                  {(slot: TimelineSlotData) => (
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
                        <TimelineSlotLabel
                          className={cn(getSlotTextColorClass(slot.type))}
                        >
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
                  )}
                </TimelineRow>
              ))}
              <TimelineCurrentTime />
            </TimelineGrid>
          </Timeline>
        </TimelineProvider>
      </Content>
    </div>
  );
}
