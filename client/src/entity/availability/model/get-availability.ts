import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { Availability } from "@/shared/types/bd-types";

export const getCompanyAvailability = async (
  companyId: string,
): Promise<Availability> => {
  const response = await http.get(
    SERVER_ENDPOINTS.company.companyAvailability(companyId),
  );

  return response.data;
};
