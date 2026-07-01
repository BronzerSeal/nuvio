import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";

export const createTimelineTask = async (
  timelineId: string,
  rowId: string,
  startTime: string,
  duration: number,
  title: string,
  type: "meeting" | "workshop" | "break" | "review",
  attendees: number,
) => {
  const response = await http.post(
    SERVER_ENDPOINTS.timeline.createTimelineTask(timelineId, rowId),
    {
      startTime,
      duration,
      title,
      type,
      attendees,
    },
  );

  return response.data;
};
