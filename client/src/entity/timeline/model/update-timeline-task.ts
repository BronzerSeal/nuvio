import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { Timeline } from "@/shared/types/bd-types";

export const updateTimelineTask = async (
  timelineId: string,
  taskId: string,
  startTime: string,
  rowId: string,
): Promise<Timeline> => {
  const response = await http.patch(
    SERVER_ENDPOINTS.timeline.updateTask(timelineId, taskId),
    {
      startTime,
      rowId,
    },
  );

  return response.data;
};
