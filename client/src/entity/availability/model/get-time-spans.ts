import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { TimeSpan } from "@/shared/types/bd-types";

export const getTimeSpans = async (
  availabilityId: string,
): Promise<TimeSpan[]> => {
  const response = await http.get(
    SERVER_ENDPOINTS.availability.getTimeSpans(availabilityId),
  );

  return response.data;
};
