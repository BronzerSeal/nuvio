import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";

type UpdateTimeSpanParams = {
  availabilityId: string;
  timeSpanId: string;
  week_day?: number;
  start_time?: string;
  end_time?: string;
  active?: boolean;
};

export const updateTimeSpan = async ({
  availabilityId,
  timeSpanId,
  week_day,
  start_time,
  end_time,
  active,
}: UpdateTimeSpanParams) => {
  const response = await http.patch(
    SERVER_ENDPOINTS.availability.updateTimeSpan(availabilityId, timeSpanId),
    {
      week_day,
      start_time,
      end_time,
      active,
    },
  );

  return response.data;
};
