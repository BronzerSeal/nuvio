import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";

export const joinOrCreateCompany = async (companyName: string) => {
  const response = await http.post(
    SERVER_ENDPOINTS.company.joinOrCreateCompany,
    {
      companyName,
    },
  );

  return response.data;
};
