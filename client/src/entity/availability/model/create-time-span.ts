import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";

export const createTimeSpan = async (
  availabilityId: string,
  week_day: number,
  start_time: string,
  end_time: string,
  active?: boolean,
) => {
  const response = await http.post(
    SERVER_ENDPOINTS.availability.createTimeSpan(availabilityId),
    {
      week_day,
      start_time,
      end_time,
      active,
    },
  );

  return response.data;
};
