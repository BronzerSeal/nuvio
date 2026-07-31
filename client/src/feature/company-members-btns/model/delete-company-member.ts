import { http } from "@/shared/api/http";
import { SERVER_ENDPOINTS } from "@/shared/config/server-endpoints";

export const DeleteCompanyMember = async (
  companyId: string,
  memberId: string,
) => {
  const response = await http.delete(
    SERVER_ENDPOINTS.company.CompanyMemberships(companyId),
    {
      params: { memberId },
    },
  );

  return response.data;
};
