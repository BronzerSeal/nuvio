import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { TimelineTask } from "@/shared/types/bd-types";

export const getTimelineTask = async (
  timelineId: string,
): Promise<TimelineTask[]> => {
  const response = await http.get(
    SERVER_ENDPOINTS.timeline.TimelineTasks(timelineId),
  );

  return response.data;
};
