import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { TimelineRow } from "@/shared/types/bd-types";

export const getTimelineRows = async (
  timelineId: string,
): Promise<TimelineRow[]> => {
  const response = await http.get(
    SERVER_ENDPOINTS.timeline.TimelineRow(timelineId),
  );

  return response.data;
};
