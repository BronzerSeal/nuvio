import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";

export const DeleteTimelineTasks = async (
  timelineId: string,
  taskIds: string[],
) => {
  const response = await http.delete(
    SERVER_ENDPOINTS.timeline.TimelineTasks(timelineId),
    {
      data: {
        taskIds,
      },
    },
  );

  return response.data;
};
