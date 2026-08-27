"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TimelineProvider } from "@shared/ui/timeline/timeline";
import {
  Content,
  Nav,
  TimelineContent,
  TimelinePageSkeleton,
  timeToMinutes,
  useCompanyTimeline,
  useTimelineRows,
  useTimelineTasks,
  Zoom,
} from "@entity/timeline";
import { socket } from "@shared/api/websockets";
import { queryClient } from "@shared/lib/query-client";
import EmptyState from "@shared/ui/empty-state";
import { useUpdateTimelineTask } from "@/entity/timeline/queries/queries";

export default function TimelineTab() {
  const [percentageInView, setPercentageInView] = useState(100);
  const { companyId } = useParams() as { companyId?: string };
  const { data: timeline } = useCompanyTimeline(companyId!, !!companyId);
  const timelineId = timeline?.id;

  const updateTask = useUpdateTimelineTask();
  const {
    data: timelineRows,
    isLoading,
    isError,
  } = useTimelineRows(timelineId!, !!timelineId);
  const {
    data: timelineTasks,
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useTimelineTasks(timelineId!, !!timelineId);

  const config = {
    startHour: 5,
    endHour: 24,
    snapIntervalMinutes: 15,
    columnWidth: 160,
  };

  const handlePositionChange = async (
    slotId: string,
    newTime: string,
    newRowId: string,
  ) => {
    try {
      updateTask.mutate({
        timelineId: timelineId!,
        taskId: slotId,
        startTime: newTime,
        rowId: newRowId,
      });

      return true;
    } catch (error) {
      return false;
    }
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

  useEffect(() => {
    if (!timelineId) return;

    const handleTimelineTaskUpdated = () => {
      queryClient.invalidateQueries({
        queryKey: ["timeline-tasks", timelineId],
      });
    };

    const handleTimelineRowUpdated = () => {
      queryClient.invalidateQueries({
        queryKey: ["timeline-rows", timelineId],
      });
    };

    socket.on("timeline-task-updated", handleTimelineTaskUpdated);
    socket.on("timeline-row-updated", handleTimelineRowUpdated);

    return () => {
      socket.off("timeline-task-updated", handleTimelineTaskUpdated);
      socket.off("timeline-row-updated", handleTimelineRowUpdated);
    };
  }, [timelineId]);

  if (isError || isTasksError)
    return <EmptyState text="Not found timeline or Access denied" />;

  if (isLoading || isTasksLoading) {
    return <TimelinePageSkeleton />;
  }

  const slots = timelineTasks ?? [];
  return (
    <div>
      <Content>
        <Zoom value={percentageInView} onValueChange={setPercentageInView} />

        {/* ЦВЕТА + КНОПКИ */}
        <Nav />

        <TimelineProvider
          config={config}
          percentageInView={percentageInView}
          onSlotPositionChange={handlePositionChange}
          onValidateDrop={validateDrop}
          className="w-full"
        >
          <TimelineContent slots={slots} timelineRows={timelineRows ?? []} />
        </TimelineProvider>
      </Content>
    </div>
  );
}
