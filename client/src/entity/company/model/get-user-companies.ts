import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { Company } from "@/shared/types/bd-types";

export const getUserCompanies = async (): Promise<Company[]> => {
  const response = await http.get(SERVER_ENDPOINTS.company.userCompanies);

  return response.data;
};
