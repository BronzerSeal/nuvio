import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";
import { Company } from "@shared/types/bd-types";

export const getUserMemberships = async (count = 5): Promise<Company[]> => {
  const response = await http.get(
    SERVER_ENDPOINTS.user.getMemberships + `?limit=${count}`,
  );

  return response.data;
};
