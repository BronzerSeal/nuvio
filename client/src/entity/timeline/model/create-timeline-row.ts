import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";

export const CreateTimelineRow = async (
  timelineId: string,
  rowName: string,
) => {
  const response = await http.post(
    SERVER_ENDPOINTS.timeline.TimelineRow(timelineId),
    { rowName },
  );

  return response.data;
};
