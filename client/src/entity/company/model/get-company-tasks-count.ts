import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";

export const getCompanyTasksCount = async (
  companyId: string,
): Promise<{ count: number }> => {
  const response = await http.get(
    SERVER_ENDPOINTS.company.companyTasksCount(companyId),
  );

  return response.data;
};
