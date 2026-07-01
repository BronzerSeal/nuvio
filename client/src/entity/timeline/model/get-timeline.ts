import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { Timeline } from "@/shared/types/bd-types";

export const getCompanyTimeline = async (
  companyId: string,
): Promise<Timeline> => {
  const response = await http.get(
    SERVER_ENDPOINTS.company.companyTimeline(companyId),
  );

  return response.data;
};
