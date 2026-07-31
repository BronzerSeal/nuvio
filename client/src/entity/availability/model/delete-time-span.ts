import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";

export const deleteTimeSpan = async (
  availabilityId: string,
  timeSpanId: string,
) => {
  const response = await http.delete(
    SERVER_ENDPOINTS.availability.deleteTimeSpan(availabilityId, timeSpanId),
  );

  return response.data;
};
