import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";

export const DeleteTimelineRows = async (
  timelineId: string,
  rowIds: string[],
) => {
  const response = await http.delete(
    SERVER_ENDPOINTS.timeline.TimelineRow(timelineId),
    {
      data: {
        rowIds,
      },
    },
  );

  return response.data;
};
